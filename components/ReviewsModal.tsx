
import React from 'react';
import { reviews } from '../constants';
import { StarIcon, XMarkIcon, GoogleIcon, FacebookIcon, YelpIcon } from './icons';

interface ReviewsModalProps {
    onClose: () => void;
    onWriteReview: () => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({ onClose, onWriteReview }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-start animate-fade-in pointer-events-none">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
            
            <div className="relative w-full max-w-md h-full bg-[#121212] shadow-2xl flex flex-col pointer-events-auto animate-slide-right overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1c1c1c]">
                    <h2 className="text-2xl font-black text-white">What our customers say</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 flex items-center space-x-2 border-b border-white/10 text-[10px] overflow-x-auto no-scrollbar">
                    <button className="whitespace-nowrap px-3 py-1 bg-white/20 text-white rounded-full font-bold">All Reviews <span className="opacity-50 font-normal">4.8</span></button>
                    <button className="whitespace-nowrap px-3 py-1 bg-white/5 text-gray-400 rounded-full font-bold flex items-center gap-1.5 hover:bg-white/10">
                        <GoogleIcon className="w-3.5 h-3.5 text-blue-400" /> Google <span className="opacity-50 font-normal">4.8</span>
                    </button>
                    <button className="whitespace-nowrap px-3 py-1 bg-white/5 text-gray-400 rounded-full font-bold flex items-center gap-1.5 hover:bg-white/10">
                        <FacebookIcon className="w-3.5 h-3.5 text-blue-500" /> Facebook <span className="opacity-50 font-normal">4.9</span>
                    </button>
                    <button className="whitespace-nowrap px-3 py-1 bg-white/5 text-gray-400 rounded-full font-bold flex items-center gap-1.5 hover:bg-white/10">
                        <YelpIcon className="w-3.5 h-3.5 text-red-500" /> Yelp <span className="opacity-50 font-normal">4.7</span>
                    </button>
                </div>

                {/* Summary & Call to Action */}
                <div className="p-8 text-center bg-[#1c1c1c]/50">
                    <h3 className="text-lg font-bold text-gray-300">Overall Rating</h3>
                    <div className="flex items-center justify-center space-x-3 my-2">
                         <span className="text-4xl font-black text-white">4.8</span>
                         <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            ))}
                         </div>
                         <span className="text-sm text-gray-500">(993)</span>
                    </div>
                    <button 
                        onClick={onWriteReview}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                    >
                        Write a Review
                    </button>
                </div>

                {/* Review List */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-[#1c1c1c] p-6 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex items-center gap-3">
                                <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-grow">
                                    <p className="font-bold text-white leading-tight">{review.name}</p>
                                    <p className="text-xs text-gray-500">11 days ago</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, j) => (
                                    <StarIcon key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">"{review.text}"</p>
                            <div className="flex items-center gap-2 pt-2 text-[10px] uppercase font-black tracking-widest text-gray-500 border-t border-white/5">
                                <GoogleIcon className="w-3 h-3 text-blue-400" />
                                Posted on <span className="text-blue-400">Google</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
