
import React, { useEffect, useState, useRef } from 'react';
import { trustBadges } from '../constants';
import { ServiceType } from '../types';
import { VoiceAgentOrb } from './VoiceAgentOrb';
import { getVideo } from '../services/videoStorage';

interface HeroProps {
    onBookNow: (service: ServiceType) => void;
}

// Permanent video URL (Professional HVAC footage)
const PERMANENT_VIDEO_URL = "https://videos.pexels.com/video-files/6195781/6195781-hd_1920_1080_25fps.mp4";

export const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
    const [videoUrl, setVideoUrl] = useState<string>(PERMANENT_VIDEO_URL);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleScrollToEstimate = () => {
        document.getElementById('estimate-calculator')?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const loadVideo = async () => {
            try {
                // Check for a locally cached video (if user previously generated one with an API key)
                const cachedBlob = await getVideo();
                if (cachedBlob) {
                    const url = URL.createObjectURL(cachedBlob);
                    setVideoUrl(url);
                }
            } catch (e) {
                console.warn("Could not load cached video, utilizing default.", e);
            }
        };

        loadVideo();
    }, []);

    // Ensure video plays when URL is set
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play was prevented by browser policy:", error);
                });
            }
        }
    }, [videoUrl]);

    return (
        <section 
            id="home"
            className="relative bg-blue-900 text-white py-20 md:py-32 overflow-hidden min-h-[600px] flex items-center justify-center"
        >
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
                <video 
                    ref={videoRef}
                    key={videoUrl}
                    src={videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-40"
                    poster="https://images.unsplash.com/photo-1581094794329-cd1361ddee2f?q=80&w=2787&auto=format&fit=crop"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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
