# HealthFlow / GymTracking

Ứng dụng web theo dõi sức khỏe và tập luyện (đồ án), giao diện kiểu Fitbit.

## Công nghệ

- **Frontend:** React (Vite), React Router, Axios, Chart.js, react-hot-toast
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT
- **Chức năng:** Đăng ký/Đăng nhập, Hồ sơ (BMI/BMR/TDEE tự tính), Today (nước, calo, ngủ, tập), Dinh dưỡng, Giấc ngủ, Bài tập, Coach (lớp/HLV), Thống kê, Lịch sử, Cài đặt, Đổi mật khẩu

## Cấu trúc thư mục

```
GymTracking/
├── backend/          # API Node + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── app.js
│   ├── .env
│   └── package.json
├── frontend/         # React (Vite)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Chạy dự án

### 1. MongoDB

- Cài đặt MongoDB và chạy service (localhost:27017), hoặc dùng MongoDB Atlas.
- Tạo database (tự tạo khi kết nối lần đầu).

### 2. Backend

```bash
cd GymTracking/backend
npm install
```

- Tạo file `.env` trong `backend/` (xem `.env.example` nếu có), ví dụ:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gymtracking
JWT_SECRET=your-secret-key
```

- Chạy server:

```bash
npm run dev
```

- API chạy tại `http://localhost:5000` (hoặc PORT trong .env).

### 3. Frontend

```bash
cd GymTracking/frontend
npm install
npm run dev
```

- Mở trình duyệt tại `http://localhost:5173`.

### 4. Đăng nhập / Demo

- Đăng ký tài khoản mới tại `/register`, sau đó đăng nhập tại `/`.
- Sau khi đăng nhập: cập nhật Hồ sơ (cân nặng, chiều cao, mục tiêu) → xem Today, Dinh dưỡng, Giấc ngủ, Bài tập, Thống kê, Lịch sử.

## API chính

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/users/me | Lấy thông tin user (cần token) |
| PUT | /api/users/me | Cập nhật hồ sơ |
| PUT | /api/users/me/password | Đổi mật khẩu |
| GET | /api/daily-summaries/today | Lấy/cập nhật summary hôm nay |
| PUT | /api/daily-summaries/today | Cập nhật (nước, calo, ngủ, exercisedToday...) |
| GET | /api/daily-summaries?from=...&to=... | Lịch sử theo khoảng ngày |

## License

Đồ án học tập.
