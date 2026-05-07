/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';

const PaymentsManagement = () => {
  const { payments, paymentStats, loading, fetchPayments, fetchPaymentStats } = useAdmin();
  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  if (loading ) {
    return (
      <div className="p-5 text-center">
        <ScreenLoading message="Đang tải..." />
      </div>
    );
  }
  return (
    <div className="card-custom">
      <div className="card-header-custom">
        <h3>Quản lý thanh toán</h3>
      </div>

      <div className="card-body">
        {/* Payment Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card mini">
              <div className="stat-title">Tổng doanh thu</div>
              <div className="stat-value">
                {paymentStats?.total_revenue?.toLocaleString()}đ
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card mini">
              <div className="stat-title">Thành công</div>
              <div className="stat-value">{paymentStats?.success_count}</div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card mini">
              <div className="stat-title">Pending</div>
              <div className="stat-value">{paymentStats?.pending_count}</div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card mini">
              <div className="stat-title">Failed</div>
              <div className="stat-value">{paymentStats?.failed_count}</div>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <table className="table-custom">
          <thead>
            <tr>
              <th>Mã GD</th>
              <th>Bệnh nhân</th>
              <th>Số tiền</th>
              <th>Provider</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
            </tr>
          </thead>

          <tbody>
            {payments?.map((payment: any) => (
              <tr key={payment.transaction_code}>
                <td>{payment.transaction_code}</td>
                <td>{payment.patient_name}</td>
                <td>{payment.amount.toLocaleString()}đ</td>
                <td>{payment.provider}</td>
                <td>{payment.status}</td>
                <td>
                  {new Date(payment.created_at).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsManagement;
