import React from 'react';
import { trustBadges } from '../constants';
import { ServiceType } from '../types';
import { VoiceAgentOrb } from './VoiceAgentOrb';

interface HeroProps {
    onBookNow: (service: ServiceType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
    const handleScrollToEstimate = () => {
        document.getElementById('estimate-calculator')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section 
            id="home"
            className="relative bg-blue-800 text-white py-20 md:py-32"
        >
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://picsum.photos/seed/hvac-bg/1920/1080')"}}></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                    Reliable HVAC Service, When You Need It Most
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-blue-200">
                    24/7 Emergency Repairs, Expert Installations, and Proactive Maintenance. Your comfort is our priority.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
                    <button 
                        onClick={() => onBookNow(ServiceType.ScheduledRepair)}
                        className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105 text-lg"
                    >
                        Book Service
                    </button>
                    <VoiceAgentOrb />
                    <button 
                        onClick={handleScrollToEstimate}
                        className="bg-white text-blue-800 font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-gray-200 transition duration-300 transform hover:scale-105 text-lg"
                    >
                        Get a Free Estimate
                    </button>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-12">
                    {trustBadges.map((badge, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-blue-100">
                            <badge.icon className="h-5 w-5 text-green-400" />
                            <span>{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};