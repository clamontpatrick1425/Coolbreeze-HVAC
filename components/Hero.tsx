
import React, { useEffect, useState } from 'react';
import { trustBadges } from '../constants';
import { ServiceType } from '../types';
import { VoiceAgentOrb } from './VoiceAgentOrb';
import { generateHeroVideo } from '../services/geminiService';
import { getVideo, saveVideo } from '../services/videoStorage';

interface HeroProps {
    onBookNow: (service: ServiceType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleScrollToEstimate = () => {
        document.getElementById('estimate-calculator')?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const loadVideo = async () => {
            try {
                // 1. Try to get video from IndexedDB
                const cachedBlob = await getVideo();
                if (cachedBlob) {
                    const url = URL.createObjectURL(cachedBlob);
                    setVideoUrl(url);
                    return;
                }

                // 2. If not found, generate a new one
                setIsGenerating(true);
                const result = await generateHeroVideo("Cinematic 8 second video of professional HVAC technicians installing a modern AC system in a beautiful luxury home living room, daylight, 4k");
                
                if (result && result instanceof Blob) {
                    await saveVideo(result);
                    const url = URL.createObjectURL(result);
                    setVideoUrl(url);
                } else if (result && 'error' in result) {
                    console.warn("Video generation failed:", result.error);
                }
            } catch (e) {
                console.error("Error loading hero video:", e);
            } finally {
                setIsGenerating(false);
            }
        };

        loadVideo();
    }, []);

    return (
        <section 
            id="home"
            className="relative bg-blue-900 text-white py-20 md:py-32 overflow-hidden"
        >
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
                {videoUrl ? (
                    <video 
                        key={videoUrl}
                        src={videoUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover opacity-40 transition-opacity duration-1000"
                        onPlay={() => console.log("Video started playing")}
                        onError={(e) => console.error("Video playback error", e)}
                    />
                ) : (
                    <div 
                        className="w-full h-full bg-cover bg-center opacity-20 transition-opacity duration-500" 
                        style={{backgroundImage: "url('https://picsum.photos/seed/hvac-bg/1920/1080')"}}
                    ></div>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {isGenerating && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                        <span className="bg-blue-800/80 text-blue-200 text-xs px-3 py-1 rounded-full animate-pulse border border-blue-500/50">
                            Customizing Experience...
                        </span>
                    </div>
                )}

                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                    Reliable HVAC Service, When You Need It Most
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-blue-100 font-medium drop-shadow-md">
                    24/7 Emergency Repairs, Expert Installations, and Proactive Maintenance. Your comfort is our priority.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
                    <button 
                        onClick={() => onBookNow(ServiceType.ScheduledRepair)}
                        className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105 text-lg border border-orange-400"
                    >
                        Book Service
                    </button>
                    <VoiceAgentOrb />
                    <button 
                        onClick={handleScrollToEstimate}
                        className="bg-white/95 text-blue-800 font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-105 text-lg"
                    >
                        Get a Free Estimate
                    </button>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:gap-x-12">
                    {trustBadges.map((badge, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-blue-50 font-semibold bg-blue-900/30 px-3 py-1 rounded-full backdrop-blur-sm border border-blue-500/20">
                            <badge.icon className="h-5 w-5 text-green-400" />
                            <span>{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
