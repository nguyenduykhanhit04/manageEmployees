# Ứng Dụng Quản Lý Nhân Viên (Manage Employees)

Hệ thống quản lý thông tin nhân viên full-stack xây dựng với **Spring Boot** (Backend) và **Next.js** (Frontend).

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### Backend
- **Java 17** & **Spring Boot 2.7.8**
- **Spring Security** với **JWT (Auth0 java-jwt 4.0.0)**
- **Spring Data JPA** & **Hibernate** (Dynamic Multi-column Sorting với Custom Native Query)
- **MySQL 8.x** kết hợp **HikariCP** và **Flyway Migration**
- **MapStruct 1.5.3** & **Lombok**
- **JUnit 5** & **Mockito**

### Frontend
- **Next.js 16 (App Router)** & **React 19**
- **TypeScript 5.x**
- **Pure CSS / Vanilla CSS**
- **React Hook Form 7.x** & **Zod 4.x**
- **Axios Client**
- **date-fns** & **react-datepicker**
- **Jest** & **React Testing Library**

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```
manageEmployees/
├── backend/                     # Mã nguồn Backend Spring Boot
│   ├── src/main/java/           # Source code Java (Controller, Service, Repository, Entity, DTO...)
│   └── src/main/resources/      # Application properties & Flyway migration scripts
├── frontend/                    # Mã nguồn Frontend Next.js (App Router)
│   ├── app/                     # Route groups: (auth) và (protected)/employees (adm002 -> adm006)
│   ├── components/              # UI Components dùng chung (Header, Footer, Pagination...)
│   ├── hooks/                   # Custom Hooks quản lý logic (useAuth, useAdm002, useEmployees...)
│   ├── lib/                     # API client (Axios), validation schemas (Zod)
│   ├── tests/                   # Unit test & Component tests (Jest)
│   └── types/                   # TypeScript Type definitions
├── docs/                        # Tài liệu thiết kế hệ thống
│   ├── api/                     # Thiết kế REST API (TKAPI_*.md)
│   ├── db/                      # Thiết kế Database Schema (TKDB.md)
│   └── guidelines/              # Quy chuẩn coding & Checklist nghiệm thu
├── PROJECT_SUMMARY.md           # Tài liệu tổng quan kiến trúc & luồng xử lý
└── README.md                    # Hướng dẫn cài đặt & khởi chạy dự án
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy Ứng Dụng

### 1. Yêu Cầu Môi Trường
- **JDK 17** trở lên
- **Node.js 18+** & **npm**
- **MySQL 8.x**

---

### 2. Khởi Chạy Backend

1. Tạo database MySQL (ví dụ: `manage_employees_db`).
2. Cấu hình thông tin kết nối trong `backend/src/main/resources/config/application-dev.yaml` (username, password, URL).
3. Mở terminal tại thư mục backend và chạy:

```bash
cd backend

# Build và chạy ứng dụng Spring Boot
./mvnw spring-boot:run
```
*(Trên Windows PowerShell có thể chạy `.\mvnw.cmd spring-boot:run`)*

👉 Backend API sẽ hoạt động tại: `http://localhost:8080`

---

### 3. Khởi Chạy Frontend

Mở terminal mới tại thư mục frontend:

```bash
cd frontend

# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy Development Server
npm run dev
```

👉 Web Application sẽ hoạt động tại: `http://localhost:3000`

---

### 4. Chạy Test

- **Backend Tests:**
  ```bash
  cd backend
  ./mvnw test
  ```
- **Frontend Tests:**
  ```bash
  cd frontend
  npm test
  ```

---

## 🔐 Tài Khoản Mặc Định (Default Credentials)

- **Username / Login ID**: `admin`
- **Password**: `Admin@123456`

---

## 📱 Danh Sách Màn Hình (Screens)

| Mã màn hình | Route URL | Chức năng |
| :--- | :--- | :--- |
| **ADM001** | `/login` | Đăng nhập hệ thống |
| **ADM002** | `/employees/adm002` | Danh sách nhân viên (Tìm kiếm, Sắp xếp đa cột, Phân trang) |
| **ADM003** | `/employees/adm003` | Thêm mới / Chỉnh sửa thông tin nhân viên |
| **ADM004** | `/employees/adm004` | Xác nhận thông tin trước khi lưu |
| **ADM005** | `/employees/adm005` | Thông báo hoàn tất thêm/sửa/xóa |
| **ADM006** | `/employees/adm006` | Xem chi tiết thông tin nhân viên & chứng chỉ |

---

## 📖 Tài Liệu Tham Khảo

- Chi tiết kiến trúc và luồng xử lý: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- Đặc tả API và Database: Thư mục [docs/](./docs/)
- Quy chuẩn coding và checklist: [docs/guidelines/ManageUser_Checklist.md](./docs/guidelines/ManageUser_Checklist.md)
