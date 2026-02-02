
import React, { useRef, useEffect, useState } from 'react';
import { services } from '../constants';
import { ServiceType } from '../types';

interface ServicesProps {
    onBookNow: (service: ServiceType) => void;
}

export const Services: React.FC<ServicesProps> = ({ onBookNow }) => {
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
        <section id="services" ref={sectionRef} className={`py-16 bg-white fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">Our HVAC Services</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Comprehensive solutions to keep your home comfortable all year round.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.title} className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                            <div className="flex-shrink-0">
                                <service.icon className="h-12 w-12 text-orange-500" />
                            </div>
                            <div className="flex-grow mt-6">
                                <h3 className="text-xl font-bold text-blue-800">{service.title}</h3>
                                <p className="mt-2 text-gray-600">{service.description}</p>
                            </div>
                            <div className="mt-6">
                                <button 
                                    onClick={() => onBookNow(service.title)}
                                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                                >
                                    Book Now &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};