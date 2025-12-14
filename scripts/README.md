# 📝 Scripts Hướng Dẫn

## 🎯 Seed Data Script

Script này tạo dữ liệu mock (test data) cho tất cả các collections trong MongoDB.

### Cách sử dụng:

```bash
npm run seed
```

### Chức năng:

- ✅ Kết nối MongoDB
- 🗑️ Xóa dữ liệu cũ (nếu có)
- 📝 Tạo dữ liệu mock cho:
  - **Users**: 4 users (1 admin, 3 users)
  - **Products**: 3 products
  - **Powerful**: 3 items
  - **Features**: 3 features
  - **Benefits**: 3 benefits
  - **FreeTools**: 3 free tools
  - **HungtingTiers**: 4 tiers (Bronze, Silver, Gold, Platinum)

### Lưu ý:

- Script sẽ **xóa tất cả dữ liệu cũ** trước khi tạo mới
- Đảm bảo MongoDB đang chạy và `MONGO_URI` trong `.env` đúng
- Passwords của users sẽ được hash tự động bởi User model

### Users mặc định:

- `admin` / `admin123` (role: admin)
- `user1` / `user123` (role: user)
- `user2` / `user123` (role: user)
- `testuser` / `test123` (role: user)

---

## 👀 View Data Script

Script này hiển thị thống kê và mẫu dữ liệu đã seed.

### Cách sử dụng:

```bash
npm run view-data
```

### Chức năng:

- ✅ Kết nối MongoDB
- 📊 Hiển thị số lượng documents trong mỗi collection
- 👀 Hiển thị mẫu dữ liệu từ một số collections

---

## ⚠️ Lưu ý quan trọng:

1. **Backup dữ liệu** trước khi chạy seed nếu bạn có dữ liệu quan trọng
2. Script seed sẽ **xóa tất cả dữ liệu cũ** trong các collections
3. Đảm bảo file `.env` có `MONGO_URI` đúng

