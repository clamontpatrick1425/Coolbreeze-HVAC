
import React, { useState } from 'react';
import { ServiceType } from '../types';
import { UserCircleIcon, DevicePhoneMobileIcon, EnvelopeIcon, ShieldCheckIcon } from './icons';

interface LeadGenerationFormProps {
    isModal?: boolean;
    onClose?: () => void;
}

export const LeadGenerationForm: React.FC<LeadGenerationFormProps> = ({ isModal = false, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: ServiceType.QuoteRequest,
        description: '',
        customerType: 'New' // Default
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real application, you would send this data to a server
        console.log("Lead Form Submitted:", formData);
        setIsSubmitted(true);
    };

    // CSS for floating animation
    const floatAnimationStyles = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }
        .animate-float-card {
            animation: float 6s ease-in-out infinite;
        }
    `;

    // Increased padding for modal to simulate 2x size
    const containerClasses = isModal 
        ? "bg-white p-12 md:p-16 rounded-xl shadow-2xl border w-full" 
        : "bg-white p-8 rounded-xl shadow-2xl border w-[36rem] transition-all duration-300 animate-float-card";
    
    const wrapperClasses = isModal
        ? ""
        : "fixed top-1/2 right-8 -translate-y-1/2 z-30 hidden lg:block";

    if (isSubmitted) {
        return (
            <>
                {!isModal && <style>{floatAnimationStyles}</style>}
                <div className={wrapperClasses}>
                    <div className={`${containerClasses} flex flex-col items-center justify-center text-center`}>
                        {/* Increased icon and text sizes for success state */}
                        <ShieldCheckIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
                        <h3 className="text-4xl font-bold text-gray-800">Thank You!</h3>
                        <p className="text-gray-600 my-6 text-2xl">Your request has been sent. Our team will contact you shortly.</p>
                        <button 
                            onClick={() => {
                                setIsSubmitted(false);
                                if(onClose) onClose();
                            }} 
                            className="mt-6 text-xl text-blue-600 hover:underline font-semibold"
                        >
                            {isModal ? "Close" : "Submit another request"}
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {!isModal && <style>{floatAnimationStyles}</style>}
            <div className={wrapperClasses}>
                <div className={containerClasses}>
                    {/* Increased heading size */}
                    <h3 className="text-4xl md:text-5xl font-extrabold text-blue-800 text-center mb-6">Contact Us</h3>
                    {/* Increased subtitle size */}
                    <p className="text-center text-gray-600 mb-10 text-xl md:text-2xl">Fill out the form and we'll be in touch!</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center space-x-8 mb-6">
                            <label className="inline-flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="customerType" 
                                    value="New" 
                                    checked={formData.customerType === 'New'} 
                                    onChange={handleChange} 
                                    className="form-radio h-6 w-6 text-orange-500 focus:ring-orange-500 border-gray-300"
                                />
                                {/* Increased label size */}
                                <span className="ml-3 text-gray-700 text-lg md:text-xl">New Customer</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="customerType" 
                                    value="Returning" 
                                    checked={formData.customerType === 'Returning'} 
                                    onChange={handleChange} 
                                    className="form-radio h-6 w-6 text-orange-500 focus:ring-orange-500 border-gray-300"
                                />
                                {/* Increased label size */}
                                <span className="ml-3 text-gray-700 text-lg md:text-xl">Returning Customer</span>
                            </label>
                        </div>

                        <div className="relative">
                            {/* Increased icon size and adjusted position */}
                            <UserCircleIcon className="w-8 h-8 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            {/* Increased input padding and font size */}
                            <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} className="w-full pl-16 pr-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl" />
                        </div>
                        <div className="relative">
                            <DevicePhoneMobileIcon className="w-8 h-8 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} className="w-full pl-16 pr-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl" />
                        </div>
                        <div className="relative">
                            <EnvelopeIcon className="w-8 h-8 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} className="w-full pl-16 pr-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl" />
                        </div>
                        <div>
                            <select name="service" value={formData.service} onChange={handleChange} className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl">
                                {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <textarea name="description" placeholder="How can we help you?" value={formData.description} onChange={handleChange} rows={4} className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl" />
                        </div>
                        <button type="submit" className="w-full bg-orange-500 text-white font-bold py-5 px-8 rounded-xl shadow-md hover:bg-orange-600 transition-colors transform hover:scale-105 text-2xl">
                            Submit Your Request
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
