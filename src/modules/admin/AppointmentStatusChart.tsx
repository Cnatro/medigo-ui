/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#0d6efd', '#198754', '#dc3545', '#ffc107'];

const statusMap: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const AppointmentStatusChart = ({ data }: any) => {
  const formattedData = data.map((item: any) => ({
    ...item,
    statusLabel: statusMap[item.status] || item.status,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={formattedData}
          dataKey="count"
          nameKey="statusLabel"
          outerRadius={100}
          label={({ name, percent }) =>
            `${name}: ${((percent || 0) * 100).toFixed(0)}%`
          }
        >
          {formattedData.map((_: any, index: number) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          formatter={(value: any, _: any, props: any) => [
            `${value} lịch`,
            props.payload.statusLabel,
          ]}
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AppointmentStatusChart;
