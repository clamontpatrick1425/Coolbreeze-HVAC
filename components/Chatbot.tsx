
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Message, ServiceType } from '../types';
import { getGeminiResponse, performGoogleSearch } from '../services/geminiService';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon, CameraIcon, MicrophoneIcon } from './icons';
import { DiagnosticTool } from './DiagnosticTool';

interface ChatbotProps {
    openBookingModal: (service?: ServiceType) => void;
    isLoggedIn: boolean;
    currentUser: { name: string } | null;
}

// --- Estimate Calculation Logic (from EstimateCalculator) ---
const BASE_COSTS = {
    [ServiceType.Maintenance]: 150, [ServiceType.ScheduledRepair]: 350, [ServiceType.NewInstallation]: 6000,
    [ServiceType.EmergencyRepair]: 500, [ServiceType.AirQuality]: 800, [ServiceType.Commercial]: 10000,
    [ServiceType.QuoteRequest]: 0,
};
const SYSTEM_MULTIPLIERS: Record<string, number> = { 'AC Unit': 1.0, 'Furnace': 1.0, 'Heat Pump': 1.2, 'Mini-Split': 1.5, 'Commercial Rooftop': 2.5 };
const AGE_MULTIPLIERS: Record<string, number> = { '0-5 years': 1.0, '5-10 years': 1.1, '10+ years': 1.25 };
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

function calculateEstimate(service: ServiceType, system: string, sqft: number, age: string): { lowEstimate: number, highEstimate: number } {
    const base = BASE_COSTS[service] || 350;
    const systemMult = SYSTEM_MULTIPLIERS[system] || 1;
    const ageMult = service === ServiceType.ScheduledRepair ? AGE_MULTIPLIERS[age] : 1;
    let sizeMult = 1;
    if (service === ServiceType.NewInstallation) sizeMult = sqft / 1000;
    const calculatedCost = base * systemMult * ageMult * sizeMult;
    return { lowEstimate: calculatedCost * 0.8, highEstimate: calculatedCost * 1.2 };
};
// --- End Estimate Logic ---

const SUGGESTION_CHIPS = ["Book a repair", "Get a quote", "My AC isn't cooling", "Maintenance plans"];

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});


