/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';

const ClinicsManagement = () => {
  const { clinics, loading, fetchClinics } = useAdmin();

  useEffect(() => {
    fetchClinics();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <ScreenLoading message="Đang tải..." />
      </div>
    );
  }
  return (
    <div className="card-custom">
      <div className="card-header-custom">
        <h3>Quản lý bệnh viện</h3>
      </div>

      <div className="card-body">
        <div className="row g-3">
          {clinics?.map((clinic: any) => (
            <div key={clinic.id} className="col-md-6 col-lg-4">
              <div className="hospital-card">
                <div className="hospital-header">
                  <i className="fas fa-hospital hospital-icon"></i>
                  <h5>{clinic.name}</h5>
                </div>

                <p className="hospital-address">
                  <i className="fas fa-map-marker-alt"></i>
                  {clinic.address}
                </p>

                <p className="hospital-phone">
                  <i className="fas fa-phone"></i>
                  {clinic.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClinicsManagement;
