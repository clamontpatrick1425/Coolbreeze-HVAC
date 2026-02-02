import React from 'react';
import { XMarkIcon } from './icons';

interface TermsOfServiceModalProps {
    onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ onClose }) => {
    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b z-10 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-blue-800">Terms of Service</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="overflow-y-auto p-6 md:p-8 prose">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                <h3>1. Agreement to Terms</h3>
                <p>By using this website, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>

                <h3>2. Use License</h3>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on CoolBreeze HVAC's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul>
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                    <li>attempt to decompile or reverse engineer any software contained on our website;</li>
                    <li>remove any copyright or other proprietary notations from the materials.</li>
                </ul>
                <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by CoolBreeze HVAC at any time.</p>

                <h3>3. Disclaimer</h3>
                <p>The materials on our website are provided on an 'as is' basis. CoolBreeze HVAC makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                
                <h3>4. Limitations</h3>
                <p>In no event shall CoolBreeze HVAC or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>

                <h3>5. Governing Law</h3>
                <p>These terms and conditions are governed by and construed in accordance with the laws of our state and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>

                <h3>6. Contact Us</h3>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p>
                    CoolBreeze HVAC<br />
                    123 Main Street<br />
                    Springfield, USA<br />
                    Email: legal@coolbreezehvac.com
                </p>
            </div>
        </div>
    );
};