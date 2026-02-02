// FIX: Add React import to resolve 'Cannot find namespace React' error.
import React from 'react';

export interface Message {
    id: string;
    text: string | React.ReactNode;
    sender: 'user' | 'bot';
    timestamp: string;
}

export enum ServiceType {
    EmergencyRepair = "Emergency Repair",
    ScheduledRepair = "Scheduled Repair",
    Maintenance = "Preventive Maintenance",
    NewInstallation = "New Installation / Replacement",
    QuoteRequest = "Quote Request",
    AirQuality = "Indoor Air Quality",
    Commercial = "Commercial HVAC",
}

export interface Service {
    title: ServiceType;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface Review {
    name: string;
    location: string;
    rating: number;
    text: string;
    avatar: string;
}

export interface BookingData {
    serviceType: ServiceType | '';
    urgency: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    problemDescription: string;
    photo: File | null;
    propertyType: string;
    systemAge: string;
}