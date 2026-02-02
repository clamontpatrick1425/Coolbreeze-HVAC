import React, { useState, useEffect } from 'react';
import { mockPortalData } from '../constants';
import { ServiceType } from '../types';
import { XMarkIcon, UserCircleIcon, CogIcon, ClockIcon, DocumentTextIcon, CalendarDaysIcon, ArrowDownTrayIcon, MapPinIcon, TruckIcon } from './icons';

interface CustomerPortalProps {
    onClose: () => void;
    onBookNow: (service: ServiceType) => void;
    onLogin: (customerData: any) => void;
}

const TechnicianTracker: React.FC = () => {
    const { technician } = mockPortalData;
    const [position, setPosition] = useState({ top: '50%', left: '20%' });

    // Simulate technician moving over time
    useEffect(() => {
        const movement = [
            { top: '55%', left: '35%' },
            { top: '48%', left: '55%' },
            { top: '60%', left: '75%' },
        ];
        let step = 0;
        const interval = setInterval(() => {
            if (step < movement.length) {
                setPosition(movement[step]);
                step++;
            } else {
                clearInterval(interval);
            }
        }, 8000); // Move every 8 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center text-green-600 mb-4">
                <MapPinIcon className="w-6 h-6 mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Track Your Technician</h3>
            </div>
            <div className="relative aspect-video bg-blue-50 rounded-lg overflow-hidden mb-4 border">
                {/* Simplified Map Background */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e7ff" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                 {/* House Icon (Destination) */}
                <div className="absolute" style={{ top: '60%', left: '75%' }}>
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white ring-4 ring-white">
                        <UserCircleIcon className="w-5 h-5" />
                    </div>
                     <span className="text-xs font-bold text-blue-800 absolute top-full left-1/2 -translate-x-1/2 mt-1">You</span>
                </div>
                {/* Truck Icon (Technician) */}
                <div className="absolute transition-all duration-5000 ease-linear" style={position}>
                     <TruckIcon className="w-8 h-8 text-orange-500 transform -scale-x-100" />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <img src={technician.avatar} alt={technician.name} className="w-16 h-16 rounded-full"/>
                <div>
                    <p className="font-bold text-gray-800">{technician.name} is on the way!</p>
                    <p className="text-sm text-gray-600">Estimated Arrival: <span className="font-semibold text-green-700">{technician.eta}</span></p>
                    <p className="text-xs text-gray-500 mt-1">{technician.status}</p>
                </div>
            </div>
        </div>
    );
}


export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onClose, onBookNow, onLogin }) => {
    const { customer, equipment, serviceHistory, upcomingMaintenance, invoices } = mockPortalData;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('michael.b@example.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock validation
        if (email === 'michael.b@example.com' && password === 'password123') {
            setIsLoggedIn(true);
            onLogin(customer);
        } else {
            setError('Invalid credentials. Please use the mock data.');
        }
    };
    
    // For demo purposes, we'll assume "today" is the day of the upcoming maintenance
    const isServiceDay = new Date().toISOString().split('T')[0] <= new Date(upcomingMaintenance.rawDate).toISOString().split('T')[0];


    if (!isLoggedIn) {
        return (
            <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                 <div className="sticky top-0 bg-white p-4 sm:p-6 border-b z-10 flex justify-between items-center rounded-t-xl">
                     <h2 className="text-xl md:text-2xl font-bold text-blue-800">Customer Portal Login</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                 </div>
                 <div className="p-8">
                     <form onSubmit={handleLogin} className="space-y-4">
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            <p className="text-xs text-gray-400 mt-1">Hint: michael.b@example.com</p>
                         </div>
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                             <p className="text-xs text-gray-400 mt-1">Hint: password123</p>
                         </div>
                         {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
                         <div>
                             <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
                                 Login
                             </button>
                         </div>
                     </form>
                 </div>
            </div>
        );
    }

    return (
         <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b z-10 flex justify-between items-center rounded-t-xl">
                <div className="flex items-center space-x-3">
                    <UserCircleIcon className="w-8 h-8 text-blue-800" />
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-blue-800">
                           {customer.name}'s Portal
                        </h2>
                        <p className="text-xs text-gray-500">{customer.address}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Quick Actions & Reminders */}
                    <div className="lg:col-span-1 space-y-6">
                       
                       {isServiceDay && <TechnicianTracker />}

                        <div className="bg-white p-6 rounded-lg border">
                            <div className="flex items-center text-orange-500 mb-3">
                               <CalendarDaysIcon className="w-6 h-6 mr-3" />
                               <h3 className="text-lg font-bold text-gray-800">Upcoming Maintenance</h3>
                            </div>
                            <p className="text-gray-600">Your next recommended service is:</p>
                            <p className="font-bold text-blue-800 text-lg my-2">{upcomingMaintenance.service}</p>
                            <p className="text-gray-500 text-sm">{upcomingMaintenance.date}</p>
                            <button 
                                onClick={() => onBookNow(ServiceType.Maintenance)}
                                className="w-full mt-4 bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Book Maintenance
                            </button>
                        </div>
                        <div className="bg-white p-6 rounded-lg border">
                            <div className="flex items-center text-blue-800 mb-3">
                               <CogIcon className="w-6 h-6 mr-3" />
                               <h3 className="text-lg font-bold text-gray-800">My Equipment</h3>
                            </div>
                            <ul className="space-y-3 text-sm">
                                {equipment.map(item => (
                                    <li key={item.id} className="text-gray-700">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs text-gray-500">Last Service: {item.lastService}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: History & Invoices */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-lg border">
                             <div className="flex items-center text-blue-800 mb-4">
                               <ClockIcon className="w-6 h-6 mr-3" />
                               <h3 className="text-lg font-bold text-gray-800">Service History</h3>
                            </div>
                            <div className="flow-root">
                                <ul className="-mb-4">
                                    {serviceHistory.map((item, index) => (
                                        <li key={item.id} className="pb-4">
                                            <div className="relative">
                                                {index < serviceHistory.length - 1 && <span className="absolute top-2 left-2 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>}
                                                <div className="relative flex items-start space-x-3">
                                                    <div>
                                                        <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-white mt-1"></div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-gray-800">{item.service}</p>
                                                        <p className="text-xs text-gray-500">{item.date} &bull; Tech: {item.tech}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                         <div className="bg-white p-6 rounded-lg border">
                            <div className="flex items-center text-blue-800 mb-4">
                               <DocumentTextIcon className="w-6 h-6 mr-3" />
                               <h3 className="text-lg font-bold text-gray-800">Invoice History</h3>
                            </div>
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Invoice #</th>
                                        <th scope="col" className="px-4 py-3">Date</th>
                                        <th scope="col" className="px-4 py-3">Amount</th>
                                        <th scope="col" className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map(invoice => (
                                        <tr key={invoice.id} className="bg-white border-b">
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900">{invoice.id}</th>
                                            <td className="px-4 py-3">{invoice.date}</td>
                                            <td className="px-4 py-3">{invoice.amount}</td>
                                            <td className="px-4 py-3 text-right">
                                                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                                                    <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                                                    Download
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    );
};