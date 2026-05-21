/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';
import './styles/payments-management.css';

const PaymentsManagement = () => {
  const { payments, paymentStats, loading, fetchPayments, fetchPaymentStats } =
    useAdmin();

  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  // THÊM
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });

  useEffect(() => {
    fetchPayments(filter);

    fetchPaymentStats();
  }, [filter]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'REFUND_SUCCESS':
        return 'success';

      case 'PENDING':
        return 'pending';

      case 'FAILED':
      case 'REFUND_FAILED':
        return 'failed';

      default:
        return 'pending';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'Thanh toán thành công';

      case 'REFUND_SUCCESS':
        return 'Hoàn tiền thành công';

      case 'PENDING':
        return 'Đang xử lý';

      case 'FAILED':
        return 'Thanh toán thất bại';

      case 'REFUND_FAILED':
        return 'Hoàn tiền thất bại';

      default:
        return status;
    }
  };

  const formatLogStatus = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'Thành công';

      case 'PENDING':
        return 'Đang xử lý';

      case 'FAILED':
        return 'Thất bại';

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <ScreenLoading message="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="payments-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý thanh toán</h1>

          <p className="page-subtitle">
            Theo dõi giao dịch và lịch sử thanh toán
          </p>
        </div>
      </div>

      <div className="card-custom">
        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Tổng doanh thu</div>

            <div className="stat-value">
              {paymentStats?.total_revenue?.toLocaleString()}đ
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Thành công</div>

            <div className="stat-value">{paymentStats?.success_count}</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Đang xử lý</div>

            <div className="stat-value">{paymentStats?.pending_count}</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Thất bại</div>

            <div className="stat-value">{paymentStats?.failed_count}</div>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Loại</th>
                <th>Mã giao dịch</th>
                <th>Bệnh nhân</th>
                <th>Số tiền</th>
                <th>Provider</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {payments?.length > 0 ? (
                payments.map((payment: any) => (
                  <tr key={payment.id}>
                    <td>
                      <div
                        className={`payment-badge ${
                          payment.type === 'REFUND' ? 'refund' : 'payment'
                        }`}
                      >
                        {payment.type === 'REFUND' ? 'Hoàn tiền' : 'Thanh toán'}
                      </div>
                    </td>

                    <td>
                      <div
                        className="transaction-code"
                        title={payment.transaction_code}
                      >
                        {payment.transaction_code}
                      </div>
                    </td>

                    <td>
                      <div className="patient-name">{payment.patient_name}</div>
                    </td>

                    <td>
                      <div className="amount-text">
                        {payment.amount.toLocaleString()}đ
                      </div>
                    </td>

                    <td>
                      <div className="provider-badge">{payment.provider}</div>
                    </td>

                    <td>
                      <div
                        className={`status-badge ${getStatusClass(
                          payment.status,
                        )}`}
                      >
                        {formatStatus(payment.status)}
                      </div>
                    </td>

                    <td>
                      <div className="payment-date">
                        {new Date(payment.created_at).toLocaleString('vi-VN')}
                      </div>
                    </td>

                    <td>
                      <button
                        className="detail-btn"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-payment">Không có giao dịch nào</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* THÊM PAGINATION */}
        <div className="d-flex gap-2 mt-3 justify-content-center">
          <button
            className="detail-btn"
            disabled={filter.page === 1}
            onClick={() =>
              setFilter((prev) => ({
                ...prev,
                page: prev.page - 1,
              }))
            }
          >
            Trước
          </button>

          <div>Trang {filter.page}</div>

          <button
            className="detail-btn"
            onClick={() =>
              setFilter((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
          >
            Sau
          </button>
        </div>
      </div>

      {/* MODAL */}
      {selectedPayment && (
        <div
          className="payment-modal-overlay"
          onClick={() => setSelectedPayment(null)}
        >
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            {/* HEADER */}
            <div className="payment-modal-header">
              <div>
                <h3>Chi tiết giao dịch</h3>

                <p>{selectedPayment.transaction_code}</p>
              </div>

              <button
                className="close-modal-btn"
                onClick={() => setSelectedPayment(null)}
              >
                ✕
              </button>
            </div>

            {/* INFO */}
            <div className="payment-detail-grid">
              <div className="payment-detail-card">
                <span>Bệnh nhân</span>

                <strong>{selectedPayment.patient_name}</strong>
              </div>

              <div className="payment-detail-card">
                <span>Số tiền</span>

                <strong>{selectedPayment.amount.toLocaleString()}đ</strong>
              </div>

              <div className="payment-detail-card">
                <span>Provider</span>

                <strong>{selectedPayment.provider}</strong>
              </div>

              <div className="payment-detail-card">
                <span>Trạng thái</span>

                <strong>{formatStatus(selectedPayment.status)}</strong>
              </div>
            </div>

            {/* TIMELINE */}
            {selectedPayment?.logs?.length > 0 ? (
              <div className="logs-timeline">
                {selectedPayment.logs.map((log: any, index: number) => (
                  <div className="timeline-item" key={index}>
                    <div
                      className={`timeline-dot ${getStatusClass(log.status)}`}
                    />

                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div
                          className={`timeline-status ${getStatusClass(
                            log.status,
                          )}`}
                        >
                          {formatLogStatus(log.status)}
                        </div>

                        <div className="timeline-time">
                          {new Date(log.created_at).toLocaleString('vi-VN')}
                        </div>
                      </div>

                      <div className="timeline-message">{log.message}</div>

                      <div className="timeline-json">
                        <pre>{JSON.stringify(log.data, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-payment">Không có log giao dịch</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
