
import React from 'react';
import { 
    CameraIcon, 
    CalculatorIcon,
    SparklesIcon,
    WrenchScrewdriverIcon
} from './icons';

interface ToolCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    badge?: string;
    color: 'blue' | 'orange' | 'green' | 'purple';
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon: Icon, onClick, badge, color }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
        orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600',
        green: 'bg-green-50 text-green-600 group-hover:bg-green-600',
        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
    };

    return (
        <button 
            onClick={onClick}
            className="group relative bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 text-left border border-gray-100 flex flex-col items-start h-full hover:-translate-y-2 overflow-hidden"
        >
            {/* Background Decorative Element */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${color === 'blue' ? 'bg-blue-600' : color === 'orange' ? 'bg-orange-600' : color === 'green' ? 'bg-green-600' : 'bg-purple-600'}`} />

            {badge && (
                <span className="absolute top-6 right-6 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10">
                    {badge}
                </span>
            )}
            
            <div className={`p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${colorMap[color]}`}>
                <Icon className="w-10 h-10 group-hover:text-white transition-colors duration-300" />
            </div>

            <h3 className="text-2xl font-black text-gray-900 mt-8 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                {title}
            </h3>
            
            <p className="text-gray-500 leading-relaxed font-medium">
                {description}
            </p>

            <div className="mt-auto pt-8 flex items-center text-blue-600 font-bold uppercase tracking-widest text-xs">
                Open Tool 
                <div className="ml-3 w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                    <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>
        </button>
    );
};

interface ToolsSectionProps {
    onOpenDiagnosis: () => void;
    onOpenTroubleshoot: () => void;
    onOpenSavings: () => void;
    onOpenFinancing: () => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({ 
    onOpenDiagnosis, 
    onOpenTroubleshoot,
    onOpenSavings, 
    onOpenFinancing 
}) => {
    return (
        <section id="tools" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black tracking-[0.2em] uppercase">
                            Homeowner Toolkit
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                            Smart <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">HVAC Tools</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-medium">
                            Select a tool below to instantly diagnose, troubleshoot, or plan your system upgrade in a popup window.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ToolCard 
                        title="Visual Diagnosis"
                        description="Identify HVAC errors and part damage instantly using Bree, our AI analyzer."
                        icon={CameraIcon}
                        onClick={onOpenDiagnosis}
                        badge="AI-Powered"
                        color="blue"
                    />
                    <ToolCard 
                        title="Troubleshoot Your Issue"
                        description="Interactive step-by-step guide to identify common system problems."
                        icon={WrenchScrewdriverIcon}
                        onClick={onOpenTroubleshoot}
                        color="orange"
                    />
                    <ToolCard 
                        title="Energy Savings Calculator"
                        description="Discover how much your utility bills will drop with a high-efficiency system upgrade."
                        icon={SparklesIcon}
                        onClick={onOpenSavings}
                        color="green"
                    />
                    <ToolCard 
                        title="Finance Your New HVAC Unit"
                        description="Get an immediate monthly payment estimate with flexible financing options."
                        icon={CalculatorIcon}
                        onClick={onOpenFinancing}
                        color="purple"
                    />
                </div>
            </div>
        </section>
    );
};
