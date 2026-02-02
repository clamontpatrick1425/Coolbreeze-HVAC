
import React, { useState, useEffect } from 'react';
import { CalendarDaysIcon, ShieldCheckIcon, ArrowPathIcon } from './icons';

// Helper function to generate captcha text
const generateCaptchaText = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// SVG Captcha Image Component
const CaptchaImage: React.FC<{ text: string }> = ({ text }) => {
    // Simple noise and distortion for the captcha image
    const noiseLines = Array.from({ length: 8 }).map((_, i) => ({
        x1: Math.random() * 150,
        y1: Math.random() * 40,
        x2: Math.random() * 150,
        y2: Math.random() * 40,
        stroke: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        opacity: 0.2
    }));

    return (
        <div className="bg-gray-200 border border-gray-300 rounded-md p-0 overflow-hidden" style={{ width: 150, height: 40, lineHeight: 0 }}>
             <svg width="150" height="40">
                {noiseLines.map((line, i) => (
                    <line key={i} {...line} strokeWidth="1" />
                ))}
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#333" letterSpacing="4" style={{ fontFamily: 'monospace' }}>
                    {text.split('').map((char, i) => (
                        <tspan key={i} dx={i > 0 ? Math.random() * 5 - 2 : 0} dy={Math.random() * 6 - 3} rotate={Math.random() * 30 - 15}>{char}</tspan>
                    ))}
                </text>
            </svg>
        </div>
    );
};

export const MaintenanceReminder: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        system: 'Air Conditioner',
        frequency: 'Bi-Annually',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');

    const refreshCaptcha = () => {
        setCaptchaText(generateCaptchaText());
        setCaptchaInput('');
        setCaptchaError('');
    }

    useEffect(() => {
        refreshCaptcha();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
         // Captcha validation
        if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
            setCaptchaError('Incorrect captcha. Please try again.');
            refreshCaptcha(); // Refresh on failure
            return;
        }

        // Clear error and proceed with submission
        setCaptchaError('');
        console.log('Maintenance Reminder Signup:', formData);
        setIsSubmitted(true);
    };

    return (
        <section id="maintenance-reminder" className="py-16 bg-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 md:p-12 rounded-2xl shadow-xl">
                    {/* Left Column: Information */}
                    <div>
                        <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                            <CalendarDaysIcon className="w-5 h-5 mr-2" />
                            Proactive Care
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">Stay Ahead of Breakdowns</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Never forget seasonal maintenance again. Sign up for our free reminders and we'll notify you when it's time for a tune-up, ensuring your system runs efficiently all year long.
                        </p>
                        <ul className="mt-6 space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <ShieldCheckIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span><strong>Prevent Costly Repairs:</strong> Regular check-ups catch small issues before they become big problems.</span>
                            </li>
                            <li className="flex items-start">
                                <ShieldCheckIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span><strong>Improve Efficiency:</strong> A well-maintained system uses less energy, lowering your utility bills.</span>
                            </li>
                             <li className="flex items-start">
                                <ShieldCheckIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                <span><strong>Extend System Lifespan:</strong> Proper care can add years to the life of your HVAC equipment.</span>
                            </li>
                        </ul>
                    </div>
                    {/* Right Column: Form */}
                    <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                        {isSubmitted ? (
                            <div className="text-center">
                                <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-blue-800">You're All Set!</h3>
                                <p className="mt-2 text-gray-600">Thank you, {formData.name}. We'll send a friendly reminder to {formData.email} when it's time for your next service. </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-xl font-bold text-center text-blue-800 mb-4">Get Your Free Reminder</h3>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="system" className="block text-sm font-medium text-gray-700">Primary System Type</label>
                                    <select name="system" id="system" value={formData.system} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                        <option>Air Conditioner</option>
                                        <option>Furnace</option>
                                        <option>Heat Pump</option>
                                        <option>Mini-Split System</option>
                                        <option>Commercial Unit</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">Please solve the captcha</label>
                                    <div className="mt-1 flex items-center space-x-2">
                                        <CaptchaImage text={captchaText} />
                                        <button type="button" onClick={refreshCaptcha} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors" aria-label="Refresh captcha">
                                            <ArrowPathIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <input 
                                        type="text" 
                                        name="captcha" 
                                        id="captcha" 
                                        required 
                                        value={captchaInput} 
                                        onChange={(e) => {
                                            setCaptchaInput(e.target.value);
                                            if (captchaError) setCaptchaError(''); // Clear error on type
                                        }}
                                        className={`mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${captchaError ? 'border-red-500' : 'border-gray-300'}`} 
                                    />
                                    {captchaError && <p className="text-red-500 text-xs mt-1">{captchaError}</p>}
                                </div>
                                <div>
                                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300">
                                        Sign Me Up
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
