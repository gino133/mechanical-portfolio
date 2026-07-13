# Các file đã sửa

## 1. `backend/src/models/User.js`
**Lỗi gốc:** hook `pre('save')` không gọi `next()` ở nhánh hash password, và thiếu `return` ở nhánh bỏ qua → mọi `User.create()` / `.save()` bị **treo vô thời hạn**, không bao giờ lưu được user (kể cả admin).
**Đã sửa:** thêm `return next()` và gọi `next()` sau khi hash xong.

## 2. `backend/src/seeds/seed.js` (đã chuyển từ `backend/src/routes/seed.js`)
**Lỗi gốc:**
- File nằm sai chỗ so với `package.json` (`"seed": "node src/seeds/seed.js"` nhưng file thật ở `src/routes/seed.js`) → `npm run seed` báo lỗi "Cannot find module" hoặc không chạy đúng file.
- `dotenv.config({ path: '../.env' })` dùng đường dẫn tương đối theo **thư mục bạn đứng khi chạy lệnh** (cwd), không phải theo vị trí file → dễ trỏ sai, khiến `MONGODB_URI`/`ADMIN_EMAIL`/`ADMIN_PASSWORD` là `undefined`.

**Đã sửa:**
- Chuyển file đúng vị trí `src/seeds/seed.js`, khớp với `package.json`.
- Dùng `path.resolve(__dirname, '../../.env')` để luôn tìm đúng `backend/.env` bất kể bạn chạy lệnh từ đâu.
- Thêm kiểm tra: nếu thiếu biến môi trường, báo lỗi rõ ràng ngay thay vì chạy tiếp và fail mơ hồ.

## 3. `backend/src/seeds/createAdmin.js` (file MỚI)
Script an toàn hơn `seed.js` — **chỉ tạo/cập nhật tài khoản admin**, không đụng tới `categories`/`products`/`projects`. Dùng script này cho các lần sau khi bạn cần đổi mật khẩu admin, để không bị mất dữ liệu khác.

## 4. `backend/package.json`
Thêm script `"seed:admin": "node src/seeds/createAdmin.js"`.

## 5. `backend/.env.example` (file MỚI)
Mẫu để bạn biết cần điền những biến nào vào `backend/.env` (file thật không được commit lên Git).

## 6. `backend/.gitignore` (file MỚI)
Trước đó repo không có `.gitignore` cho backend — nếu bạn từng tạo `.env` trong thư mục này và `git add .`, nó có thể đã bị commit lên GitHub công khai. **Kiểm tra ngay lịch sử commit trên GitHub xem `.env` có từng bị đẩy lên không** — nếu có, cần đổi toàn bộ secret (`JWT_SECRET`, mật khẩu MongoDB, `ADMIN_PASSWORD`) ngay cả sau khi xoá file.

---

# Cách áp dụng

1. Trong repo GitHub của bạn, **xoá file cũ** `backend/src/routes/seed.js` (không cần nữa, đã chuyển sang `src/seeds/`).
2. Copy các file trong bộ này đè vào đúng vị trí tương ứng trong repo của bạn.
3. Đảm bảo trong repo **không có file `.env` thật** bị commit (nó phải nằm trong `.gitignore`).
4. Push lên GitHub.
5. Trên máy local (hoặc Render Shell), tạo file `backend/.env` với giá trị thật (dựa theo `.env.example`), rồi chạy:
   ```
   cd backend
   npm install
   npm run seed
   ```
   (hoặc `npm run seed:admin` nếu bạn không muốn xoá categories/products/projects hiện có)
6. Kiểm tra lại MongoDB Atlas → `test.users` → phải thấy 1 document với `role: "admin"` và `password` là chuỗi hash bắt đầu bằng `$2a$` hoặc `$2b$`.
7. Thử đăng nhập lại trên trang admin.

Gửi lại log terminal sau bước 5 nếu vẫn có lỗi.
