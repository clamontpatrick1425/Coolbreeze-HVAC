import React, { useState, useEffect, useRef } from 'react';

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let frame = 0;
                    const counter = setInterval(() => {
                        frame++;
                        const progress = frame / totalFrames;
                        setCount(Math.round(end * progress));

                        if (frame === totalFrames) {
                            clearInterval(counter);
                            setCount(end); // Ensure it ends on the exact number
                        }
                    }, frameRate);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, totalFrames, frameRate]);

    return { count, ref };
};


const StatCard: React.FC<{ value: number; label: string; suffix?: string; color: string }> = ({ value, label, suffix = '', color }) => {
    const { count, ref } = useCountUp(value);
    const colorClasses = {
        orange: 'bg-orange-100 text-orange-500 text-orange-700',
        blue: 'bg-blue-100 text-blue-800 text-blue-900',
        green: 'bg-green-100 text-green-600 text-green-800',
    }[color] || 'bg-gray-100';

    const [bgColor, valueColor, labelColor] = colorClasses.split(' ');

    return (
        <div ref={ref} className={`${bgColor} p-4 rounded-lg text-center w-full`}>
            <p className={`text-3xl font-bold ${valueColor}`}>{count.toLocaleString()}{suffix}</p>
            <p className={`text-sm font-medium ${labelColor}`}>{label}</p>
        </div>
    );
}

export const About: React.FC = () => {
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
        <section id="about" ref={sectionRef} className={`py-16 bg-gray-50 fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">Your Trusted Local HVAC Experts</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            For over 15 years, CoolBreeze HVAC has been dedicated to providing our community with honest, reliable, and high-quality heating and cooling services. We're a family-owned business that treats every customer like one of our own.
                        </p>
                        <p className="mt-4 text-gray-600">
                            Our certified technicians are not just experts in their field; they're your neighbors. We are committed to upfront pricing, 100% satisfaction, and ensuring your home is comfortable and safe, no matter the weather outside.
                        </p>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="font-bold text-blue-800 mb-2">Our Mission</h3>
                                <p className="text-sm text-gray-600">To provide year-round comfort to every home in our community with integrity, expertise, and a smile.</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="font-bold text-blue-800 mb-2">Our Goals</h3>
                                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                    <li>100% Customer Satisfaction</li>
                                    <li>24/7 Rapid Response</li>
                                    <li>Energy Efficiency Leadership</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                           <StatCard value={15} suffix="+" label="Years of Experience" color="orange" />
                           <StatCard value={10000} suffix="+" label="Happy Customers" color="blue" />
                           <StatCard value={100} label="A+ BBB Rating" color="green" />
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-2xl">
                        <img 
                            src="https://images.unsplash.com/photo-1617103995832-e5a49b29e7b2?q=80&w=1974&auto=format&fit=crop" 
                            alt="Friendly HVAC technician working on an AC unit"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};