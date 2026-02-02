
import React, { useState, useEffect } from 'react';
import { ServiceType, BookingData } from '../types';
import { services } from '../constants';
import { XMarkIcon, ArrowUpTrayIcon, ShieldCheckIcon, PlusCircleIcon, DevicePhoneMobileIcon, ArrowDownTrayIcon } from './icons';

interface BookingProps {
    onClose: () => void;
    initialService?: ServiceType;
}

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="flex justify-center items-center space-x-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                    index + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            />
        ))}
    </div>
);

export const Booking: React.FC<BookingProps> = ({ onClose, initialService }) => {
    const [step, setStep] = useState(1);
    const [confirmationId] = useState(() => `CB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    const [formData, setFormData] = useState<BookingData>({
        serviceType: '',
        urgency: 'This Week',
        date: '',
        time: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        problemDescription: '',
        photo: null,
        propertyType: 'Single Family Home',
        systemAge: '5-10 years',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [smsPhoneNumber, setSmsPhoneNumber] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});

    useEffect(() => {
        if (initialService) {
            setFormData(prev => ({ ...prev, serviceType: initialService }));
        }
    }, [initialService]);

    useEffect(() => {
        if (step === 5) {
            setSmsPhoneNumber(formData.phone);
            // Simulate sending a confirmation email
            const sendConfirmationEmail = (data: BookingData) => {
                console.log("--- SIMULATING CONFIRMATION EMAIL ---");
                console.log(`To: ${data.email}`);
                console.log(`Subject: Your CoolBreeze HVAC Service is Confirmed! (Ref: ${confirmationId})`);
                console.log(`
                    Hi ${data.name},

                    This is a confirmation for your upcoming service appointment with CoolBreeze HVAC.

                    Confirmation ID: ${confirmationId}

                    Service Details:
                    - Service: ${data.serviceType}
                    - Requested Date: ${data.date}
                    - Requested Time: ${data.time}
                    - Address: ${data.address}
                    - Issue Description: ${data.problemDescription || 'N/A'}

                    A technician will be in touch with you on the day of the service.
                    If you have any questions, please call us at (555) 123-4567.

                    Thank you for choosing CoolBreeze HVAC!
                `);
                console.log("--------------------------------------");
            };
            sendConfirmationEmail(formData);
        }
    }, [step, formData, confirmationId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for the field being edited
        if (errors[name as keyof BookingData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, photo: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateStep = (stepToValidate: number): boolean => {
        const newErrors: Partial<Record<keyof BookingData, string>> = {};
        if (stepToValidate === 1) {
            if (!formData.serviceType) newErrors.serviceType = 'Please select a service type.';
            if (!formData.date) newErrors.date = 'Please select a date.';
            if (!formData.time) newErrors.time = 'Please select a time.';
        }
        if (stepToValidate === 3) {
            if (!formData.name.trim()) newErrors.name = 'Full name is required.';
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required.';
            } else if (formData.phone.replace(/\D/g, '').length < 10) {
                newErrors.phone = 'Please enter a valid 10-digit phone number.';
            }
            if (!formData.email.trim()) {
                newErrors.email = 'Email address is required.';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address.';
            }
            if (!formData.address.trim()) newErrors.address = 'Service address is required.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setErrors({});
        setStep(prev => prev - 1);
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        nextStep(); // Go to confirmation screen
    };

    const totalSteps = 4;

    const generateCalendarLinks = () => {
        if (!formData.date || !formData.time) return null;
    
        const startDateTime = new Date(`${formData.date}T${formData.time}`);
        // Assume a 1-hour appointment
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    
        const title = `CoolBreeze HVAC Service: ${formData.serviceType} (Ref: ${confirmationId})`;
        const description = `Service for: ${formData.serviceType}.\nDetails: ${formData.problemDescription || 'N/A'}.\nContact: ${formData.phone}`;
        const location = formData.address;
    
        // Google Calendar link format
        const toGoogleFormat = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');
        const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${toGoogleFormat(startDateTime)}/${toGoogleFormat(endDateTime)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
        
        // Outlook Calendar link format
        const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
        return { googleLink, outlookLink };
    };

    const handleDownloadIcs = () => {
        if (!formData.date || !formData.time) return;

        const startDateTime = new Date(`${formData.date}T${formData.time}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        const toIcsFormat = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');

        const title = `CoolBreeze HVAC Service: ${formData.serviceType} (Ref: ${confirmationId})`;
        const description = `Service for: ${formData.serviceType}.\\nDetails: ${formData.problemDescription || 'N/A'}.\\nContact: ${formData.phone}`;
        const location = formData.address;

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTAMP:${toIcsFormat(new Date())}`,
            `UID:${Date.now()}@coolbreezehvac.com`,
            `DTSTART:${toIcsFormat(startDateTime)}`,
            `DTEND:${toIcsFormat(endDateTime)}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description}`,
            `LOCATION:${location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coolbreeze-appointment-${confirmationId}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const generateSmsLink = (phoneNumber: string) => {
        if (!phoneNumber || !formData.date || !formData.time) return '';

        const formattedDateTime = new Date(`${formData.date}T${formData.time}`).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const smsBody = `Hi ${formData.name.split(' ')[0]}, this is a reminder for your CoolBreeze HVAC appointment (${confirmationId}) for ${formData.serviceType} on ${formattedDateTime}. Address: ${formData.address}.`;
        
        const sanitizedPhone = phoneNumber.replace(/\D/g, '');

        return `sms:${sanitizedPhone}?&body=${encodeURIComponent(smsBody)}`;
    };

    const handleDownloadDetails = () => {
        if (!formData.date || !formData.time) return;

        const details = [
            'COOLBREEZE HVAC SERVICE RECORD',
            '==========================================',
            `CONFIRMATION ID: ${confirmationId}`,
            `GENERATED ON:    ${new Date().toLocaleString()}`,
            '==========================================',
            '',
            'SERVICE DETAILS:',
            '------------------------------------------',
            `Service Type:    ${formData.serviceType}`,
            `Urgency Level:   ${formData.urgency}`,
            `Appointment Date: ${formData.date}`,
            `Arrival Window:  ${formData.time}`,
            `Address:         ${formData.address}`,
            '',
            'CONTACT INFORMATION:',
            '------------------------------------------',
            `Customer Name:   ${formData.name}`,
            `Phone Number:    ${formData.phone}`,
            `Email Address:   ${formData.email}`,
            '',
            'ISSUE DESCRIPTION:',
            '------------------------------------------',
            `${formData.problemDescription || 'No detailed description provided.'}`,
            '',
            '==========================================',
            'A technician will call you on the day of service.',
            'Need to reschedule? Call us at (555) 123-4567.',
            'Thank you for choosing CoolBreeze HVAC!',
            '=========================================='
        ].join('\r\n');

        const blob = new Blob([details], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CoolBreeze_Service_${confirmationId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-blue-800">What service do you need?</h3>
                            <select name="serviceType" value={formData.serviceType} onChange={handleChange} className={`w-full p-3 border rounded-lg ${errors.serviceType ? 'border-red-500' : 'border-gray-300'}`} required>
                                <option value="" disabled>Select a service...</option>
                                {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-blue-800">How urgent is it?</h3>
                             <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
                                <option>Emergency - ASAP</option>
                                <option>Today</option>
                                <option>Tomorrow</option>
                                <option>This Week</option>
                                <option>Flexible</option>
                            </select>
                        </div>
                         <div>
                             <h3 className="text-xl font-semibold mb-2 text-blue-800">When would you like to book?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input type="date" name="date" value={formData.date} onChange={handleChange} className={`w-full p-3 border rounded-lg ${errors.date ? 'border-red-500' : 'border-gray-300'}`} required min={new Date().toISOString().split('T')[0]} />
                                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                                </div>
                                <div>
                                    <input type="time" name="time" value={formData.time} onChange={handleChange} className={`w-full p-3 border rounded-lg ${errors.time ? 'border-red-500' : 'border-gray-300'}`} required />
                                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-blue-800">Tell us about the issue</h3>
                        <textarea name="problemDescription" value={formData.problemDescription} onChange={handleChange} placeholder="e.g., My AC is blowing warm air and making a rattling noise." className="w-full p-3 border border-gray-300 rounded-lg h-28" />
                        <h3 className="text-xl font-semibold mt-6 mb-4 text-blue-800">Upload a photo (optional)</h3>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ArrowUpTrayIcon className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            </div>
                            <input type="file" name="photo" onChange={handleFileChange} className="hidden" accept="image/*" />
                        </label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg max-h-40"/>}
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-blue-800">Your Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} required />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`} required />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Service Address" className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`} required />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>
                        </div>
                    </div>
                );
             case 4:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-blue-800">Review & Confirm</h3>
                        <div className="space-y-2 text-gray-700 bg-blue-50 p-4 rounded-lg">
                           <p><strong>Service:</strong> {formData.serviceType}</p>
                           {formData.date && formData.time && <p><strong>Requested Time:</strong> {new Date(`${formData.date}T${formData.time}`).toLocaleString([], { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>}
                           <p><strong>Name:</strong> {formData.name}</p>
                           <p><strong>Contact:</strong> {formData.phone} | {formData.email}</p>
                           <p><strong>Address:</strong> {formData.address}</p>
                           <p><strong>Issue:</strong> {formData.problemDescription || 'N/A'}</p>
                        </div>
                    </div>
                );
            case 5:
                const calendarLinks = generateCalendarLinks();
                return (
                    <div className="text-center">
                        <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-blue-800">Booking Confirmed!</h3>
                        <p className="mt-2 text-gray-600">Thank you, {formData.name}. We've received your request.</p>
                        <p className="text-sm font-bold text-blue-600 mt-1 uppercase tracking-wider">Ref: {confirmationId}</p>
                        
                        <div className="mt-6 text-left bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase">Appointment Summary</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li><strong>Service:</strong> {formData.serviceType}</li>
                                <li><strong>When:</strong> {new Date(`${formData.date}T${formData.time}`).toLocaleString([], { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</li>
                                <li><strong>Where:</strong> {formData.address}</li>
                            </ul>
                        </div>

                        { (calendarLinks || formData.phone) && (
                            <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 text-left">
                                {/* Calendar Section */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center"><PlusCircleIcon className="w-5 h-5 mr-2 text-blue-600"/> Add to Calendar</h4>
                                    <div className="space-y-2">
                                        {calendarLinks && (
                                            <>
                                                <a href={calendarLinks.googleLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-gray-100 text-gray-800 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors text-xs">
                                                    Google Calendar
                                                </a>
                                                <a href={calendarLinks.outlookLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-gray-100 text-gray-800 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors text-xs">
                                                    Outlook / Office 365
                                                </a>
                                                <button onClick={handleDownloadIcs} className="w-full flex items-center justify-center bg-gray-100 text-gray-800 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors text-xs">
                                                    Download iCal (.ics)
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Save/Send Section */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center"><ArrowDownTrayIcon className="w-5 h-5 mr-2 text-blue-600"/> Save Details</h4>
                                    <div className="space-y-2">
                                         <button onClick={handleDownloadDetails} className="w-full flex items-center justify-center bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-900 transition-colors text-xs shadow-md">
                                            Download Summary (.txt)
                                        </button>
                                        {formData.phone && (
                                            <div className="pt-2">
                                                <p className="text-[10px] text-center font-bold text-gray-500 uppercase tracking-widest mb-2">Send Mobile Reminder</p>
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                                    <input 
                                                        type="tel" 
                                                        value={smsPhoneNumber} 
                                                        onChange={(e) => setSmsPhoneNumber(e.target.value)}
                                                        className="w-full sm:flex-grow bg-gray-100 text-gray-800 font-medium py-2.5 px-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                        aria-label="Phone number for text reminder"
                                                    />
                                                    <a 
                                                        href={generateSmsLink(smsPhoneNumber)} 
                                                        className="flex-shrink-0 inline-flex items-center justify-center bg-orange-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors text-xs"
                                                    >
                                                        <DevicePhoneMobileIcon className="w-4 h-4 sm:mr-1" />
                                                        <span>SMS</span>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <button onClick={onClose} className="mt-8 bg-gray-200 text-gray-800 font-bold py-2 px-10 rounded-lg hover:bg-gray-300 transition duration-300">
                            Close
                        </button>
                    </div>
                )
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b z-10 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-800">
                   {step === 5 ? "All Set!" : "Schedule Your Service"}
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {step < 5 && (
                <form onSubmit={handleSubmit}>
                    <div className="p-8">
                        <StepIndicator currentStep={step} totalSteps={totalSteps} />
                        {renderStep()}
                    </div>
                    <div className="bg-gray-50 p-4 flex justify-between items-center">
                        {step > 1 && step < 5 && (
                            <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Back
                            </button>
                        )}
                        <div className="flex-grow"></div> {/* Spacer */}
                        {step < 4 && (
                            <button type="button" onClick={nextStep} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">
                                Next
                            </button>
                        )}
                        {step === 4 && (
                             <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
                                Confirm Booking
                            </button>
                        )}
                    </div>
                </form>
            )}
             {step === 5 && (
                <div className="p-8">
                    {renderStep()}
                </div>
            )}
        </div>
    );
};
