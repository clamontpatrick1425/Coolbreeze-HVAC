
import React, { useState, useMemo } from 'react';
import { CalculatorIcon } from './icons';
import { ServiceType } from '../types';

interface EstimateCalculatorProps {
    onBookNow: (service: ServiceType) => void;
}

const BASE_COSTS = {
    [ServiceType.Maintenance]: 150,
    [ServiceType.ScheduledRepair]: 350,
    [ServiceType.NewInstallation]: 6000,
    [ServiceType.EmergencyRepair]: 500,
    [ServiceType.AirQuality]: 800,
    [ServiceType.Commercial]: 10000,
    [ServiceType.QuoteRequest]: 0,
};

const SYSTEM_MULTIPLIERS = {
    'AC Unit': 1.0,
    'Furnace': 1.0,
    'Heat Pump': 1.2,
    'Mini-Split': 1.5,
    'Commercial Rooftop': 2.5,
};

const AGE_MULTIPLIERS = {
    '0-5 years': 1.0,
    '5-10 years': 1.1,
    '10+ years': 1.25,
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const EstimateCalculator: React.FC<EstimateCalculatorProps> = ({ onBookNow }) => {
    const [service, setService] = useState<ServiceType>(ServiceType.ScheduledRepair);
    const [system, setSystem] = useState('AC Unit');
    const [sqft, setSqft] = useState(2000);
    const [age, setAge] = useState('5-10 years');

    const { lowEstimate, highEstimate } = useMemo(() => {
        const base = BASE_COSTS[service] || 0;
        const systemMult = SYSTEM_MULTIPLIERS[system as keyof typeof SYSTEM_MULTIPLIERS] || 1;
        const ageMult = service === ServiceType.ScheduledRepair ? AGE_MULTIPLIERS[age as keyof typeof AGE_MULTIPLIERS] : 1;
        
        let sizeMult = 1;
        if (service === ServiceType.NewInstallation) {
            sizeMult = sqft / 1000;
        }

        const calculatedCost = base * systemMult * ageMult * sizeMult;
        
        const low = calculatedCost * 0.8;
        const high = calculatedCost * 1.2;

        return { lowEstimate: low, highEstimate: high };
    }, [service, system, sqft, age]);

    return (
        <section id="estimate-calculator" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">Instant Free Estimate</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Get a ballpark price range for your HVAC needs in seconds. Adjust the options below to see your estimate.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
                    {/* Calculator Inputs */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 space-y-6">
                        <div>
                            <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service Type</label>
                            <select id="service" value={service} onChange={(e) => setService(e.target.value as ServiceType)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                {Object.values(ServiceType).filter(s => s !== ServiceType.QuoteRequest).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="system" className="block text-sm font-medium text-gray-700">HVAC System Type</label>
                            <select id="system" value={system} onChange={(e) => setSystem(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                {Object.keys(SYSTEM_MULTIPLIERS).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">Property Size: <span className="font-bold text-blue-800">{sqft.toLocaleString()} sq ft</span></label>
                            <input id="sqft" type="range" min="500" max="5000" step="100" value={sqft} onChange={(e) => setSqft(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">System Age</label>
                            <select id="age" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                {Object.keys(AGE_MULTIPLIERS).map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="text-center lg:text-left">
                         <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                            <CalculatorIcon className="w-5 h-5 mr-2" />
                            Your Estimated Range
                        </div>
                        <p className="text-2xl text-gray-700">Preliminary Estimate:</p>
                        <p className="text-5xl md:text-6xl font-extrabold text-blue-800 my-2">
                            {formatCurrency(lowEstimate)} - {formatCurrency(highEstimate)}
                        </p>
                        <p className="text-xs text-gray-500 italic mt-4">*This is a preliminary estimate for budgeting purposes only. A technician will provide a precise, fixed-price quote on-site.</p>
                        <button
                            onClick={() => onBookNow(ServiceType.QuoteRequest)}
                            className="mt-6 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105 text-lg"
                        >
                            Book a Precise On-site Quote
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
