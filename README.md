# Project Structure - Medigo UI

## 1. Cấu trúc thư mục

```
src/
│
├── api/                 # gọi backend
│   ├── axiosClient.js
│   ├── doctorApi.js
│   ├── appointmentApi.js
│   └── chatApi.js
│
├── modules/             # chia theo feature
│
│   ├── doctor/
│   │   ├── DoctorPage.jsx
│   │   ├── DoctorDetail.jsx
│   │   ├── DoctorCard.jsx
│   │   ├── useDoctor.js
│   │   └── doctorService.js
│
│   ├── booking/
│   │   ├── BookingPage.jsx
│   │   ├── TimeSlotPicker.jsx
│   │   ├── useBooking.js
│   │   └── bookingService.js
│
│   ├── appointment/
│   │   ├── AppointmentPage.jsx
│   │   ├── useAppointment.js
│   │   └── appointmentService.js
│
│   ├── review/
│   │   ├── ReviewForm.jsx
│   │   └── reviewService.js
│
│   ├── chatbot/
│   │   ├── ChatBox.jsx
│   │   └── chatService.js
│
│   └── ai/
│       └── recommendService.js
│
├── shared/              # dùng chung
│   ├── components/
│   ├── hooks/
│   └── utils/
│
├── App.jsx
└── main.jsx
```

---

## 2. Giải thích cấu trúc

### api/

Chứa các file gọi API tới backend (axios, fetch...).

### modules/

Chia theo từng chức năng (feature-based):

* doctor: xử lý bác sĩ
* booking: đặt lịch
* appointment: quản lý lịch hẹn
* review: đánh giá
* chatbot: chat AI
* ai: gợi ý bác sĩ

### shared/

Chứa các thành phần dùng chung:

* components: UI component dùng lại
* hooks: custom hooks
* utils: hàm tiện ích

---

## 3. Cách sử dụng (Flow chuẩn)

### Ví dụ: Lấy danh sách bác sĩ

Flow:

```
DoctorPage.jsx
   ↓
useDoctor.js
   ↓
doctorService.js
   ↓
doctorApi.js
   ↓
Backend API
```

---

## 4. Quy tắc code

* UI chỉ gọi hook (useXxx)
* Hook gọi service
* Service gọi API
* Không gọi API trực tiếp trong component

---

## 5. Ví dụ code

### useDoctor.js

```javascript
import doctorService from "./doctorService";

export const useDoctor = () => {
  const getDoctors = async () => {
    return await doctorService.getAll();
  };

  return { getDoctors };
};
```

---

### doctorService.js

```javascript
import doctorApi from "../../api/doctorApi";

const getAll = () => {
  return doctorApi.get("/doctors");
};

export default { getAll };
```

---

### doctorApi.js

```javascript
import axiosClient from "./axiosClient";

const doctorApi = {
  get: (url) => axiosClient.get(url),
};

export default doctorApi;
```

---

## 6. Nguyên tắc thiết kế

* Tách rõ UI, logic và data
* Dễ bảo trì và mở rộng
* Không phụ thuộc trực tiếp vào API trong UI
* Có thể thay backend mà không ảnh hưởng UI
