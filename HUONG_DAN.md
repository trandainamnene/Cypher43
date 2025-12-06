# 📚 HƯỚNG DẪN DỰ ÁN BACKEND NODE.JS + EXPRESS.JS

## 🎯 Tổng quan

Dự án này là một backend API được xây dựng bằng Node.js và Express.js. Đây là cấu trúc cơ bản để bạn có thể bắt đầu phát triển ứng dụng của mình.

---

## 📁 Cấu trúc thư mục

```
BackEndCyper43/
│
├── index.js                 # File chính khởi động server
├── package.json             # File cấu hình dependencies và scripts
├── .env.example             # File mẫu cho biến môi trường
├── .gitignore              # File loại trừ khỏi Git
│
├── routes/                  # Thư mục chứa các routes (định tuyến)
│   └── api.js              # Routes API chính
│
├── controllers/             # Thư mục chứa các controllers (xử lý logic)
│   └── testController.js   # Controller mẫu để test
│
├── middleware/              # Thư mục chứa các middleware (xử lý trung gian)
│   ├── errorHandler.js     # Xử lý lỗi
│   └── notFound.js         # Xử lý route không tồn tại
│
├── models/                  # Thư mục chứa các models (cấu trúc dữ liệu)
│   └── (sẽ thêm sau khi có database)
│
├── config/                  # Thư mục chứa các file cấu hình
│   └── database.js         # Cấu hình database (mẫu)
│
└── utils/                   # Thư mục chứa các utility functions
    └── logger.js           # Utility để logging
```

---

## 🚀 Cách bắt đầu

### Bước 1: Cài đặt dependencies

Mở terminal trong thư mục dự án và chạy:

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các package được liệt kê trong `package.json`:
- **express**: Framework web cho Node.js
- **dotenv**: Quản lý biến môi trường
- **cors**: Cho phép Cross-Origin Resource Sharing
- **morgan**: Middleware để log HTTP requests
- **helmet**: Bảo mật HTTP headers
- **nodemon**: Tự động restart server khi code thay đổi (chỉ dùng trong development)

### Bước 2: Tạo file .env

Sao chép file `.env.example` và đổi tên thành `.env`:

```bash
# Trên Windows PowerShell
Copy-Item .env.example .env

# Hoặc trên Git Bash/Linux/Mac
cp .env.example .env
```

Sau đó mở file `.env` và điều chỉnh các giá trị nếu cần.

### Bước 3: Chạy server

**Chế độ development** (tự động restart khi code thay đổi):
```bash
npm run dev
```

**Chế độ production**:
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000` (hoặc port bạn đã cấu hình trong `.env`)

---

## 📝 Giải thích các file chính

### 1. `index.js` - File chính

Đây là file khởi động server. Nó:
- Import và cấu hình Express
- Thiết lập các middleware cơ bản
- Kết nối các routes
- Xử lý lỗi
- Khởi động server

### 2. `routes/api.js` - Định tuyến API

File này định nghĩa các endpoints của API. Ví dụ:
- `GET /api/test` - Test GET request
- `POST /api/test` - Test POST request
- `GET /api/health` - Kiểm tra trạng thái server

### 3. `controllers/testController.js` - Controller mẫu

Controller chứa logic xử lý cho các routes. Mỗi route sẽ gọi một function trong controller tương ứng.

### 4. `middleware/` - Middleware

**errorHandler.js**: Xử lý tất cả các lỗi trong ứng dụng
**notFound.js**: Xử lý khi người dùng truy cập route không tồn tại

### 5. `config/database.js` - Cấu hình Database

File mẫu để bạn thêm cấu hình kết nối database (MongoDB, PostgreSQL, MySQL, etc.)

---

## 🧪 Test API

Sau khi chạy server, bạn có thể test các endpoints:

### 1. Test GET request
```bash
# Sử dụng curl
curl http://localhost:3000/api/test

# Hoặc mở trình duyệt và truy cập
http://localhost:3000/api/test
```

### 2. Test POST request
```bash
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","message":"Hello World"}'
```

### 3. Health check
```bash
curl http://localhost:3000/api/health
```

---

## 📦 Các package đã cài đặt

### Dependencies (chạy trong production):
- **express**: Framework web chính
- **dotenv**: Quản lý biến môi trường từ file .env
- **cors**: Cho phép frontend từ domain khác gọi API
- **morgan**: Logging HTTP requests (hiển thị trong console)
- **helmet**: Bảo mật bằng cách set các HTTP headers an toàn

### DevDependencies (chỉ dùng khi development):
- **nodemon**: Tự động restart server khi file thay đổi

---

## 🔧 Các bước tiếp theo

### 1. Thêm Database
- Cài đặt driver database (ví dụ: `mongoose` cho MongoDB, `pg` cho PostgreSQL)
- Cấu hình trong `config/database.js`
- Tạo models trong thư mục `models/`

### 2. Thêm Authentication
- Cài đặt `jsonwebtoken` và `bcryptjs`
- Tạo middleware `auth.js` trong thư mục `middleware/`
- Tạo routes và controllers cho đăng nhập/đăng ký

### 3. Thêm Validation
- Cài đặt `joi` hoặc `express-validator`
- Tạo middleware validation cho các routes

### 4. Thêm File Upload
- Cài đặt `multer`
- Tạo route và controller để xử lý upload file

### 5. Thêm Testing
- Cài đặt `jest` hoặc `mocha`
- Tạo thư mục `tests/` và viết test cases

---

## 📚 Tài liệu tham khảo

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)

---

## ⚠️ Lưu ý quan trọng

1. **Không commit file `.env`**: File này chứa thông tin nhạy cảm, đã được thêm vào `.gitignore`

2. **Environment Variables**: Luôn sử dụng biến môi trường cho các thông tin nhạy cảm (API keys, database passwords, etc.)

3. **Error Handling**: Luôn xử lý lỗi đúng cách trong controllers và sử dụng try-catch

4. **Security**: 
   - Luôn validate input từ người dùng
   - Sử dụng helmet để bảo mật headers
   - Không expose thông tin nhạy cảm trong error messages (production)

5. **Code Organization**: 
   - Giữ logic trong controllers, không đặt trong routes
   - Tái sử dụng code bằng cách tạo utilities
   - Tách biệt concerns (routes, controllers, models)

---

## 🆘 Gặp vấn đề?

Nếu gặp lỗi khi chạy:
1. Kiểm tra đã cài đặt Node.js chưa: `node --version`
2. Kiểm tra đã chạy `npm install` chưa
3. Kiểm tra file `.env` đã được tạo chưa
4. Kiểm tra port 3000 có đang bị sử dụng bởi ứng dụng khác không

---

## 📞 Liên hệ

Nếu có câu hỏi, hãy tham khảo tài liệu hoặc tìm kiếm trên Stack Overflow.

**Chúc bạn code vui vẻ! 🎉**

