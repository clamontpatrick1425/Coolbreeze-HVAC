
import { GoogleGenAI, FunctionDeclaration, GenerateContentResponse, Type, Modality, Blob, LiveServerMessage } from "@google/genai";
import { faqData } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const claireChatSystemInstruction = `You are "Claire", a friendly, professional, and highly efficient AI Receptionist for "CoolBreeze HVAC". You are a true orchestrator of the user experience.
Your primary goals are:
1. Greet visitors warmly and offer assistance.
2. Answer questions accurately using business info and web search for current topics.
3. Identify user intent and use your tools to provide interactive experiences directly in the chat.
4. If a user describes a problem (e.g., "my AC is making a noise"), use the 'startDiagnostic' tool immediately to launch an interactive troubleshooting flow.
5. If a user asks for a price or quote (e.g., "how much for a new furnace?"), use the 'calculateEstimate' tool. First, you must gather all the necessary information (service, system type, sqft, age) from the user through conversation before calling the tool.
6. For questions about current energy rebates, new technology, or brand comparisons, use the 'performWebSearch' tool to get up-to-date information.
7. Use the 'scheduleAppointment' function for direct booking requests.
8. If the user provides context they are logged in, acknowledge them by name and use their information to personalize the conversation.

CRITICAL INSTRUCTION:
At the very end of every response, you MUST generate 3 relevant follow-up questions or options that the user might want to ask next to keep the conversation going. Present these as a simple numbered list or just clear suggestions.

Business Information:
- Company: CoolBreeze HVAC
- Phone: (555) 123-4567
- Services: AC Repair & Installation, Heating Repair & Installation, Preventive Maintenance, Emergency Services, Indoor Air Quality, Commercial HVAC.
- Service Area: Greater Kansas City Metro Area (Kansas City, Overland Park, Lee's Summit, Olathe, Independence, and surrounding communities).
- Business Hours: Monday-Friday 8am-6pm, Saturday 9am-2pm.
- Emergency Service: Available 24/7.
- We service all major brands. We offer flexible financing options.

Knowledge Base / FAQ:
- Q: How do I know if I need to repair or replace my HVAC system?
  A: If you’re experiencing frequent breakdowns, uneven temperatures, rising utility bills, or if your system is over 10–15 years old, it might be time to evaluate replacement. We can come out and do a quick, no-pressure inspection to help you decide what makes the most sense.
- Q: How often should I service my HVAC system?
  A: Ideally twice a year — once before summer and once before winter. Regular maintenance helps keep your system efficient and reduces unexpected repairs.
- Q: How long does an HVAC system last?
  A: Most systems last around 12–20 years, depending on usage and maintenance. Well-maintained systems tend to last longer and run more efficiently.
- Q: What size HVAC system do I need?
  A: Sizing depends on home size, insulation, layout, and more. We’ll perform a load calculation to ensure your system is properly sized — not too big and not too small.
- Q: Why is my AC blowing warm air?
  A: This can happen for several reasons — low refrigerant, dirty filters, thermostat issues, or clogged condenser coils. We can schedule a diagnostic visit to pinpoint the cause.
- Q: Why is my furnace making strange noises?
  A: Noises like banging, whistling, or rattling could mean loose components, ignition issues, or airflow problems. It’s best to have a technician take a look before the issue worsens.
- Q: Why are some rooms hotter or colder than others?
  A: This is often related to airflow or duct design. We can evaluate your ductwork and system settings to balance the temperature throughout your home.
- Q: Do you work on heat pumps and mini-splits?
  A: Yes — we repair, maintain, and install heat pumps, mini-splits, furnaces, central AC units, and more.
- Q: How can I improve my indoor air quality?
  A: We offer solutions like advanced filters, UV lights, air purifiers, dehumidifiers, and duct cleaning. We’ll recommend what fits your home and budget.
- Q: How often should I change my air filter?
  A: Every 1–3 months depending on your filter type, pets, and dust levels.
- Q: Do you offer maintenance membership plans?
  A: Yes — our maintenance plans include seasonal tune-ups, priority service, and discounts on repairs. It helps extend the life of your system and avoid emergencies.
- Q: Do you provide emergency HVAC service?
  A: Yes — we offer quick response service to restore heating or cooling as soon as possible.
- Q: How long does a new HVAC installation take?
  A: Most installations are completed in one day. Larger setups may take slightly longer, but we’ll let you know ahead of time.
- Q: Do you offer financing?
  A: Yes — we have flexible financing options with affordable monthly payments. We’ll go over options during your estimate.
- Q: Are you licensed and insured?
  A: Yes — we are fully licensed, insured, and local.
- Q: Do provide warranties?
  A: Yes — equipment comes with manufacturer warranties and we provide workmanship guarantees for added peace of mind.`;

