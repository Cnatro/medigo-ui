import React, { useEffect, useState } from 'react';
import type { ClinicItem, FilterOptions, SpecialtyItem } from './doctorService';
import { doctorService } from './doctorService';
import './styles/filter-sidebar.css';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [clinics, setClinics] = useState<ClinicItem[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicRes, specRes] = await Promise.all([
          doctorService.getClinics(),
          doctorService.getSpecialties(),
        ]);

        setClinics(clinicRes.data.data);
        setSpecialties(specRes.data.data);
      } catch (err) {
        console.error('Load filter data error:', err);
      }
    };

    fetchData();
  }, []);

  const handleSpecialtyChange = (id: string) => {
    const newList = filters.specialties.includes(id)
      ? filters.specialties.filter((x) => x !== id)
      : [...filters.specialties, id];

    onFilterChange({ ...filters, specialties: newList });
  };

  const handleClinicsChange = (clinicId: string) => {
    const newClinics = filters.clinics.includes(clinicId)
      ? filters.clinics.filter((c) => c !== clinicId)
      : [...filters.clinics, clinicId];

    onFilterChange({ ...filters, clinics: newClinics });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as FilterOptions['sortBy'],
    });
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-card">
        <div className="filter-card-body">
          {/* HEADER */}
          <div className="filter-header">
            <h6 className="filter-title">
              <i className="fas fa-filter me-2"></i>
              Bộ lọc tìm kiếm
            </h6>
            <button onClick={onReset} className="reset-btn">
              <i className="fas fa-undo-alt me-1"></i>
              Đặt lại
            </button>
          </div>

          {/* SORT - Hidden but kept for structure */}
          <div className="filter-section" hidden>
            <label className="filter-label">Sắp xếp theo</label>
            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>

          {/* SPECIALTIES */}
          <div className="filter-section">
            <h6 className="filter-section-title">
              <i className="fas fa-stethoscope me-2"></i>
              Chuyên khoa
            </h6>
            <div className="filter-options">
              {specialties.map((spec) => (
                <label key={spec.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.specialties.includes(spec.id)}
                    onChange={() => handleSpecialtyChange(spec.id)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">{spec.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* CLINICS */}
          <div className="filter-section">
            <h6 className="filter-section-title">
              <i className="fas fa-hospital me-2"></i>
              Bệnh viện
            </h6>
            <div className="filter-options">
              {clinics.slice(0, 6).map((clinic) => (
                <label key={clinic.id} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.clinics.includes(clinic.id)}
                    onChange={() => handleClinicsChange(clinic.id)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">{clinic.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="filter-section">
            <h6 className="filter-section-title">
              <i className="fas fa-tag me-2"></i>
              Khoảng giá
            </h6>
            <div className="price-range-container">
              <input
                type="range"
                className="price-slider"
                min="0"
                max="1000000"
                step="50000"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  setPriceRange([0, newMax]);

                  onFilterChange({
                    ...filters,
                    priceRange: { min: 0, max: newMax },
                  });
                }}
              />
              <div className="price-labels">
                <span className="price-min">0₫</span>
                <span className="price-max">
                  {priceRange[1].toLocaleString('vi-VN')}₫
                </span>
              </div>
              <div className="price-track">
                <div
                  className="price-progress"
                  style={{ width: `${(priceRange[1] / 1000000) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* RATING */}
          <div className="filter-section">
            <h6 className="filter-section-title">
              <i className="fas fa-star me-2"></i>
              Đánh giá
            </h6>
            <div className="filter-options">
              {[5, 4, 3, 2].map((r) => (
                <label key={r} className="filter-radio">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === r}
                    onChange={() => handleRatingChange(r)}
                  />
                  <span className="radio-mark"></span>
                  <span className="radio-label">
                    <span className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < r ? 'filled' : ''}`}
                        ></i>
                      ))}
                    </span>
                    <span className="rating-text">trở lên</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {(filters.specialties.length > 0 ||
            filters.clinics.length > 0 ||
            filters.minRating > 0 ||
            filters.priceRange.max < 1000000) && (
            <div className="active-filters">
              <div className="active-filters-header">
                <i className="fas fa-check-circle"></i>
                <span>Bộ lọc đang áp dụng</span>
              </div>
              <div className="active-filters-list">
                {filters.specialties.length > 0 && (
                  <span className="filter-tag">
                    {filters.specialties.length} chuyên khoa
                  </span>
                )}
                {filters.clinics.length > 0 && (
                  <span className="filter-tag">
                    {filters.clinics.length} bệnh viện
                  </span>
                )}
                {filters.minRating > 0 && (
                  <span className="filter-tag">{filters.minRating}+ sao</span>
                )}
                {filters.priceRange.max < 1000000 && (
                  <span className="filter-tag">
                    &lt; {filters.priceRange.max.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
