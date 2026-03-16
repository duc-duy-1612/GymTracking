# HealthFlow Backend API

## Cài đặt

```bash
npm install
```

Tạo file `.env` (đã có sẵn) với:

- `MONGO_URI` – MongoDB connection string
- `PORT` – cổng server (mặc định 5000)
- `JWT_SECRET` – chuỗi bí mật để ký JWT

Chạy:

```bash
npm run dev
```

---

## Auth APIs

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | /api/auth/register | Đăng ký (name, email, password, role?) |
| POST | /api/auth/login | Đăng nhập (email, password) → trả token |

**Register body:** `{ "name": "...", "email": "...", "password": "...", "role": "user" | "admin" }`  
**Login body:** `{ "email": "...", "password": "..." }`  
**Response:** `{ message, token, user: { _id, name, email, role } }`

---

## User APIs (cần token)

Gửi header: `Authorization: Bearer <token>`

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | /api/users/me | Lấy thông tin user đăng nhập |
| PUT | /api/users/me | Cập nhật profile (name, gender, age, measurements, activityLevel, goals) |

---

## Phân quyền

- **protect**: route yêu cầu đăng nhập (có token hợp lệ).
- **authorize('admin')**: chỉ role admin (dùng cho route sau khi đã protect).

Ví dụ thêm route chỉ admin:

```js
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
router.post('/something', protect, authorize('admin'), controller);
```
