
import React from 'react';
import { GoogleIcon, FacebookIcon, YelpIcon, StarIcon } from './icons';

interface RatingWidgetProps {
    onClick: () => void;
}

export const RatingWidget: React.FC<RatingWidgetProps> = ({ onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="fixed bottom-4 left-4 z-40 bg-[#1c1c1c] text-white p-4 rounded-xl shadow-2xl flex flex-col items-center min-w-[160px] hover:scale-105 transition-transform border border-white/10 group"
        >
            <div className="flex items-center space-x-2 mb-2">
                <div className="bg-white p-1 rounded-full shadow-sm">
                    <GoogleIcon className="w-5 h-5 text-[#4285F4]" />
                </div>
                <div className="bg-[#1877F2] p-1 rounded-full shadow-sm">
                    <FacebookIcon className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white p-1 rounded-full shadow-sm">
                    <YelpIcon className="w-5 h-5 text-[#FF1A1A]" />
                </div>
            </div>
            
            <p className="text-sm font-bold opacity-90 uppercase tracking-tighter">Overall Rating</p>
            
            <div className="flex items-center space-x-2 my-1">
                <span className="text-3xl font-black">4.8</span>
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <StarIcon 
                            key={i} 
                            className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 fill-gray-600'}`} 
                        />
                    ))}
                </div>
            </div>
            
            <p className="text-blue-400 text-sm font-bold group-hover:underline">993 reviews</p>
        </button>
    );
};
