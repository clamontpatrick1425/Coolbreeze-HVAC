import React from 'react';
import { XMarkIcon } from './icons';

interface PrivacyPolicyModalProps {
    onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b z-10 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-blue-800">Privacy Policy</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="overflow-y-auto p-6 md:p-8 prose">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                
                <p>CoolBreeze HVAC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

                <h3>1. Information We Collect</h3>
                <p>We may collect personal information from you in a variety of ways, including:</p>
                <ul>
                    <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you request a quote, book a service, or contact us.</li>
                    <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, browser type, and the pages you have viewed.</li>
                </ul>

                <h3>2. Use of Your Information</h3>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
                <ul>
                    <li>Schedule, manage, and provide HVAC services.</li>
                    <li>Respond to your inquiries and offer customer support.</li>
                    <li>Send you service reminders, marketing, and promotional communications.</li>
                    <li>Improve our website and service offerings.</li>
                </ul>

                <h3>3. Disclosure of Your Information</h3>
                <p>We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes. We may share information we have collected about you in certain situations:</p>
                <ul>
                    <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                    <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, and marketing assistance.</li>
                </ul>

                <h3>4. Security of Your Information</h3>
                <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>

                <h3>5. Contact Us</h3>
                <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                <p>
                    CoolBreeze HVAC<br />
                    123 Main Street<br />
                    Springfield, USA<br />
                    Email: privacy@coolbreezehvac.com
                </p>
            </div>
        </div>
    );
};