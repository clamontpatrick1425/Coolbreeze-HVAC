
import React, { useState } from 'react';
import { UserCircleIcon, ChevronDownIcon } from './icons';
import { services } from '../constants';
import { ServiceType } from '../types';

interface HeaderProps {
    onLoginClick: () => void;
    onFaqClick: () => void;
    onAboutClick: () => void;
    onTestimonialsClick: () => void;
    onBookNow: (service?: ServiceType) => void;
    onContactClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onFaqClick, onAboutClick, onTestimonialsClick, onBookNow, onContactClick }) => {
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-40 shadow-md">
            {/* Emergency Top Bar */}
            <div className="bg-red-600 text-white text-center p-2 text-sm md:text-base font-bold">
                <a href="tel:555-123-4567" className="hover:underline">
                    EMERGENCY? NO HEAT/AC? Call Us 24/7: (555) 123-4567
                </a>
            </div>

            {/* Main Navigation */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                         <a href="#" className="text-2xl font-bold text-blue-800">
                            CoolBreeze<span className="text-orange-500">HVAC</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <nav className="hidden md:flex md:space-x-8 items-center">
                            <button onClick={onAboutClick} className="text-gray-600 hover:text-blue-800 font-medium">About Us</button>
                             <div 
                                className="relative group"
                                onMouseEnter={() => setIsServicesOpen(true)}
                                onMouseLeave={() => setIsServicesOpen(false)}
                            >
                                <button 
                                    className="flex items-center text-gray-600 hover:text-blue-800 font-medium focus:outline-none py-2"
                                    aria-expanded={isServicesOpen}
                                >
                                    Services
                                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                                </button>
                                
                                {/* Dropdown Menu */}
                                <div className={`absolute top-full left-0 mt-0 w-72 bg-white rounded-lg shadow-xl py-2 border border-gray-100 transition-all duration-200 transform origin-top-left ${isServicesOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                                    {services.map((service) => (
                                        <button
                                            key={service.title}
                                            onClick={() => {
                                                onBookNow(service.title);
                                                setIsServicesOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            {service.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <a href="#tools" className="text-gray-600 hover:text-blue-800 font-medium">Tools</a>
                            <button onClick={onTestimonialsClick} className="text-gray-600 hover:text-blue-800 font-medium">Testimonials</button>
                            <button onClick={onFaqClick} className="text-gray-600 hover:text-blue-800 font-medium">FAQ</button>
                            <button onClick={onContactClick} className="text-gray-600 hover:text-blue-800 font-medium">Contact</button>
                        </nav>
                         <button 
                            onClick={onLoginClick}
                            className="hidden md:flex items-center space-x-2 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <UserCircleIcon className="w-5 h-5" />
                            <span>Customer Login</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
