import { useEffect } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';

const SettingsManagement = () => {
  const { settings, loading, fetchSettings } = useAdmin();

  useEffect(() => {
    fetchSettings();
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
        <h3>Cài đặt hệ thống</h3>
      </div>

      <div className="card-body">
        <div className="row g-4">
          <div className="col-md-6">
            <label>Tên hệ thống</label>
            <input
              className="form-control-custom"
              value={settings?.system_name || ''}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label>Email hỗ trợ</label>
            <input
              className="form-control-custom"
              value={settings?.support_email || ''}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsManagement;