export const Chatbot = forwardRef((props: ChatbotProps, ref) => {
    const { openBookingModal, isLoggedIn, currentUser } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [diagnosticState, setDiagnosticState] = useState<{ active: boolean, symptom?: string }>({ active: false });
    const [userName, setUserName] = useState<string | null>(null);
    const [isAwaitingName, setIsAwaitingName] = useState(false);
    const [showTeaser, setShowTeaser] = useState(false);
    const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatHistoryRef = useRef<{ role: string; parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] }[]>([]);
    
    useImperativeHandle(ref, () => ({
        openWithImage: (file: File) => {
            setIsOpen(true);
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            // Give a nudge if it's the first time
            if (messages.length > 0) {
                 addMessage({
                    id: Date.now().toString() + 'nudge',
                    text: "I see you've uploaded a photo! I'm Claire, and I can analyze this for you. Just hit send when you're ready.",
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                 });
            }
        }
    }));

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages, isLoading]);

    // Proactive Initiation: Show teaser bubble ONLY (Removed auto-open)
    useEffect(() => {
        const teaserTimer = setTimeout(() => {
            if (!hasOpenedOnce) setShowTeaser(true);
        }, 3000);

        return () => {
            clearTimeout(teaserTimer);
        };
    }, [hasOpenedOnce]);
    
    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const handleVoiceInput = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                 setIsListening(true);
            };

            recognition.onend = () => {
                 setIsListening(false);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + (prev ? ' ' : '') + transcript);
            };
            
            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
            
            recognition.start();
        } else {
            alert("Voice input is not supported in this browser. Please try Chrome or Edge.");
        }
    };

    const processAndSend = async (text: string, image?: File | null) => {
        setIsLoading(true);
        let imagePart;
        if (image) {
            const base64Data = await fileToBase64(image);
            imagePart = { inlineData: { data: base64Data, mimeType: image.type } };
        }

        const geminiResponse = await getGeminiResponse(chatHistoryRef.current, text, imagePart, currentUser || undefined);
        
        let botResponseText: string | React.ReactNode = "I'm not sure how to handle that.";
        let modelResponseForHistory = "";

        if ('error' in geminiResponse) {
             botResponseText = geminiResponse.error;
             modelResponseForHistory = geminiResponse.error;
        } else {
            const functionCalls = geminiResponse.functionCalls;
            if (functionCalls && functionCalls.length > 0) {
                 const call = functionCalls[0];
                 modelResponseForHistory = `[Function Call: ${call.name}]`;
                 switch(call.name) {
                    case 'scheduleAppointment':
                        const service = Object.values(ServiceType).find(s => s.toLowerCase() === call.args.serviceType?.toLowerCase()) || ServiceType.ScheduledRepair;
                        openBookingModal(service);
                        botResponseText = `Of course! Let's get you scheduled for a ${service}. I've opened the booking form for you.`;
                        break;
                    case 'startDiagnostic':
                        setDiagnosticState({ active: true, symptom: call.args.symptom });
                        botResponseText = "I can help with that. Please answer the questions below to start the diagnostic process.";
                        break;
                    case 'calculateEstimate':
                        const { lowEstimate, highEstimate } = calculateEstimate(call.args.service, call.args.system, call.args.sqft, call.args.age);
                        botResponseText = `Based on your information, the estimated range is ${formatCurrency(lowEstimate)} - ${formatCurrency(highEstimate)}. This is for budgeting purposes only. Would you like to book a precise on-site quote?`;
                        break;
                    case 'performWebSearch':
                        const searchResult = await performGoogleSearch(call.args.query);
                        if ('error' in searchResult) {
                            botResponseText = searchResult.error;
                        } else {
                            const sources = searchResult.sources.map((s: any) => `[${s.web.title}](${s.web.uri})`).join(', ');
                            botResponseText = <div><p className="text-xl">{searchResult.text}</p><p className="text-sm mt-2 opacity-70">Sources: {sources}</p></div>;
                        }
                        break;
                     default:
                        botResponseText = "It looks like you need something specific. Let me open our booking form to capture all the details.";
                        openBookingModal();
                 }
            } else {
                botResponseText = geminiResponse.text || "Sorry, I couldn't process that. Please try again.";
                modelResponseForHistory = geminiResponse.text;
            }
        }
        
        const botMessage: Message = { id: Date.now().toString() + 'bot', text: botResponseText, sender: 'bot', timestamp: new Date().toISOString() };
        addMessage(botMessage);
        
        chatHistoryRef.current.push({ role: 'user', parts: [{ text: text }] });
        chatHistoryRef.current.push({ role: 'model', parts: [{ text: modelResponseForHistory }] });
        setIsLoading(false);
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !imageFile) || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: (
                 <div className="space-y-2">
                    {imagePreview && <img src={imagePreview} alt="User upload" className="rounded-lg max-w-full h-auto max-h-48" />}
                    {input.trim() && <p className="text-xl">{input}</p>}
                </div>
            ),
            sender: 'user',
            timestamp: new Date().toISOString(),
        };
        addMessage(userMessage);
        
        const currentInput = input;
        const currentImageFile = imageFile;
        setInput('');
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        
        if (isAwaitingName) {
            setUserName(currentInput);
            setIsAwaitingName(false);

            const greetingNode = (
                <div>
                    <p className="text-xl">{`Nice to meet you, ${currentInput}! How can I help you today?`}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {SUGGESTION_CHIPS.map((text, i) => (
                             <button 
                                key={i} 
                                onClick={() => handleSuggestionClick(text)}
                                className="text-base font-semibold text-blue-700 bg-blue-100 py-2 px-4 rounded-full hover:bg-blue-200 transition-colors"
                             >
                                 {text}
                             </button>
                        ))}
                    </div>
                </div>
            );
            const botMessage: Message = { id: Date.now().toString() + 'bot', text: greetingNode, sender: 'bot', timestamp: new Date().toISOString() };
            addMessage(botMessage);
            
            chatHistoryRef.current.push({ role: 'user', parts: [{ text: `[SYSTEM_NOTE: My name is ${currentInput}.]` }] });

        } else {
            // If user only uploads image without text, provide a default prompt for Claire
            const finalInput = currentInput.trim() || "Please analyze this image and help me identify any issues.";
            await processAndSend(finalInput, currentImageFile);
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        if (isLoading) return;
        const userMessage: Message = {
            id: Date.now().toString(),
            text: <p className="text-xl">{suggestion}</p>,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };
        addMessage(userMessage);
        processAndSend(suggestion);
    };

    // Reset state when chat is opened
    useEffect(() => {
        if(isOpen) {
            setHasOpenedOnce(true);
            setShowTeaser(false);
            // Don't reset everything if an image was just passed via imperative ref
            if (messages.length === 0) {
                setUserName(null); 
                setIsLoading(true);

                const timer = setTimeout(() => {
                    const createSuggestionNode = (greetingText: string) => (
                        <div>
                            <p className="text-xl">{greetingText}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {SUGGESTION_CHIPS.map((text, i) => (
                                     <button 
                                        key={i} 
                                        onClick={() => handleSuggestionClick(text)}
                                        className="text-base font-semibold text-blue-700 bg-blue-100 py-2 px-4 rounded-full hover:bg-blue-200 transition-colors"
                                     >
                                         {text}
                                     </button>
                                ))}
                            </div>
                        </div>
                    );
                    
                    if (isLoggedIn && currentUser) {
                        const welcomeBackText = `Hi ${currentUser.name}! Welcome back to CoolBreeze HVAC. How can I assist you today?`;
                        setMessages([{ id: 'init', text: createSuggestionNode(welcomeBackText), sender: 'bot', timestamp: new Date().toISOString() }]);
                        setIsAwaitingName(false);
                    } else {
                        setMessages([{ 
                            id: 'init', 
                            text: createSuggestionNode("Hello! I'm Claire, your virtual assistant for CoolBreeze HVAC. Who am I chatting with today?"),
                            sender: 'bot', 
                            timestamp: new Date().toISOString() 
                        }]);
                        setIsAwaitingName(true);
                    }
                    setIsLoading(false);
                }, 1200);

                chatHistoryRef.current = [];
                setDiagnosticState({ active: false });

                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, isLoggedIn, currentUser]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
        e.target.value = '';
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    };

    return (
        <>
            <div className={`fixed bottom-4 right-4 transition-all duration-300 z-50 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                {/* Teaser Bubble */}
                <div className={`absolute bottom-full right-0 mb-4 w-72 bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transition-all duration-500 transform ${showTeaser ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-sm">C</div>
                        <span className="font-bold text-blue-800 text-lg">Claire</span>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">Hi there! Need help with your AC or a quick quote? I'm here to help! 👋</p>
                    <div className="absolute top-full right-10 w-4 h-4 bg-white border-r border-b border-blue-100 transform rotate-45 -translate-y-2"></div>
                </div>

                <button onClick={() => setIsOpen(true)} className="bg-blue-800 text-white rounded-full p-8 shadow-2xl hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 animate-pulse relative" aria-label="Open Chat">
                    <ChatBubbleLeftRightIcon className="w-16 h-16" />
                    {showTeaser && (
                        <span className="absolute top-4 right-4 flex h-6 w-6">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-500 border-2 border-white"></span>
                        </span>
                    )}
                </button>
            </div>

            <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] max-w-3xl h-[85vh] max-h-[800px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="flex-shrink-0 bg-blue-800 text-white p-6 flex justify-between items-center rounded-t-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold text-2xl">C</div>
                        <div>
                            <h3 className="font-bold text-2xl">Claire</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                                <p className="text-base opacity-80">Online & Ready to Help</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-75 bg-blue-700/50 p-2 rounded-full" aria-label="Close Chat">
                        <XMarkIcon className="w-8 h-8" />
                    </button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
                    <div className="space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">C</div>}
                                <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                                    {typeof msg.text === 'string' ? <p className="text-xl leading-relaxed">{msg.text}</p> : <div className="text-xl leading-relaxed">{msg.text}</div>}
                                </div>
                            </div>
                        ))}
                        {diagnosticState.active && (
                             <div className="p-5 rounded-3xl bg-white border border-blue-100 shadow-sm">
                                <DiagnosticTool
                                    initialSymptom={diagnosticState.symptom}
                                    onComplete={(recommendation, service) => {
                                        const botMessage: Message = { id: Date.now().toString() + 'diag', text: (<div><p className="font-bold">Diagnostic Complete:</p><p>{recommendation}</p></div>), sender: 'bot', timestamp: new Date().toISOString() };
                                        addMessage(botMessage);
                                        openBookingModal(service);
                                        setDiagnosticState({ active: false });
                                    }}
                                />
                            </div>
                        )}
                         {isLoading && (
                            <div className="flex items-end gap-3 justify-start">
                                <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">C</div>
                                <div className="max-w-[85%] p-5 rounded-3xl bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s] mx-2"></div>
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                         )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="flex-shrink-0 border-t bg-white rounded-b-2xl p-4">
                    <form onSubmit={handleSendMessage}>
                        {imagePreview && (
                            <div className="p-2 relative w-fit mb-2">
                                <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg shadow-md" />
                                <button type="button" onClick={removeImage} className="absolute top-0 right-0 bg-black/60 text-white rounded-full p-1 m-1 hover:bg-black/80 transition-colors">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-3 p-2">
                            <label htmlFor="file-upload" className="p-3 text-gray-500 hover:text-blue-800 cursor-pointer rounded-full hover:bg-gray-100 transition-colors" title="Upload Image">
                                <CameraIcon className="w-8 h-8" />
                            </label>
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            
                            <button type="button" onClick={handleVoiceInput} className={`p-3 text-gray-500 hover:text-blue-800 cursor-pointer rounded-full hover:bg-gray-100 transition-colors ${isListening ? 'text-red-500 animate-pulse bg-red-50' : ''}`} title="Voice Input">
                                <MicrophoneIcon className="w-8 h-8" />
                            </button>

                            <input 
                                type="text" 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                placeholder={isListening ? "Listening..." : "How can I help you today?"} 
                                className="w-full px-6 py-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl" 
                                disabled={isLoading || diagnosticState.active} 
                            />
                            
                            <button type="submit" className="bg-blue-800 text-white rounded-full p-4 hover:bg-blue-900 disabled:bg-gray-400 transition-all shadow-lg hover:shadow-blue-200" disabled={isLoading || diagnosticState.active || (!input.trim() && !imageFile)}>
                                <PaperAirplaneIcon className="w-8 h-8" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
});
