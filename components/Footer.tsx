
import React from 'react';
import { FacebookIcon, InstagramIcon, XIcon, LinkedInIcon, WhatsAppIcon } from './icons';
import { services } from '../constants';
import { ServiceType } from '../types';

interface FooterProps {
    onPrivacyClick: () => void;
    onTermsClick: () => void;
    onBookNow: (service: ServiceType) => void;
    onContactClick: () => void;
    onAboutClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick, onBookNow, onContactClick, onAboutClick }) => {
    return (
        <footer className="bg-blue-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold">CoolBreeze<span className="text-orange-400">HVAC</span></h3>
                        <p className="mt-2 text-blue-200 text-sm">Your comfort is our priority, 24/7.</p>
                        <p className="mt-4 text-blue-200 text-sm">Licensed & Insured</p>
                    </div>

                     {/* Services List (Replacing the generic Services link) */}
                     <div>
                        <h4 className="font-semibold text-lg">Our Services</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            {services.map(service => (
                                <li key={service.title}>
                                    <button 
                                        onClick={() => onBookNow(service.title)} 
                                        className="text-blue-200 hover:text-white text-left hover:underline"
                                    >
                                        {service.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg">Quick Links</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><button onClick={onAboutClick} className="text-blue-200 hover:text-white text-left">About Us</button></li>
                            <li><button onClick={() => document.getElementById('reviews')?.scrollIntoView({behavior: 'smooth'})} className="text-blue-200 hover:text-white text-left">Reviews</button></li>
                            <li><a href="#estimate-calculator" className="text-blue-200 hover:text-white">Instant Estimator</a></li>
                            <li><button onClick={onContactClick} className="text-blue-200 hover:text-white text-left">Contact Us</button></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg">Contact Us</h4>
                        <ul className="mt-4 space-y-2 text-sm text-blue-200">
                            <li><a href="tel:555-123-4567" className="hover:text-white">Phone: (555) 123-4567</a></li>
                            <li><a href="mailto:contact@coolbreezehvac.com" className="hover:text-white">Email: contact@coolbreezehvac.com</a></li>
                            <li className="font-bold mt-2">24/7 Emergency Service</li>
                        </ul>
                        <div className="mt-6 flex space-x-4">
                            <a href="#" aria-label="Facebook" className="text-blue-200 hover:text-white transition-colors">
                                <FacebookIcon className="h-6 w-6" />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-blue-200 hover:text-white transition-colors">
                                <InstagramIcon className="h-6 w-6" />
                            </a>
                            <a href="#" aria-label="X.com" className="text-blue-200 hover:text-white transition-colors">
                                <XIcon className="h-6 w-6" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="text-blue-200 hover:text-white transition-colors">
                                <LinkedInIcon className="h-6 w-6" />
                            </a>
                            <a href="#" aria-label="WhatsApp" className="text-blue-200 hover:text-white transition-colors">
                                <WhatsAppIcon className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-blue-800 pt-8 text-center text-sm text-blue-300 flex flex-col sm:flex-row justify-between items-center">
                    <p>&copy; {new Date().getFullYear()} CoolBreeze HVAC. All Rights Reserved.</p>
                     <div className="flex space-x-4 mt-4 sm:mt-0">
                        <button onClick={onPrivacyClick} className="hover:text-white">Privacy Policy</button>
                        <button onClick={onTermsClick} className="hover:text-white">Terms of Service</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};
