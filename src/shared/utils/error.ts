/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleApiError = (err: any): string => {
  const status = err?.response?.status;
  const code = err?.response?.data?.messageCode;

  let message = 'Có lỗi xảy ra';

  switch (code) {
    case 'USER_EXISTS':
      message = 'Email đã tồn tại';
      break;
    case 'INVALID_CREDENTIALS':
      message = 'Sai email hoặc mật khẩu';
      break;
    case 'ROLE_NOT_SUPPORTED':
      message = 'Role không hợp lệ';
      break;
    default:
      if (status === 500) message = 'Server đang lỗi';
      else if (status === 404) message = 'Không tìm thấy dữ liệu';
  }

  alert(message); 
  return message;
};