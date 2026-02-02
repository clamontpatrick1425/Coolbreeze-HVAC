
import React, { useEffect } from 'react';
import { XMarkIcon } from './icons';

interface CalendlyModalProps {
    onClose: () => void;
}

export const CalendlyModal: React.FC<CalendlyModalProps> = ({ onClose }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 z-10">
                <h2 className="text-xl font-bold text-blue-800">Schedule Your Appointment</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <XMarkIcon className="w-8 h-8" />
                </button>
            </div>
            <div className="flex-grow relative bg-white overflow-hidden">
                 <div 
                    className="calendly-inline-widget" 
                    data-url="https://calendly.com/calvinpatrick/20min" 
                    style={{ minWidth: '320px', height: '100%', width: '100%' }} 
                />
            </div>
        </div>
    );
};
