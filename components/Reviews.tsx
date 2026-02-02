
import React, { useRef, useEffect, useState } from 'react';
import { reviews } from '../constants';
import { StarIcon } from './icons';

export const Reviews: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="reviews" ref={sectionRef} className={`py-16 bg-white fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">What Our Customers Say</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        We're proud of our 5-star service. Here's what people are saying about us.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-lg flex flex-col">
                            <div className="flex items-center mb-4">
                                <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full mr-4"/>
                                <div>
                                    <p className="font-bold text-blue-800">{review.name}</p>
                                    <p className="text-sm text-gray-500">{review.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 italic">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};