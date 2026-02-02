
import React, { useState, useMemo } from 'react';
import { BanknotesIcon } from './icons';
import { ServiceType } from '../types';

interface FinancingCalculatorProps {
    onBookNow: (service: ServiceType) => void;
    onOpenEstimator: () => void;
}

const INTEREST_RATES: { [key: string]: number } = {
    'Excellent (720+)': 0.07,
    'Good (680-719)': 0.10,
    'Fair (640-679)': 0.15,
    'Needs Improvement (<640)': 0.20,
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({ onBookNow, onOpenEstimator }) => {
    const [cost, setCost] = useState('10000');
    const [downPayment, setDownPayment] = useState('2000');
    const [loanTerm, setLoanTerm] = useState(60);
    const [creditScore, setCreditScore] = useState('Good (680-719)');

    const { loanAmount, monthlyPayment } = useMemo(() => {
        const numericCost = Number(cost) || 0;
        const numericDownPayment = Number(downPayment) || 0;
        const currentLoanAmount = Math.max(0, numericCost - numericDownPayment);
        const rate = INTEREST_RATES[creditScore];
        const monthlyRate = rate / 12;

        if (currentLoanAmount <= 0 || monthlyRate <= 0) {
            return { loanAmount: currentLoanAmount, monthlyPayment: 0 };
        }

        const payment = (currentLoanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm));
        return { loanAmount: currentLoanAmount, monthlyPayment: payment };
    }, [cost, downPayment, loanTerm, creditScore]);

    const handleCurrencyChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setter(value);
    };

    return (
        <section id="financing-calculator" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">Finance Your New HVAC Unit</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Estimate your monthly payments for a brand new, high-efficiency system. Use our <button onClick={onOpenEstimator} className="text-blue-600 underline hover:text-blue-700 bg-transparent border-none p-0 cursor-pointer">Instant Free Estimate</button> to get a project cost, then enter it here.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
                    {/* Calculator Inputs */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 space-y-6">
                        <div>
                            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Total Installation Cost</label>
                            <input
                                id="cost"
                                type="text"
                                value={`$${Number(cost).toLocaleString()}`}
                                onChange={handleCurrencyChange(setCost)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                         <div>
                            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700">Down Payment</label>
                            <input
                                id="downPayment"
                                type="text"
                                value={`$${Number(downPayment).toLocaleString()}`}
                                onChange={handleCurrencyChange(setDownPayment)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">Loan Term (Months)</label>
                            <select
                                id="loanTerm"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={24}>24 Months</option>
                                <option value={36}>36 Months</option>
                                <option value={48}>48 Months</option>
                                <option value={60}>60 Months</option>
                                <option value={72}>72 Months</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700">Estimated Credit Score</label>
                             <select
                                id="creditScore"
                                value={creditScore}
                                onChange={(e) => setCreditScore(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {Object.keys(INTEREST_RATES).map(score => <option key={score} value={score}>{score}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="text-center lg:text-left">
                         <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                            <BanknotesIcon className="w-5 h-5 mr-2" />
                            Your Estimate
                        </div>
                        <p className="text-lg text-gray-600">Loan Amount: <span className="font-bold text-blue-800">{formatCurrency(loanAmount)}</span></p>
                        <p className="mt-2 text-2xl text-gray-700">Estimated Monthly Payment:</p>
                        <p className="text-5xl md:text-6xl font-extrabold text-blue-800 my-2">
                            {formatCurrency(monthlyPayment)}<span className="text-xl font-medium text-gray-500">/mo</span>
                        </p>
                        <p className="text-xs text-gray-500 italic mt-4">*This is an estimate for illustrative purposes only. Actual payments may vary. Subject to credit approval.</p>
                        <button
                            onClick={() => onBookNow(ServiceType.QuoteRequest)}
                            className="mt-6 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105 text-lg"
                        >
                            Get a Precise Quote & Apply
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
