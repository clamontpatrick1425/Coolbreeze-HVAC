
import React from 'react';
import { XMarkIcon, GoogleIcon, FacebookIcon, YelpIcon } from './icons';

interface LeaveReviewModalProps {
    onClose: () => void;
}

const ReviewPlatform: React.FC<{ 
    icon: React.ComponentType<{ className?: string }>; 
    platform: string; 
    location?: string;
    onClick: () => void;
    color: string;
    iconBg: string;
}> = ({ icon: Icon, platform, location, onClick, color, iconBg }) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl transition-all group"
    >
        <div className={`p-3 rounded-full mr-4 ${iconBg} group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="text-left">
            <p className="text-lg font-bold text-white">Review us on {platform}</p>
            {location && <p className="text-xs text-gray-500 truncate max-w-[200px]">{location}</p>}
        </div>
    </button>
);

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative bg-[#1c1c1c] w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-white/10 animate-scale-in">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                    <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-white leading-tight">You help us grow with every review</h2>
                    <p className="mt-4 text-gray-400 text-lg">Choose a platform below to leave your feedback</p>
                </div>

                <div className="space-y-4">
                    <ReviewPlatform 
                        icon={GoogleIcon} 
                        platform="Google" 
                        location="CoolBreeze HVAC, 123 Main St, Springfield..."
                        color="text-[#4285F4]"
                        iconBg="bg-white"
                        onClick={() => {}} 
                    />
                    <ReviewPlatform 
                        icon={YelpIcon} 
                        platform="Yelp" 
                        location="CoolBreeze HVAC, 789 Comfort Ln, Springfield..."
                        color="text-[#FF1A1A]"
                        iconBg="bg-white"
                        onClick={() => {}} 
                    />
                    <ReviewPlatform 
                        icon={FacebookIcon} 
                        platform="Facebook" 
                        location="CoolBreeze HVAC | Springfield, MO"
                        color="text-white"
                        iconBg="bg-[#1877F2]"
                        onClick={() => {}} 
                    />
                </div>

                <button 
                    onClick={onClose}
                    className="mt-8 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-3xl transition-colors border border-white/5"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
