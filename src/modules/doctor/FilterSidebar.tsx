import React, { useEffect, useState } from 'react';
import type { ClinicItem, FilterOptions, SpecialtyItem } from './doctorService';
import { doctorService } from './doctorService';

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

  const handleSpecialtyChange = (specialtyId: string) => {
    const newSpecialties = filters.specialties.includes(specialtyId)
      ? filters.specialties.filter((s) => s !== specialtyId)
      : [...filters.specialties, specialtyId];

    onFilterChange({ ...filters, specialties: newSpecialties });
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
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-4">
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0">Bộ lọc</h6>
            <button
              onClick={onReset}
              className="btn btn-link text-primary p-0 text-decoration-none small"
            >
              Đặt lại
            </button>
          </div>

          {/* SORT */}
          <div className="mb-4">
            <label className="form-label small text-secondary mb-1">
              Sắp xếp theo
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>

          {/* SPECIALTIES */}
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Chuyên khoa</h6>

            {specialties.map((spec) => (
              <div key={spec.id} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`spec-${spec.id}`}
                  checked={filters.specialties.includes(spec.id)}
                  onChange={() => handleSpecialtyChange(spec.id)}
                />
                <label
                  className="form-check-label small"
                  htmlFor={`spec-${spec.id}`}
                >
                  {spec.name}
                </label>
              </div>
            ))}
          </div>

          {/* CLINICS */}
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Bệnh viện</h6>

            {clinics.slice(0, 6).map((clinic) => (
              <div key={clinic.id} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`clinic-${clinic.id}`}
                  checked={filters.clinics.includes(clinic.id)}
                  onChange={() => handleClinicsChange(clinic.id)}
                />
                <label
                  className="form-check-label small"
                  htmlFor={`clinic-${clinic.id}`}
                >
                  {clinic.name}
                </label>
              </div>
            ))}
          </div>

          {/* PRICE */}
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Khoảng giá</h6>

            <input
              type="range"
              className="form-range"
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
            <div className="d-flex justify-content-between mt-2">
              <span className="small text-secondary">0đ</span>
              <span className="small fw-semibold text-dark">
                {priceRange[1].toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* RATING */}
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Đánh giá</h6>

            {[4, 3, 2, 1].map((r) => (
              <div key={r} className="form-check mb-2">
                <input
                  type="radio"
                  className="form-check-input"
                  name="rating"
                  id={`rating-${r}`}
                  checked={filters.minRating === r}
                  onChange={() => handleRatingChange(r)}
                />
                <label
                  className="form-check-label small"
                  htmlFor={`rating-${r}`}
                >
                  Từ {r}★ trở lên
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
