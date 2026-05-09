import type { Doctor, Specialty, Hospital, Review, DaySchedule, Appointment, Patient } from './type';

export const specialties: Specialty[] = [
    { id: '1', name: 'Nội khoa', icon: '🫀' },
    { id: '2', name: 'Ngoại khoa', icon: '🔪' },
    { id: '3', name: 'Tim mạch', icon: '❤️' },
    { id: '4', name: 'Tai Mũi Họng', icon: '👂' },
    { id: '5', name: 'Mắt', icon: '👁️' },
    { id: '6', name: 'Da liễu', icon: '🧴' },
    { id: '7', name: 'Nhi khoa', icon: '👶' },
    { id: '8', name: 'Sản phụ khoa', icon: '🤰' },
    { id: '9', name: 'Thần kinh', icon: '🧠' },
    { id: '10', name: 'Chỉnh hình', icon: '🦴' },
];

export const hospitals: Hospital[] = [
    { id: '1', name: 'Bệnh viện Bạch Mai', address: 'Hà Nội' },
    { id: '2', name: 'Bệnh viện Chợ Rẫy', address: 'TP.HCM' },
    { id: '3', name: 'Bệnh viện Việt Đức', address: 'Hà Nội' },
    { id: '4', name: 'Bệnh viện 108', address: 'Hà Nội' },
    { id: '5', name: 'Bệnh viện Đại học Y Dược', address: 'TP.HCM' },
    { id: '6', name: 'Bệnh viện FV', address: 'TP.HCM' },
    { id: '7', name: 'Bệnh viện Vinmec', address: 'Toàn quốc' },
];

export const doctors: Doctor[] = [
    {
        id: '1',
        name: 'BS. Nguyễn Văn An',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
        specialty: 'Tim mạch',
        hospital: 'Bệnh viện Bạch Mai',
        experience: 15,
        rating: 4.9,
        reviewCount: 234,
        price: 500000,
        hasInsurance: true,
        languages: ['Việt', 'Anh'],
        isOnline: true,
        qualifications: ['Tiến sĩ Y khoa', 'Chuyên khoa II Tim mạch'],
        awards: ['Thầy thuốc ưu tú 2020', 'Giải thưởng Y học Việt Nam 2019'],
        workHistory: [
            { period: '2015 - Nay', position: 'Trưởng khoa Tim mạch', hospital: 'Bệnh viện Bạch Mai' },
            { period: '2010 - 2015', position: 'Phó khoa Tim mạch', hospital: 'Bệnh viện 108' },
        ],
        certificates: ['Chứng chỉ Can thiệp Tim mạch', 'Chứng chỉ Siêu âm Tim'],
    },
    {
        id: '2',
        name: 'BS. Trần Thị Bình',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        specialty: 'Nhi khoa',
        hospital: 'Bệnh viện Nhi Trung ương',
        experience: 12,
        rating: 4.8,
        reviewCount: 189,
        price: 400000,
        hasInsurance: true,
        languages: ['Việt'],
        isOnline: false,
        qualifications: ['Thạc sĩ Y khoa', 'Chuyên khoa I Nhi'],
        awards: ['Bác sĩ xuất sắc 2021'],
        workHistory: [
            { period: '2012 - Nay', position: 'Bác sĩ Nhi khoa', hospital: 'Bệnh viện Nhi Trung ương' },
        ],
        certificates: ['Chứng chỉ Nhi sơ sinh'],
    },
    {
        id: '3',
        name: 'BS. Lê Minh Châu',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
        specialty: 'Tai Mũi Họng',
        hospital: 'Bệnh viện Chợ Rẫy',
        experience: 20,
        rating: 4.7,
        reviewCount: 312,
        price: 450000,
        hasInsurance: true,
        languages: ['Việt', 'Anh', 'Pháp'],
        isOnline: true,
        qualifications: ['Phó Giáo sư', 'Tiến sĩ Y khoa', 'Chuyên khoa II TMH'],
        awards: ['Nhà giáo ưu tú 2018', 'Giải thưởng Sáng tạo Y học 2017'],
        workHistory: [
            { period: '2005 - Nay', position: 'Trưởng khoa TMH', hospital: 'Bệnh viện Chợ Rẫy' },
        ],
        certificates: ['Chứng chỉ Nội soi TMH', 'Chứng chỉ Vi phẫu'],
    },
    {
        id: '4',
        name: 'BS. Phạm Đức Dũng',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face',
        specialty: 'Da liễu',
        hospital: 'Bệnh viện Da liễu Trung ương',
        experience: 8,
        rating: 4.6,
        reviewCount: 156,
        price: 350000,
        hasInsurance: false,
        languages: ['Việt'],
        isOnline: true,
        qualifications: ['Thạc sĩ Y khoa', 'Chuyên khoa I Da liễu'],
        awards: [],
        workHistory: [
            { period: '2016 - Nay', position: 'Bác sĩ Da liễu', hospital: 'Bệnh viện Da liễu Trung ương' },
        ],
        certificates: ['Chứng chỉ Laser Da liễu', 'Chứng chỉ Thẩm mỹ Da'],
    },
    {
        id: '5',
        name: 'BS. Hoàng Thị Lan',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
        specialty: 'Sản phụ khoa',
        hospital: 'Bệnh viện Phụ sản Trung ương',
        experience: 18,
        rating: 4.9,
        reviewCount: 421,
        price: 550000,
        hasInsurance: true,
        languages: ['Việt', 'Anh'],
        isOnline: false,
        qualifications: ['Tiến sĩ Y khoa', 'Chuyên khoa II Sản'],
        awards: ['Thầy thuốc nhân dân 2022'],
        workHistory: [
            { period: '2008 - Nay', position: 'Phó Giám đốc', hospital: 'Bệnh viện Phụ sản Trung ương' },
        ],
        certificates: ['Chứng chỉ IVF', 'Chứng chỉ Nội soi Sản'],
    },
    {
        id: '6',
        name: 'BS. Vũ Quốc Hùng',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
        specialty: 'Thần kinh',
        hospital: 'Bệnh viện Việt Đức',
        experience: 22,
        rating: 4.8,
        reviewCount: 267,
        price: 600000,
        hasInsurance: true,
        languages: ['Việt', 'Anh'],
        isOnline: true,
        qualifications: ['Giáo sư', 'Tiến sĩ Y khoa'],
        awards: ['Giải thưởng Hồ Chí Minh về Y học 2020'],
        workHistory: [
            { period: '2002 - Nay', position: 'Giám đốc Trung tâm Thần kinh', hospital: 'Bệnh viện Việt Đức' },
        ],
        certificates: ['Chứng chỉ Phẫu thuật Thần kinh', 'Chứng chỉ Điện não'],
    },
];