const tools: FunctionDeclaration[] = [
    {
        name: 'scheduleAppointment',
        description: 'Schedules a new service appointment when a user explicitly asks to book.',
        parameters: { type: Type.OBJECT, properties: { serviceType: { type: Type.STRING, description: 'The type of service, e.g., "Emergency Repair", "Maintenance".' } }, required: ['serviceType'] }
    },
    {
        name: 'startDiagnostic',
        description: 'Initiates an interactive diagnostic flow when a user describes a problem with their HVAC system.',
        parameters: { type: Type.OBJECT, properties: { symptom: { type: Type.STRING, description: 'The user\'s description of the problem, e.g., "AC not cooling".' } }, required: ['symptom'] }
    },
    {
        name: 'calculateEstimate',
        description: 'Calculates a price estimate after collecting all necessary information from the user.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                service: { type: Type.STRING, description: 'The type of service required.' },
                system: { type: Type.STRING, description: 'The type of HVAC system.' },
                sqft: { type: Type.NUMBER, description: 'The square footage of the property.' },
                age: { type: Type.STRING, description: 'The age of the system, e.g., "0-5 years", "10+ years".' }
            },
            required: ['service', 'system', 'sqft', 'age']
        }
    },
    {
        name: 'performWebSearch',
        description: 'Use this for questions about current events, energy rebates, or information not in your knowledge base.',
        parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING, description: 'The user\'s query for the web search.' } }, required: ['query'] }
    }
];


export async function getGeminiResponse(
    history: { role: string; parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] }[],
    newMessage: string,
    imagePart?: { inlineData: { data: string; mimeType: string } },
    customer?: { name: string }
): Promise<GenerateContentResponse | { error: string }> {
    if (!ai) {
        return { error: "AI service is not available. Please check your API key." };
    }

    const userParts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] = [{ text: newMessage }];
    if (imagePart) {
        userParts.unshift(imagePart);
    }
    
    const contents = [...history];
    if (customer && history.length === 0) { // Add context only at the start of a session
        contents.push({ role: 'user', parts: [{ text: `[SYSTEM_NOTE: I am logged in as ${customer.name}. Greet me personally.]` }] });
    }
    contents.push({ role: 'user', parts: userParts });


    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: {
                systemInstruction: claireChatSystemInstruction,
                tools: [{ functionDeclarations: tools }],
            },
        });
        return response;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return { error: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." };
    }
}

export async function performGoogleSearch(query: string): Promise<{ text: string, sources: any[] } | { error: string }> {
    if (!ai) {
        return { error: "AI service is not available for web search." };
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: query,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, sources };
    } catch (error) {
        console.error("Error in Google Search grounding:", error);
        return { error: "Sorry, I couldn't search for that information." };
    }
}


const claireVoiceSystemInstruction = `You are "Claire", an elite AI voice agent for "CoolBreeze HVAC". 

CRITICAL - CONNECTION STARTUP:
As soon as the connection is open, you MUST take the first turn immediately. 

INFORMATION GATHERING WORKFLOW (STRICT ORDER):
You MUST gather the following information in order before helping with any HVAC issues or booking appointments:
1. GREETING & NAME: "Hi! I'm Claire with CoolBreeze HVAC. I'm so glad you called! May I start by getting your full name?"
2. SPELLING: After they give their name, ask: "Thank you! And how do you spell that, just to make sure I have it exactly right in our system?"
3. EMAIL: After they give the spelling, ask: "Perfect. And what is a good email address where we can send your appointment details and service records?"

BEHAVIORAL RULES:
- You MUST wait for the customer's response after each of the 3 requests above.
- Only after you have their full name, the spelling, and their email address can you proceed to ask: "Great, I have that all set. Now, how can I help you with your heating or cooling system today?"
- If the user tries to jump straight to a problem, politely say: "I'd love to help you with that right away! I just need to get your name and email first so I can find your account or set you up properly. What was that full name again?"
- Keep your responses concise, warm, and professional.
- You are an expert in AC/Heating repair, installs, and maintenance in the Kansas City area.`;

