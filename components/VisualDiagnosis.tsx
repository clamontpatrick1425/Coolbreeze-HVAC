
import React, { useRef } from 'react';
import { CameraIcon, PlusCircleIcon, ShieldCheckIcon, ClockIcon } from './icons';

interface VisualDiagnosisProps {
    onImageUpload: (file: File) => void;
}

export const VisualDiagnosis: React.FC<VisualDiagnosisProps> = ({ onImageUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
    };

    return (
        <section id="visual-diagnosis" className="py-20 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Content */}
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center px-4 py-1.5 bg-blue-100/50 text-blue-600 rounded-full text-sm font-bold tracking-wider uppercase">
                            AI-Powered Insight
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                                Visual Diagnosis:<br />
                                <span className="text-blue-600">See the Problem Instantly.</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                                Don't spend hours on hold describing a weird light or a broken part. 
                                Snap a photo of your AC unit, thermostat error code, or filter, and Claire 
                                will identify the issue in seconds.
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {[
                                "Instant error code identification",
                                "HVAC model number lookup via photo",
                                "Part damage assessment",
                                "DIY-friendly troubleshooting steps"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-lg font-medium text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Tool Card */}
                    <div className="flex-1 w-full max-w-xl">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-50 p-4 rounded-2xl shadow-sm">
                                <CameraIcon className="w-10 h-10 text-blue-600" />
                            </div>

                            <div className="text-center mt-8 space-y-2">
                                <h3 className="text-2xl font-bold text-gray-900">Try it out</h3>
                                <p className="text-gray-500 font-medium">Open the chat to start a diagnosis with Claire</p>
                            </div>

                            <div 
                                onClick={handleBoxClick}
                                className="mt-10 mb-8 aspect-[16/10] border-2 border-dashed border-blue-200 rounded-3xl bg-blue-50/30 flex flex-col items-center justify-center group cursor-pointer hover:bg-blue-50 transition-all duration-300"
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                />
                                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <PlusCircleIcon className="w-10 h-10 text-blue-500" />
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-lg font-bold text-gray-800">Snap or Upload Photo</p>
                                    <p className="text-sm text-gray-400 font-medium italic">Claire will analyze it instantly in the chat window</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50/50 p-4 rounded-2xl text-center">
                                    <p className="text-2xl font-black text-blue-600">98%</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accuracy Rate</p>
                                </div>
                                <div className="bg-blue-50/50 p-4 rounded-2xl text-center">
                                    <p className="text-2xl font-black text-orange-500">&lt; 5s</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Analysis Time</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
