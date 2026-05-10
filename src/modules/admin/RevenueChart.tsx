/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const RevenueChart = ({ data }: any) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="day" />

        <YAxis tickFormatter={(value) => `${value / 1000}K`} />

        <Tooltip
          formatter={(value: any) => [formatCurrency(value), 'Doanh thu']}
          labelFormatter={(label) => `Ngày: ${label}`}
        />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#28a745"
          name="Doanh thu"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