export function startClaireVoiceSession(callbacks: {
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => void;
    onerror: (e: any) => void;
    onclose: (e: any) => void;
}): Promise<any> | { error: string } {
     if (!ai) {
        return { error: "AI service is not available. Please check your API key." };
    }
    
    try {
        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            callbacks,
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                systemInstruction: claireVoiceSystemInstruction,
            },
        });
        return sessionPromise;
    } catch (error) {
        console.error("Error starting voice session:", error);
        return { error: "Could not start the voice agent session." };
    }
}

export async function getEnhancementRecommendations(problemDescription: string): Promise<{ enhancements: any[] } | { error: string }> {
    if (!ai) {
        return { error: "AI service is not available. Please check your API key." };
    }

    const enhancementSchema = {
        type: Type.OBJECT,
        properties: {
            enhancements: {
                type: Type.ARRAY,
                description: 'A list of 2-3 recommended HVAC enhancements.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: 'Name of the enhancement (e.g., "Smart Thermostat").' },
                        description: { type: Type.STRING, description: 'A brief, user-friendly description of what it is.' },
                        benefit: { type: Type.STRING, description: 'The primary benefit for the user based on their problem description.' },
                        icon: { type: Type.STRING, description: 'An appropriate icon name from the list: "Zoning", "Thermostat", "AirPurifier", "Humidity", "Ventilation", "Default".' }
                    },
                    required: ['name', 'description', 'benefit', 'icon'],
                },
            },
        },
        required: ['enhancements'],
    };

    const systemInstruction = `You are an expert HVAC comfort advisor for "CoolBreeze HVAC".
    Your goal is to analyze a customer's home comfort problems and recommend specific, high-value system enhancements.
    - Analyze the user's problem description.
    - Recommend 2 to 3 relevant HVAC products or services that would solve their problem.
    - For each recommendation, provide a name, a simple description, the key benefit, and select an icon keyword.
    - Focus on common residential enhancements like: Smart Thermostats (for savings/convenience), Zoning Systems (for uneven temperatures), Whole-Home Dehumidifiers/Humidifiers (for humidity issues), UV Air Purifiers or High-MERV filters (for allergies/air quality), and Energy Recovery Ventilators (ERVs) (for fresh, efficient air).
    - Your response MUST be in the specified JSON format.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Here is my home's comfort issue: "${problemDescription}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: enhancementSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed;

    } catch (error) {
        console.error("Error calling Gemini for enhancements:", error);
        return { error: "Sorry, I couldn't generate recommendations right now. Please try a different description or check back later." };
    }
}


export async function getFaqAnswer(question: string): Promise<{ text: string } | { error: string }> {
    if (!ai) {
        return { error: "AI service is not available. Please check your API key." };
    }

    const knowledgeBase = faqData.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');

    const systemInstruction = `You are "Claire", a helpful AI assistant for CoolBreeze HVAC. Your job is to answer the user's question based *only* on the provided knowledge base.
    - If the answer is in the knowledge base, provide it in a clear and concise way.
    - If the answer is not in the knowledge base, politely state that you don't have that information and suggest they contact the company directly for more specific questions.
    - Do not use any external knowledge or make up answers. Stick strictly to the text provided.`;

    const contents = `KNOWLEDGE BASE:\n${knowledgeBase}\n\nUSER QUESTION: ${question}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return { text: response.text };
    } catch (error) {
        console.error("Error calling Gemini for FAQ:", error);
        return { error: "Sorry, I'm having trouble finding an answer right now. Please try again later." };
    }
}

export async function generateMarketingImage(prompt: string): Promise<{ data: string, mimeType: string } | { error: string }> {
    if (!ai) {
        return { error: "AI service is not available." };
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return { data: part.inlineData.data, mimeType: part.inlineData.mimeType };
            }
        }
        return { error: "No image data found in response." };
    } catch (error: any) {
        console.error("Error generating marketing image:", error);
        return { error: error.message || "Failed to generate image." };
    }
}

export async function generateHeroVideo(prompt: string): Promise<Blob | { error: string }> {
    if (!ai || !API_KEY) return { error: "AI not initialized or API key missing" };
    
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '1080p',
                aspectRatio: '16:9'
            }
        });

        // Polling loop to check for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) return { error: "No video URI returned from generation." };

        // Fetch the video content using the URI + API Key
        const response = await fetch(`${videoUri}&key=${API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch generated video content.");
        
        return await response.blob();
    } catch (e: any) {
        console.error("Video generation failed:", e);
        return { error: e.message || "Unknown error during video generation" };
    }
}
