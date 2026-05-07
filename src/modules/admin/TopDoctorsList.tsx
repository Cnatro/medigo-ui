import React from 'react';

interface Doctor {
  doctor_id: string;
  doctor_name: string;
  patients: number;
  rating: number;
  specialty: string;
}

interface TopDoctorsListProps {
  doctors: Doctor[];
}

const TopDoctorsList: React.FC<TopDoctorsListProps> = ({ doctors }) => {
  const renderStars = (rating: number) => {
    const stars = [];

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star star-icon"></i>);
    }

    // half star
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt star-icon"></i>);
    }

    // empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star star-icon"></i>);
    }

    return stars;
  };

  return (
    <div>
      {doctors.map((doctor, index) => (
        <div key={index} className="doctor-item">
          <div className="doctor-info">
            <h4>{doctor.doctor_name}</h4>
            <div className="doctor-specialty">{doctor.specialty}</div>
          </div>
          <div className="doctor-stats">
            <div className="doctor-rating">{renderStars(doctor.rating)} - {doctor.rating}</div>
            <div className="doctor-patients">{doctor.patients} bệnh</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopDoctorsList;
