
import React, { useState, useMemo } from 'react';
import { faqData } from '../constants';
import { getFaqAnswer } from '../services/geminiService';
import { XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon, QuestionMarkCircleIcon } from './icons';

interface FaqModalProps {
    onClose: () => void;
}

const FaqItem: React.FC<{
    item: { question: string, answer: string };
    isOpen: boolean;
    onClick: () => void;
}> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200">
            <button onClick={onClick} className="w-full text-left py-4 pr-12 pl-4 flex justify-between items-center hover:bg-gray-50 focus:outline-none">
                <span className="font-semibold text-gray-800">{item.question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-gray-600">
                    <p>{item.answer}</p>
                </div>
            )}
        </div>
    );
};

export const FaqModal: React.FC<FaqModalProps> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [userQuestion, setUserQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const filteredFaqs = useMemo(() => {
        if (!searchTerm.trim()) return faqData;
        return faqData.filter(faq =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleAskQuestion = async () => {
        if (!userQuestion.trim()) {
            setError('Please enter a question.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAiAnswer('');
        const result = await getFaqAnswer(userQuestion);
        if ('error' in result) {
            setAiAnswer(result.error);
        } else {
            setAiAnswer(result.text);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b z-10 flex justify-between items-center rounded-t-xl">
                <h2 className="text-2xl font-bold text-blue-800">Frequently Asked Questions</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="p-6 flex-shrink-0 border-b">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            
            <div className="overflow-y-auto flex-grow">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <FaqItem
                            key={index}
                            item={faq}
                            isOpen={activeIndex === index}
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        />
                    ))
                ) : (
                    <p className="p-8 text-center text-gray-500">No questions found matching your search.</p>
                )}
            </div>

            <div className="bg-gray-50 p-6 border-t mt-auto rounded-b-xl">
                <div className="flex items-center text-blue-800 mb-3">
                    <QuestionMarkCircleIcon className="w-6 h-6 mr-2" />
                    <h3 className="text-lg font-bold">Can't find an answer?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Ask our AI assistant, Claire, and she'll try to answer based on our knowledge base.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={userQuestion}
                        onChange={e => setUserQuestion(e.target.value)}
                        placeholder="Type your question here..."
                        className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={e => e.key === 'Enter' && handleAskQuestion()}
                    />
                    <button onClick={handleAskQuestion} disabled={isLoading} className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Searching...' : 'Ask'}
                    </button>
                </div>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                {aiAnswer && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-800">
                        <p className="font-semibold text-blue-800 mb-1">Claire says:</p>
                        <p>{aiAnswer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
