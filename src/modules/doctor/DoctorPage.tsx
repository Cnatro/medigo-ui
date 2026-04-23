import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/doctor.css';
import { useDoctor } from './hooks/useDoctor';
import type { FilterOptions } from './doctorService';
import FilterSidebar from './FilterSidebar';
import DoctorCard from './DoctorCard';
import AIChatAssistant from './AIChatAssistant';
import { useAuth } from '../../shared/components/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorPage: React.FC = () => {
  const { doctors, loading, error, fetchDoctors, filterDoctors } = useDoctor();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'rating',
    specialties: [],
    clinics: [],
    priceRange: { min: 0, max: 1000000 },
    minRating: 0,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      if (window.scrollY > 10) {
        headerRef.current.classList.add('scrolled');
      } else {
        headerRef.current.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    filterDoctors(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      sortBy: 'rating',
      specialties: [],
      clinics: [],
      priceRange: { min: 0, max: 1000000 },
      minRating: 0,
    };
    setFilters(resetFilters);
    filterDoctors(resetFilters);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="doctor-page">
      {/* HEADER */}
      <div className="doctor-header py-3 shadow-sm bg-white" ref={headerRef}>
        <div className="container d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">MediCare</h5>

          <div className="d-flex align-items-center gap-3">
            <i className="fas fa-bell text-secondary"></i>
            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            >
              <div className="doctor-avatar-mini">
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="avatar" />
                ) : (
                  <div className="avatar-fallback">
                    <i className="fas fa-user-md"></i>
                  </div>
                )}
              </div>
              <span>{currentUser?.full_name || 'User'}</span>
            </div>
          </div>
        </div>
      </div>

      {/*   SEARCH CENTER */}
      <div className="search-wrapper">
        <div className="search-box shadow-sm">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm bác sĩ, chuyên khoa, bệnh viện..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* MAIN */}
      <div className="container mt-4">
        <div className="row">
          {/* FILTER */}
          <div className="col-lg-3">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* LIST */}
          <div className="col-lg-9">
            <h5 className="fw-bold mb-3">Tìm bác sĩ</h5>
            <p className="text-muted">
              Tìm thấy {filteredDoctors.length} bác sĩ phù hợp
            </p>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" />
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                <div className="row">
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="col-md-6 mb-3">
                      <DoctorCard doctor={doctor} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/*   FLOAT CHAT BUTTON */}
      <button className="chat-floating-btn" onClick={() => setShowAIChat(true)}>
        <i className="fas fa-comment-dots"></i>
      </button>

      {/*   CHAT POPUP */}
      {showAIChat && (
        <div className="chat-popup">
          <AIChatAssistant onClose={() => setShowAIChat(false)} />
        </div>
      )}
    </div>
  );
};

export default DoctorPage;