export const reviews: Review[] = [
    {
        id: '1',
        patientName: 'Nguyễn Văn Hải',
        patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        rating: 5,
        content: 'Bác sĩ rất tận tâm, giải thích rõ ràng về tình trạng bệnh. Tôi rất hài lòng với dịch vụ.',
        date: '15/03/2024',
    },
    {
        id: '2',
        patientName: 'Trần Thị Mai',
        patientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        rating: 5,
        content: 'Khám bệnh nhanh chóng, chuyên nghiệp. Bác sĩ rất chu đáo và thân thiện.',
        date: '12/03/2024',
    },
    {
        id: '3',
        patientName: 'Lê Văn Nam',
        patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        rating: 4,
        content: 'Dịch vụ tốt, thời gian chờ hợp lý. Sẽ quay lại khám.',
        date: '10/03/2024',
    },
];

export function generateWeekSchedule(startDate: Date = new Date()): DaySchedule[] {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const schedule: DaySchedule[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        const slots: { id: string; time: string; isAvailable: boolean; isBooked: boolean }[] = [];
        const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

        timeSlots.forEach((time, index) => {
            const isBooked = Math.random() > 0.7;
            const isAvailable = !isBooked && Math.random() > 0.3;
            slots.push({
                id: `${i}-${index}`,
                time,
                isAvailable,
                isBooked,
            });
        });

        schedule.push({
            date: date.toLocaleDateString('vi-VN'),
            dayName: days[date.getDay()],
            slots,
        });
    }

    return schedule;
}

export const samplePatient: Patient = {
    id: '1',
    name: 'Nguyễn Thị Hương',
    phone: '0912345678',
    email: 'huong.nguyen@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face',
};

export const sampleAppointments: Appointment[] = [
    {
        id: '1',
        doctor: doctors[0],
        patient: samplePatient,
        date: '25/04/2026',
        time: '09:00',
        status: 'confirmed',
        reason: 'Khám tim định kỳ',
        symptoms: 'Đau ngực nhẹ, khó thở khi vận động',
        location: 'Bệnh viện Bạch Mai - Phòng khám Tim mạch',
        isOnline: false,
    },
    {
        id: '2',
        doctor: doctors[2],
        patient: samplePatient,
        date: '28/04/2026',
        time: '14:30',
        status: 'pending',
        reason: 'Viêm họng kéo dài',
        symptoms: 'Đau họng, khó nuốt, ho khan',
        location: 'Online',
        isOnline: true,
    },
    {
        id: '3',
        doctor: doctors[1],
        patient: samplePatient,
        date: '15/03/2026',
        time: '10:00',
        status: 'completed',
        reason: 'Khám sức khỏe trẻ em',
        symptoms: 'Sốt nhẹ, mệt mỏi',
        location: 'Bệnh viện Nhi Trung ương',
        isOnline: false,
    },
    {
        id: '4',
        doctor: doctors[3],
        patient: samplePatient,
        date: '10/02/2026',
        time: '15:00',
        status: 'cancelled',
        reason: 'Nổi mẩn đỏ',
        symptoms: 'Ngứa, nổi mẩn',
        location: 'Online',
        isOnline: true,
    },
];
