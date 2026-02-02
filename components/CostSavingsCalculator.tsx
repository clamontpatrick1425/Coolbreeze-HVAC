
import React, { useState, useMemo } from 'react';
import { BanknotesIcon } from './icons';
import { ServiceType } from '../types';

interface CostSavingsCalculatorProps {
    onBookNow: (service: ServiceType) => void;
}

const SAVINGS_POTENTIAL: { [key: string]: number } = {
    '<10 years': 0.15,
    '10-15 years': 0.30,
    '15+ years': 0.45,
};

const NEW_SYSTEM_BOOST: { [key: string]: number } = {
    'High-Efficiency AC/Furnace': 1.0,
    'High-Efficiency Heat Pump': 1.15,
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const CostSavingsCalculator: React.FC<CostSavingsCalculatorProps> = ({ onBookNow }) => {
    const [monthlyBill, setMonthlyBill] = useState(300);
    const [systemAge, setSystemAge] = useState('15+ years');
    const [newSystem, setNewSystem] = useState('High-Efficiency AC/Furnace');

    const { monthlySavings, annualSavings, newMonthlyBill } = useMemo(() => {
        const savingsRate = SAVINGS_POTENTIAL[systemAge as keyof typeof SAVINGS_POTENTIAL];
        const systemBoost = NEW_SYSTEM_BOOST[newSystem as keyof typeof NEW_SYSTEM_BOOST];
        const totalSavingsRate = Math.min(savingsRate * systemBoost, 0.6); // Cap savings at 60%

        const calculatedMonthlySavings = monthlyBill * totalSavingsRate;
        const calculatedAnnualSavings = calculatedMonthlySavings * 12;
        const calculatedNewBill = monthlyBill - calculatedMonthlySavings;

        return {
            monthlySavings: calculatedMonthlySavings,
            annualSavings: calculatedAnnualSavings,
            newMonthlyBill: calculatedNewBill,
        };
    }, [monthlyBill, systemAge, newSystem]);

    return (
        <section id="savings-calculator" className="py-16 bg-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">Energy Savings Calculator</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Upgrading your old HVAC system can lead to significant savings. See your potential savings below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
                    {/* Calculator Inputs */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg space-y-6">
                        <div>
                            <label htmlFor="monthly-bill" className="block text-sm font-medium text-gray-700">Average Monthly Energy Bill: <span className="font-bold text-blue-800">{formatCurrency(monthlyBill)}</span></label>
                            <input
                                id="monthly-bill"
                                type="range"
                                min="50"
                                max="1000"
                                step="10"
                                value={monthlyBill}
                                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                        <div>
                            <label htmlFor="system-age" className="block text-sm font-medium text-gray-700">Current System Age</label>
                            <select
                                id="system-age"
                                value={systemAge}
                                onChange={(e) => setSystemAge(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {Object.keys(SAVINGS_POTENTIAL).map(age => <option key={age} value={age}>{age}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="new-system" className="block text-sm font-medium text-gray-700">Potential New System</label>
                             <select
                                id="new-system"
                                value={newSystem}
                                onChange={(e) => setNewSystem(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {Object.keys(NEW_SYSTEM_BOOST).map(system => <option key={system} value={system}>{system}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="text-center lg:text-left">
                         <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                            <BanknotesIcon className="w-5 h-5 mr-2" />
                            Your Potential Savings
                        </div>
                        <p className="text-2xl text-gray-700">Estimated Monthly Savings:</p>
                        <p className="text-5xl md:text-6xl font-extrabold text-green-600 my-2">
                            {formatCurrency(monthlySavings)}
                        </p>
                        <p className="text-lg font-semibold text-gray-600">That's up to <span className="font-bold text-green-700">{formatCurrency(annualSavings)}</span> per year!</p>
                        <p className="text-xs text-gray-500 italic mt-4">*Estimates are for illustrative purposes and actual savings may vary based on system choice, home insulation, and usage.</p>
                        <button
                            onClick={() => onBookNow(ServiceType.NewInstallation)}
                            className="mt-6 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105 text-lg"
                        >
                            Get a Free Installation Quote
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
