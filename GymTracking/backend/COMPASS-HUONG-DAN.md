# Kết nối MongoDB Compass và tạo database healthflow

## 1. Kết nối Compass với MongoDB

- Trong Compass, bên trái đã có sẵn **localhost:27017**.
- **Bấm vào "localhost:27017"** để kết nối.
- Nếu chưa chạy MongoDB: mở CMD/PowerShell và gõ `mongod`, sau đó thử lại trong Compass.

Nếu chưa có connection:

- Bấm **"+ Add new connection"**.
- Điền: `mongodb://localhost:27017`
- Bấm **Connect**.

---

## 2. Tạo database "healthflow"

Sau khi đã kết nối (thấy các database như `admin`, `local`...):

1. Bấm nút **"Create Database"** (hoặc **"Add Database"** / **"+ CREATE"** tùy phiên bản Compass).
2. **Database Name:** gõ `healthflow`.
3. **Collection Name:** gõ `users` (collection đầu tiên).
4. Bấm **Create Database**.

Database `healthflow` và collection `users` sẽ được tạo. Sau đó bạn có thể thêm collection khác (workouts, nutritions...) khi cần bằng cách vào database `healthflow` → **Create Collection**.

---

## 3. Kiểm tra từ backend

Trong thư mục `backend` đã có file `.env` với:

```
MONGO_URI=mongodb://localhost:27017/healthflow
```

Chạy:

```bash
cd GymTracking/backend
npm install
node server.js
```

Nếu thấy dòng `✅ Đã kết nối MongoDB: ...` là đã kết nối đúng database `healthflow`.
