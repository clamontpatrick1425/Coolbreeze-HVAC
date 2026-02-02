import React, { useState, ReactNode } from 'react';
import { LightBulbIcon, SparklesIcon, WifiIcon, ViewColumnsIcon, CloudIcon, ArrowPathIcon } from './icons';
import { getEnhancementRecommendations } from '../services/geminiService';
import { ServiceType } from '../types';

interface RecommendedEnhancementsProps {
    onBookNow: (service: ServiceType) => void;
}

interface Recommendation {
    name: string;
    description: string;
    benefit: string;
    icon: string;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Zoning': ViewColumnsIcon,
    'Thermostat': WifiIcon,
    'AirPurifier': SparklesIcon,
    'Humidity': CloudIcon,
    'Ventilation': ArrowPathIcon,
    'Default': LightBulbIcon,
};

const exampleProblems = [
    "The upstairs bedrooms are always hot in the summer",
    "My energy bills seem too high",
    "The air in my house feels stuffy and dry",
    "My family suffers from allergies and dust"
];

export const RecommendedEnhancements: React.FC<RecommendedEnhancementsProps> = ({ onBookNow }) => {
    const [problem, setProblem] = useState('');
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendations = async (issue: string) => {
        if (!issue.trim()) {
            setError("Please describe your comfort issue.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        
        const result = await getEnhancementRecommendations(issue);
        
        if ('error' in result) {
            setError(result.error);
        } else if (result.enhancements && result.enhancements.length > 0) {
            setRecommendations(result.enhancements);
        } else {
             setError("Sorry, we couldn't find a specific recommendation for that issue.");
        }
        
        setIsLoading(false);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRecommendations(problem);
    };

    const handleExampleClick = (example: string) => {
        setProblem(example);
        fetchRecommendations(example);
    }

    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName] || iconMap['Default'];
        return <IconComponent className="w-10 h-10 text-orange-500" />;
    };

    return (
        <section id="recommendations" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">AI-Powered Comfort Solutions</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Not sure what you need? Describe a comfort problem in your home, and our AI advisor will suggest solutions.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-lg">
                    <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4 items-start">
                        <textarea
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                            placeholder="e.g., 'The upstairs bedrooms are always hot in the summer' or 'My allergies are worse inside the house.'"
                            className="w-full p-3 border border-gray-300 rounded-lg h-24 sm:h-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-blue-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-400">
                            {isLoading ? 'Thinking...' : 'Get Ideas'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">Or, try one of these common issues:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {exampleProblems.map((ex, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleExampleClick(ex)}
                                    className="bg-blue-100 text-blue-800 text-xs font-semibold py-1.5 px-3 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {ex}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        {isLoading && (
                            <div className="flex justify-center items-center space-x-2 text-gray-600">
                                <LightBulbIcon className="w-6 h-6 animate-pulse" />
                                <span>Analyzing your needs...</span>
                            </div>
                        )}
                        {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                        
                        {!isLoading && recommendations.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                {recommendations.map((rec, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-md border flex flex-col">
                                        {getIcon(rec.icon)}
                                        <h4 className="font-bold text-blue-800 mt-4 text-lg">{rec.name}</h4>
                                        <p className="text-sm text-gray-600 mt-2 flex-grow">{rec.description}</p>
                                        <div className="mt-4 bg-green-50 p-3 rounded-md">
                                            <p className="text-sm font-semibold text-green-900">Key Benefit:</p>
                                            <p className="text-xs text-green-800">{rec.benefit}</p>
                                        </div>
                                         <button onClick={() => onBookNow(ServiceType.QuoteRequest)} className="text-sm w-full mt-4 bg-orange-100 text-orange-700 font-semibold py-2 px-3 rounded-md hover:bg-orange-200 transition-colors">
                                            Request a Quote
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
