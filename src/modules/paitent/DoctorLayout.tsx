import { Outlet } from 'react-router-dom';
import DoctorHeader from './DoctorHeader';

const DoctorLayout = () => {
  return (
    <>
      {/* NAVBAR CHUNG */}
      <DoctorHeader />

      {/* CONTENT THAY ĐỔI */}
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default DoctorLayout;
