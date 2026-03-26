# HealthFlow — Gym Tracking App

Ứng dụng theo dõi sức khỏe & tập luyện toàn diện dạng MERN Stack (MongoDB, Express, React, Node.js).

## 📋 Yêu cầu hệ thống

- [Node.js](https://nodejs.org/) v18 trở lên
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (cài local) **hoặc** MongoDB Atlas (cloud)
- npm (đi kèm Node.js)

---

## 🚀 Hướng dẫn cài đặt & chạy dự án

### Bước 1 — Clone dự án

```bash
git clone <url-repository>
cd GymTracking
```

### Bước 2 — Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/healthflow
PORT=5000
JWT_SECRET=healthflow_secret_key_change_in_production
```

> 💡 Nếu dùng MongoDB Atlas, thay `MONGO_URI` bằng chuỗi kết nối Atlas.

### Bước 3 — Nạp dữ liệu mẫu (Seed Database)

> ⚠️ Lệnh này sẽ **xóa và tạo mới** toàn bộ dữ liệu trong database `healthflow`.

```bash
cd backend
npm run seed
```

Lệnh trên sẽ tự động chạy tuần tự các file seed:

| File | Nội dung |
|---|---|
| `seedUsers.js` | 2 tài khoản mẫu (admin + user) |
| `seedInstructors.js` | 8 huấn luyện viên |
| `seedCoachClasses.js` | Các lớp học |
| `seedBrands.js` | Thương hiệu thiết bị |
| `seedFoodItems.js` | ~333 món ăn Việt Nam (có calo, protein, carbs, fat) |
| `seedExercises.js` | 31 bài tập gym kèm hình ảnh động |

**Tài khoản mẫu sau khi seed:**

| Email | Mật khẩu | Vai trò |
|---|---|---|
| `admin@gymtracking.com` | `password123` | Admin |
| `test@gymtracking.com` | `password123` | User |

### Bước 4 — Khởi động Backend

```bash
cd backend
npm run dev
```

Backend chạy tại: `http://localhost:5000`

### Bước 5 — Cài đặt & Khởi động Frontend

Mở terminal mới:

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

---

## 📂 Cấu trúc thư mục

```
GymTracking/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Logic xử lý API
│   │   ├── models/             # Mongoose schema (User, Exercise, FoodItem, ...)
│   │   ├── routes/             # Định nghĩa các endpoint API
│   │   ├── middleware/         # Auth middleware (JWT)
│   │   └── services/          # Business logic
│   ├── seedAll.js              # Script seed toàn bộ DB (npm run seed)
│   ├── seedUsers.js            # Seed tài khoản mẫu
│   ├── seedInstructors.js      # Seed huấn luyện viên
│   ├── seedCoachClasses.js     # Seed lớp học
│   ├── seedBrands.js           # Seed thương hiệu
│   ├── seedFoodItems.js        # Seed ~333 món ăn Việt Nam
│   ├── seedExercises.js        # Seed 31 bài tập gym (GIF animation)
│   ├── server.js               # Entry point Express
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/              # Các trang (Today, Workout, Nutrition, Sleep, ...)
    │   ├── components/         # Components dùng chung (ProgressRing, Chart, ...)
    │   ├── services/           # Axios API services
    │   ├── context/            # React Context (UserContext, ...)
    │   └── index.css           # Global CSS + Design system
    └── package.json
```

---

## 🔧 Scripts hữu ích

| Lệnh | Mô tả |
|---|---|
| `cd backend && npm run dev` | Chạy backend (nodemon, tự reload) |
| `cd backend && npm run seed` | Seed lại toàn bộ database |
| `cd frontend && npm run dev` | Chạy frontend Vite |

---

## ✨ Tính năng chính

- 🏋️ **Workout Tracker** — Bộ đếm set/rep tự động, lịch sử buổi tập
- 🍽️ **Nutrition Tracking** — Tra cứu 333+ món ăn, theo dõi calo/macro hằng ngày
- 😴 **Sleep Tracker** — Nhập giờ ngủ, cảnh báo nếu ngủ không đủ 7 ngày liên tiếp
- 📊 **Dashboard** — Biểu đồ giấc ngủ, vòng tiến độ cân nặng, chỉ số sức khoẻ
- 🏃 **Coach Classes** — Xem lịch lớp học với huấn luyện viên
- 🎯 **Smart Goals** — Tính toán calo mục tiêu theo giới tính, cân nặng, hoạt động
