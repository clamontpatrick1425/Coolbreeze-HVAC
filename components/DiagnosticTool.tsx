import React, { useState, useEffect } from 'react';
import { ServiceType } from '../types';

interface DiagnosticToolProps {
    initialSymptom?: string;
    initialSystemType?: string;
    onComplete: (recommendation: string, service: ServiceType) => void;
}

type Step = {
    question: string;
    options: string[];
    next: (answer: string) => number | 'done';
    recommendation?: (answers: Record<number, string>) => { text: string; service: ServiceType };
};

const diagnosticFlows: Record<string, Step[]> = {
    notCooling: [
        {
            question: "I see your AC isn't cooling. First, is your thermostat set to 'COOL' and the temperature set at least 5 degrees below the current room temperature?",
            options: ["Yes, it's set correctly", "No, I'll fix it now"],
            next: (answer) => (answer.startsWith("Yes") ? 1 : 'done'),
            recommendation: () => ({ text: "Great! Adjusting the thermostat often solves the problem. If it still doesn't cool after 15-20 minutes, please start this diagnostic again.", service: ServiceType.ScheduledRepair })
        },
        {
            question: "Good. Now, are the air vents in your rooms open and free of obstructions like furniture or curtains?",
            options: ["Yes, all vents are clear", "No, some were blocked"],
            next: (answer) => (answer.startsWith("Yes") ? 2 : 'done'),
            recommendation: () => ({ text: "Blocked vents can severely restrict airflow. Please clear any obstructions and see if that improves cooling. If not, let's continue.", service: ServiceType.ScheduledRepair })
        },
        {
            question: "Okay. Next, have you checked your air filter in the last month? A dirty filter can block airflow.",
            options: ["Yes, it's clean", "No, it's dirty / I'll check now"],
            next: (answer) => (answer.startsWith("Yes") ? 3 : 'done'),
            recommendation: () => ({ text: "A dirty filter is a very common cause of cooling issues. Please replace it with a new one. If the problem continues with a clean filter, we recommend booking a technician.", service: ServiceType.ScheduledRepair })
        },
        {
            question: "Let's check the circuit breakers for the AC system, often labeled 'Air Conditioner' or 'Condenser' in your electrical panel. Are they on?",
            options: ["Yes, they are on", "No, one was tripped"],
            next: (answer) => (answer.startsWith("Yes") ? 4 : 'done'),
            recommendation: () => ({ text: "Please try resetting the breaker. If it trips again immediately, DO NOT reset it again and call us, as this indicates a serious electrical issue requiring urgent attention.", service: ServiceType.EmergencyRepair })
        },
        {
            question: "Now, please check the outdoor unit (the big fan outside). Is it running? You should hear the fan and possibly feel air blowing from the top.",
            options: ["Yes, it's running", "No, it's not running", "It's humming but the fan isn't spinning"],
            next: (answer) => (answer.startsWith("Yes") ? 5 : 6)
        },
        {
            question: "If the fan is running but you're not getting cold air, check for ice buildup on the copper pipes leading into your home. Do you see any ice?",
            options: ["Yes, there's ice", "No, it looks normal"],
            next: () => 'done',
            recommendation: (answers) => {
                if (answers[5]?.startsWith("Yes")) {
                    return { text: "Ice buildup indicates a serious issue like low refrigerant or blocked airflow. Please turn OFF your AC system to allow it to thaw and prevent damage. This requires a professional technician to fix.", service: ServiceType.EmergencyRepair };
                }
                return { text: "If both indoor and outdoor units are running but not cooling, it could be low refrigerant or a compressor issue. A technician will need to diagnose this.", service: ServiceType.ScheduledRepair };
            }
        },
        {
            question: "If the outdoor unit isn't running or just humming, it's likely an electrical issue.",
            options: ["Book a Technician"],
            next: () => 'done',
            recommendation: (answers) => {
                const answer = answers[4] || '';
                if (answer.includes("humming")) {
                     return { text: "A humming sound without the fan spinning often points to a failed capacitor. This is a common repair for a technician.", service: ServiceType.ScheduledRepair };
                }
                return { text: "Since the outdoor unit isn't running, the issue could be a faulty capacitor, contactor, or motor. A professional is needed for a safe and accurate diagnosis.", service: ServiceType.ScheduledRepair };
            }
        }
    ],
    notHeating: [
        {
            question: "Sorry to hear your heat isn't working. First, is your thermostat set to 'HEAT' and the temperature set at least 5 degrees above the current room temperature?",
            options: ["Yes, it's set correctly", "No, I'll fix it now"],
            next: (answer) => (answer.startsWith("Yes") ? 1 : 'done'),
            recommendation: () => ({ text: "Perfect. Correct thermostat settings are key. If it doesn't heat up in 15-20 minutes, let's continue troubleshooting.", service: ServiceType.ScheduledRepair })
        },
        {
            question: "Next, let's check the furnace's power switch. It often looks like a light switch on or near the furnace unit. Is it in the 'ON' position?",
            options: ["Yes, it's on", "No, it was off"],
            next: (answer) => (answer.startsWith("Yes") ? 2 : 'done'),
            recommendation: () => ({ text: "Flipping that switch on may solve it! Give it a few minutes to start up. If nothing happens, there might be another issue.", service: ServiceType.ScheduledRepair })
        },
        {
             question: "When you try to start the heat, do you hear the furnace trying to ignite? Often there's a 'clicking' sound, or the main blower might run for a minute then stop.",
             options: ["Yes, it tries to start then stops", "No, it does absolutely nothing"],
             next: (answer) => 3
        },
        {
            question: "Have you checked the air filter recently? A clogged filter can cause a furnace to overheat and shut down, even after attempting to start.",
            options: ["Yes, it's clean", "No, it's dirty"],
            next: (answer) => (answer.startsWith("Yes") ? 4 : 'done'),
            recommendation: () => ({ text: "A dirty filter is a frequent cause of furnace failure. Please replace the filter. If the furnace still won't stay on, a technician should investigate.", service: ServiceType.ScheduledRepair })
        },
        {
            question: "Let's check the furnace's exhaust vent outside your home. Is it blocked by snow, leaves, or anything else?",
            options: ["No, it's clear", "Yes, it was blocked"],
            next: () => 'done',
            recommendation: (answers) => {
                if (answers[4]?.startsWith("Yes")) {
                    return { text: "Clearing the vent is critical for safety and operation. Once cleared, try restarting the furnace. If it still fails, call us immediately.", service: ServiceType.EmergencyRepair };
                }
                const startupAttempt = answers[2];
                if (startupAttempt?.startsWith("Yes")) {
                    return { text: "Since the furnace is trying to start but failing, the issue is likely a dirty flame sensor or a faulty ignitor. For your safety, this requires a certified technician to inspect.", service: ServiceType.ScheduledRepair };
                }
                return { text: "Because the system isn't even trying to start, the problem could be with the thermostat, control board, or an internal safety switch. A technician will need to diagnose the electrical components.", service: ServiceType.ScheduledRepair };
            }
        }
    ],
    strangeNoise: [
        {
            question: "A strange noise can be unsettling. Where is the noise coming from?",
            options: ["Indoor Unit (Furnace/Air Handler)", "Outdoor Unit (AC/Heat Pump)", "In the vents"],
            next: () => 1
        },
        {
            question: "What does the noise sound like?",
            options: ["Grinding / Scraping", "Squealing / Screeching", "Banging / Clanking", "Hissing"],
            next: () => 'done',
            recommendation: (answers) => {
                const noiseType = answers[1];
                let issue = "";
                if (noiseType?.startsWith("Grinding")) issue = "a problem with the motor bearings, which is serious.";
                if (noiseType?.startsWith("Squealing")) issue = "a worn belt or malfunctioning motor, which needs immediate attention.";
                if (noiseType?.startsWith("Banging")) issue = "a loose or broken part, like a fan blade or connecting rod.";
                if (noiseType?.startsWith("Hissing")) issue = "a significant refrigerant leak or a leak in your ductwork.";

                return { text: `A ${noiseType?.toLowerCase()} noise often indicates ${issue} For your safety and to prevent further damage, it's best to turn off your system and have a technician inspect it right away.`, service: ServiceType.EmergencyRepair };
            }
        }
    ],
    waterLeaking: [
        {
            question: "I can help with a water leak. Where is the water coming from?",
            options: ["From the indoor unit", "From the outdoor unit"],
            next: (answer) => (answer.includes("indoor") ? 1 : 2)
        },
        {
            question: "A leak from the indoor unit is often a clogged condensate drain line. For safety and to prevent damage, please turn your system OFF at the thermostat. Is the drain pan under the unit overflowing with water?",
            options: ["Yes, it's full or overflowing", "No, but I see a leak"],
            next: () => 'done',
            recommendation: () => ({ text: "An overflowing drain pan requires immediate attention. A technician needs to clear the clogged condensate line to prevent serious water damage to your home.", service: ServiceType.EmergencyRepair })
        },
        {
            question: "A little water from the outdoor unit can be normal. Are you running the AC on a hot, humid day, or are you running the Heat Pump in the winter?",
            options: ["AC on a humid day", "Heat Pump in winter", "Neither / It's a lot of water"],
            next: (answer) => (answer.startsWith("AC") ? 'done' : 3)
        },
        {
            question: "If it's not normal condensation, it could be a sign of a problem. Is the unit encased in ice?",
            options: ["Yes, there's a lot of ice", "No, just leaking water"],
            next: () => 'done',
            recommendation: (answers) => {
                if(answers[3]?.startsWith("Yes")) {
                    return { text: "A frozen outdoor unit is a sign of a serious issue like restricted airflow or low refrigerant. Please turn the system off and schedule a technician.", service: ServiceType.EmergencyRepair }
                }
                return { text: "Excessive water from the outdoor unit could be a clogged defrost drain or another issue. We recommend a service call to get it checked out.", service: ServiceType.ScheduledRepair }
            }
        }
    ],
    'default': [
        {
            question: "Let's try to figure this out. What type of equipment is having an issue?",
            options: ["Air Conditioner", "Furnace", "Heat Pump"],
            next: () => 1,
        },
        {
            question: "Is the thermostat set correctly and does it have power/fresh batteries?",
            options: ["Yes", "No / Unsure"],
            next: (answer) => (answer === "Yes" ? 2 : 'done'),
            recommendation: () => ({ text: "Please check that your thermostat is on the correct setting (Cool/Heat) and has fresh batteries. If that doesn't solve it, we recommend booking a technician.", service: ServiceType.ScheduledRepair })
        },
        {
            question: "Have you checked if your air filter is clean?",
            options: ["Yes, it's clean", "No, it's dirty"],
            next: () => 'done',
            recommendation: (answers) => {
                 if (answers[2] === "No, it's dirty") {
                    return { text: "A dirty filter is a very common cause of issues. Please try replacing your air filter. If the problem continues after that, a technician should take a look.", service: ServiceType.ScheduledRepair }
                 }
                 return { text: "Thanks for checking the basics. It sounds like the issue is with the system itself and requires a professional technician for a safe and accurate diagnosis.", service: ServiceType.ScheduledRepair }
            }
        },
    ],
};

