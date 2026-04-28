/* eslint-disable react-hooks/set-state-in-effect */
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
import logo from '@/images/logo.png';
import ScreenLoading from '../../shared/utils/loading';

const DoctorPage: React.FC = () => {
  // ❗ sửa hook: doctors -> data, total
  const { doctors, total, loading, error, fetchDoctors } = useDoctor();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'createdAt',
    specialties: [],
    clinics: [],
    priceRange: { min: 0, max: 1000000 },
    minRating: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = import.meta.env.VITE_PAGE_SIZE || 6;

  // Header scroll
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

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDoctors({
        search: searchTerm,
        specialties: filters.specialties,
        clinics: filters.clinics,
        minPrice: filters.priceRange.min,
        maxPrice: filters.priceRange.max,
        minRating: filters.minRating,
        sortBy: filters.sortBy,

        page: currentPage,
        size: pageSize,
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm, filters, currentPage]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {loading ? (
        <ScreenLoading message="Đang tải danh sách bác sĩ..." show={loading} />
      ) : (
        <div className="doctor-page">
          {/* HEADER */}
          <div className="doctor-header py-3 shadow-sm bg-white" ref={headerRef}>
            <div className="container d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img src={logo} className="header-logo" alt="logo" />
                <h5 className="mb-0 fw-bold">MediCare</h5>
              </div>

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

          {/* SEARCH */}
          <div className="search-wrapper">
            <div className="search-box shadow-sm">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm bác sĩ..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* MAIN */}
          <div className="container mt-4">
            <div className="row">
              <div className="col-lg-3">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={() =>
                    setFilters({
                      sortBy: 'createdAt',
                      specialties: [],
                      clinics: [],
                      priceRange: { min: 0, max: 1000000 },
                      minRating: 0,
                    })
                  }
                />
              </div>

              <div className="col-lg-9">
                <h5 className="fw-bold mb-3">Tìm bác sĩ</h5>
                <p className="text-muted">
                  Tổng {total} bác sĩ
                </p>

                {error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <>
                    <div className="row">
                      {doctors.map((doctor) => (
                        <div key={doctor.id} className="col-md-6 mb-3">
                          <DoctorCard doctor={doctor} />
                        </div>
                      ))}
                    </div>

                    {/* ✅ pagination */}
                    {totalPages > 1 && (
                      <nav className="mt-4 d-flex justify-content-center">
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                              Previous
                            </button>
                          </li>

                          {[...Array(totalPages)].map((_, i) => (
                            <li
                              key={i}
                              className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          ))}

                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CHAT */}
          <button className="chat-floating-btn" onClick={() => setShowAIChat(true)}>
            <i className="fas fa-comment-dots"></i>
          </button>

          {showAIChat && (
            <div className="chat-popup">
              <AIChatAssistant onClose={() => setShowAIChat(false)} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DoctorPage;