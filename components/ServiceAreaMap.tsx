
import React, { useState } from 'react';
import { MapPinIcon, ShieldCheckIcon } from './icons';
import { servicedZips } from '../constants';

export const ServiceAreaMap: React.FC = () => {
    const [zip, setZip] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [mapLocation, setMapLocation] = useState('Kansas City Metropolitan Area');

    const handleCheckZip = (e: React.FormEvent) => {
        e.preventDefault();
        if (!zip.trim()) {
            setMessage('Please enter a ZIP code.');
            setMessageType('error');
            return;
        }
        
        // Update map location
        setMapLocation(zip.trim());

        if (servicedZips.includes(zip.trim())) {
            setMessage(`Great! ${zip} is in our service area.`);
            setMessageType('success');
        } else {
            setMessage(`We're sorry, we don't currently service the ${zip} area.`);
            setMessageType('error');
        }
    };

    return (
        <section id="service-area" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">Proudly Serving Our Community</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        We serve the Greater Kansas City Metro Area, including both Missouri and Kansas. Check your ZIP code to see if you're in our service zone.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gray-50 p-8 rounded-2xl border">
                    {/* Left side - checker */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center text-blue-800 mb-4">
                            <MapPinIcon className="w-8 h-8 mr-3" />
                            <h3 className="text-2xl font-bold">Check Your Location</h3>
                        </div>
                        <p className="text-gray-600 mb-6">Enter your 5-digit ZIP code below for instant confirmation.</p>
                        <form onSubmit={handleCheckZip} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={zip}
                                onChange={(e) => {
                                    setZip(e.target.value.replace(/[^0-9]/g, '').slice(0, 5));
                                    setMessage('');
                                    setMessageType('');
                                }}
                                placeholder="Enter ZIP Code"
                                className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                                Check Location
                            </button>
                        </form>
                        {message && (
                            <div className={`mt-4 p-3 rounded-lg text-sm font-medium flex items-center ${
                                messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                {message}
                            </div>
                        )}
                    </div>
                    {/* Right side - map */}
                    <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-lg border border-gray-300">
                         <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight={0} 
                            marginWidth={0} 
                            src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(mapLocation)}&t=&z=10&ie=UTF8&iwloc=B&output=embed`}
                            title="Service Area Map"
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}