const selectFlow = (symptom?: string): string => {
    const s = symptom?.toLowerCase() || '';
    if (s.includes('cool') || s.includes('cold air')) return 'notCooling';
    if (s.includes('heat') || s.includes('furnace') || s.includes('ignit')) return 'notHeating';
    if (s.includes('noise') || s.includes('sound') || s.includes('loud')) return 'strangeNoise';
    if (s.includes('leak') || s.includes('water') || s.includes('drip')) return 'waterLeaking';
    return 'default';
};

export const DiagnosticTool: React.FC<DiagnosticToolProps> = ({ initialSymptom, onComplete }) => {
    const [activeFlowKey, setActiveFlowKey] = useState('default');
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    
    useEffect(() => {
        const key = selectFlow(initialSymptom);
        setActiveFlowKey(key);
    }, [initialSymptom]);

    const flow = diagnosticFlows[activeFlowKey];

    const handleAnswer = (answer: string) => {
        const newAnswers = { ...answers, [currentStep]: answer };
        setAnswers(newAnswers);

        const step = flow[currentStep];
        let nextStep = step.next(answer);

        if (nextStep === 'done') {
            let result = { text: "Based on your answers, we recommend having a professional technician inspect your system.", service: ServiceType.ScheduledRepair };
            
            if (step.recommendation) {
                result = step.recommendation(newAnswers);
            } else if (activeFlowKey === 'waterLeaking' && answer.startsWith('AC')) {
                // Handle the special case for normal condensation
                result = { text: "A small puddle from the outdoor unit on a humid day is usually normal condensation and not a cause for alarm. If cooling performance is poor or the water seems excessive, then a check-up is a good idea.", service: ServiceType.Maintenance };
            }
            onComplete(result.text, result.service);
        } else {
            setCurrentStep(nextStep);
        }
    };

    const step = flow[currentStep];

    return (
        <div className="bg-white p-4 rounded-lg border border-blue-200 text-sm">
            <p className="font-semibold text-blue-800 mb-3">{step.question}</p>
            <div className="flex flex-wrap gap-2">
                {step.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className="bg-blue-100 text-blue-800 font-semibold py-1.5 px-3 rounded-md hover:bg-blue-200 text-xs transition-colors"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};
