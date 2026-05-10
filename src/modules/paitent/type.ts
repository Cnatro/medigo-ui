export interface Doctor {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    hospital: string;
    hospitalIcon?: string;
    experience: number;
    rating: number;
    reviewCount: number;
    price: number;
    hasInsurance: boolean;
    languages: string[];
    isOnline: boolean;
    qualifications: string[];
    awards: string[];
    workHistory: WorkHistoryItem[];
    certificates: string[];
}

export interface WorkHistoryItem {
    period: string;
    position: string;
    hospital: string;
}

export interface TimeSlot {
    id: string;
    time: string;
    isAvailable: boolean;
    isBooked: boolean;
}

export interface DaySchedule {
    date: string;
    dayName: string;
    slots: TimeSlot[];
}

export interface Appointment {
    id: string;
    doctor: Doctor;
    patient: Patient;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    reason: string;
    symptoms: string;
    location: string;
    isOnline: boolean;
}

export interface Patient {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar?: string;
}

export interface Review {
    id: string;
    patientName: string;
    patientAvatar: string;
    rating: number;
    content: string;
    date: string;
}

export interface Specialty {
    id: string;
    name: string;
    icon: string;
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    suggestions?: DoctorSuggestion[];
}

export interface DoctorSuggestion {
    doctor: Doctor;
    matchScore: number;
    reason: string;
}
