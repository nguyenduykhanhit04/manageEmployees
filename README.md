# Ứng Dụng Quản Lý Nhân Viên (Manage Employees)

Hệ thống quản lý thông tin nhân viên full-stack xây dựng với **Spring Boot** và **Next.js**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### Backend
- **Java 17+** & **Spring Boot 3.x**
- **Spring Security** với **JWT (JSON Web Token)**
- **Spring Data JPA** & **Hibernate**
- **MySQL 8.x** (Quản lý migration qua Flyway/SQL scripts)
- **MapStruct** & **Lombok**
- **JUnit 5** & **Mockito**

### Frontend
- **Next.js** (App Router, TypeScript)
- **Tailwind CSS**
- **React Hook Form** & **Zod**
- **Axios Client**
- **Jest** & **React Testing Library**

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```
manageEmployees/
├── backend/                     # Mã nguồn Backend Spring Boot
│   ├── src/main/java/           # Source code Java (Controller, Service, Repository, Entity...)
│   └── src/main/resources/      # Cấu hình application.yaml & SQL migration
├── frontend/                    # Mã nguồn Frontend Next.js
│   ├── app/                     # Next.js App Router (auth & protected routes)
│   ├── components/              # Reusable UI Components
│   ├── hooks/                   # Custom React Hooks
│   ├── lib/                     # API client, validation schemas, utilities
│   └── types/                   # TypeScript interfaces & types
├── docs/                        # Toàn bộ tài liệu thiết kế dự án
│   ├── api/                     # Tài liệu thiết kế REST API (TKAPI_*.md)
│   ├── db/                      # Tài liệu thiết kế Database (TKDB.md)
│   └── guidelines/              # Quy chuẩn coding & Checklist nghiệm thu
├── .agents/                     # Antigravity/AI Skills và rules
├── PROJECT_SUMMARY.md           # Tài liệu tóm tắt kiến trúc & luồng hoạt động
└── README.md                    # Hướng dẫn chạy dự án
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu Cầu Môi Trường
- **JDK 17** trở lên
- **Node.js 18+** & **npm**
- **MySQL 8.x**

### 2. Khởi Chạy Backend
```bash
cd backend

# Cấu hình thông tin database trong:
# src/main/resources/config/application-dev.yaml

# Build & Chạy Spring Boot
./mvnw spring-boot:run
```
Backend API sẽ chạy tại: `http://localhost:8080`

### 3. Khởi Chạy Frontend
```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy server development
npm run dev
```
Frontend Web App sẽ chạy tại: `http://localhost:3000`

---

## 🔐 Tài Khoản Mặc Định (Default Credentials)

- **Username / Login ID**: `admin`
- **Password**: `Admin@123456`

---

## 📖 Tài Liệu Tham Khảo

- Xem chi tiết kiến trúc và luồng xử lý tại [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- Xem tài liệu thiết kế API và Database tại thư mục [docs/](./docs/)
- Xem quy chuẩn viết mã nguồn tại [docs/guidelines/ManageUser_Checklist.md](./docs/guidelines/ManageUser_Checklist.md)
