# TỔNG QUAN DỰ ÁN QUẢN LÝ NHÂN VIÊN (MANAGE EMPLOYEES)

Tài liệu tổng hợp kiến trúc hệ thống, luồng hoạt động, cấu trúc thư mục và tài liệu thiết kế của dự án Quản lý nhân viên.

---

## 1. Tổng quan Kiến Trúc (Architecture Overview)

Dự án được xây dựng theo mô hình **Client - Server (Decoupled Frontend & Backend)**:
- **Backend**: Java 17+, **Spring Boot 3.x**, Spring Security (Stateless JWT Authentication), Spring Data JPA / Hibernate, MapStruct, Lombok, MySQL Database.
- **Frontend**: **Next.js** (App Router, TypeScript), Tailwind CSS, React Hook Form, Zod, Axios.

```
                    ┌────────────────────────────────────────┐
                    │          Frontend (Next.js)            │
                    │   App Router + TypeScript + Zod/RHF    │
                    └──────────────────┬─────────────────────┘
                                       │ HTTP REST (JSON)
                                       │ Bearer JWT Token
                                       ▼
                    ┌────────────────────────────────────────┐
                    │        Backend (Spring Boot)           │
                    │  Controller -> Service -> Repository   │
                    └──────────────────┬─────────────────────┘
                                       │ Spring Data JPA
                                       ▼
                    ┌────────────────────────────────────────┐
                    │            MySQL Database              │
                    │  (Managed by Flyway/SQL Migrations)    │
                    └────────────────────────────────────────┘
```

---

## 2. Cấu Trúc Tài Liệu Thiết Kế (`docs/`)

Toàn bộ tài liệu kỹ thuật và quy chuẩn phát triển được lưu trữ có cấu trúc trong thư mục `docs/`:

| Thư mục / File | Mô tả nội dung |
| :--- | :--- |
| **`docs/api/`** | **Tài liệu thiết kế chi tiết các REST API** |
| ├── `TKAPI_ListEmployee.md` | API Tìm kiếm & phân trang danh sách nhân viên (`GET /employee`) |
| ├── `TKAPI_AddEmployee.md` | API Thêm mới nhân viên (`POST /employee`) — Dùng cho màn hình ADM003 |
| ├── `TKAPI_GetEmployee.md` | API Lấy chi tiết nhân viên (`GET /employee/{id}`) |
| ├── `TKAPI_UpdateEmployee.md` | API Cập nhật nhân viên (`PUT /employee/{id}`) |
| ├── `TKAPI_DeleteEmployee.md` | API Xóa nhân viên (`DELETE /employee/{id}`) |
| ├── `TKAPI_ListDepartments.md` | API Lấy danh sách phòng ban cho dropdown (`GET /departments`) |
| └── `TKAPI_ListCertifications.md` | API Lấy danh sách chứng chỉ tiếng Nhật cho dropdown (`GET /certifications`) |
| **`docs/db/`** | **Tài liệu thiết kế Database** |
| └── `TKDB.md` | Chi tiết cấu trúc các bảng (`employees`, `departments`, `certifications`, `employees_certifications`) |
| **`docs/guidelines/`** | **Quy chuẩn lập trình & Checklist nghiệm thu** |
| └── `ManageUser_Checklist.md` | Coding rules Java (Javadoc, 3-tier), Next.js (Custom Hooks, Zod, SoC) & Checklist |

---

## 3. Luồng Hoạt Động Cốt Lõi (Core Workflows)

### 3.1. Luồng Xác Thực (Login / Logout / JWT Filter)
- **Login**: `POST /login` $\rightarrow$ `AuthController` xác thực qua `AuthenticationManager` $\rightarrow$ Trả về JWT Access Token.
- **JWT Filter**: `JwtTokenFilter` giải mã Token từ Header `Authorization: Bearer <token>`, nạp thông tin người dùng vào `SecurityContextHolder`.
- **Logout**: Phía Client xóa Token khỏi Local Storage/Cookies và chuyển hướng về màn hình `/login`.

### 3.2. Luồng Màn Hình Nghiệp Vụ Nhân Viên

```
[ ADM001: Đăng nhập (/login) ]
             │
             ▼
[ ADM002: Danh sách nhân viên (/employees/adm002) ]
      │               │                      │
      │ (Nút Thêm)   │ (Click Tên)          │ (Nút Sửa/Xóa)
      ▼               ▼                      ▼
[ ADM003: Thêm mới ] [ ADM006: Chi tiết ]   [ Chỉnh sửa / Xóa ]
      │ (Xác nhận)
      ▼
[ ADM004: Xác nhận (/employees/confirm) ]
      │ (Lưu / OK)
      ▼
[ ADM005: Hoàn thành (/employees/complete) ] ──> Quay về ADM002
```

---

## 4. Cấu Trúc Mã Nguồn Dự Án

### 4.1. Backend (`backend/src/main/java/com/luvina/la`)

Áp dụng nghiêm ngặt mô hình **3-Tier Layered Architecture**:

```
com.luvina.la
├── config/                  # Cấu hình hệ thống (CORS, Security, JWT Filter, Constants)
├── controller/              # REST Controllers (AuthController, EmployeeController, DepartmentController)
├── service/                 # Tầng nghiệp vụ (Business Service Interfaces)
│   └── impl/                # Service Implementations (@Service, @Transactional)
├── repository/              # Tầng truy xuất dữ liệu Spring Data JPA
├── entity/                  # JPA Entities ánh xạ bảng Database
├── dto/                     # Data Transfer Objects
├── payload/                 # Request/Response payloads
├── mapper/                  # MapStruct Mappers chuyển đổi Entity <-> DTO
└── exception/               # Xử lý lỗi toàn cục (GlobalExceptionHandler, BusinessException)
```

### 4.2. Frontend (`frontend/`)

```
frontend/
├── app/
│   ├── (auth)/login/        # Màn hình Đăng nhập (ADM001)
│   └── (protected)/         # Nhóm route yêu cầu xác thực
│       └── employees/
│           ├── adm002/      # Màn hình Danh sách nhân viên (ADM002)
│           ├── edit/        # Màn hình Thêm mới/Chỉnh sửa nhân viên (ADM003)
│           ├── confirm/     # Màn hình Xác nhận thông tin (ADM004)
│           ├── complete/    # Màn hình Thông báo hoàn tất (ADM005)
│           └── detail/      # Màn hình Chi tiết nhân viên (ADM006)
├── components/              # UI Components dùng chung (Header, Footer, Layout)
├── hooks/                   # Custom Hooks quản lý logic (useAuth, useEmployee...)
├── lib/
│   ├── api/                 # Tầng gọi API qua Axios client (employee.ts, department.ts...)
│   └── validation/          # Schema validate form với Zod
└── types/                   # TypeScript interfaces & types định nghĩa dữ liệu
```

---

## 5. Quy Chuẩn Kỹ Thuật Bắt Buộc (Coding Standards)

1. **Java Backend**:
   - Tất cả các file và method phải có Javadoc đầy đủ theo chuẩn `docs/guidelines/ManageUser_Checklist.md`.
   - Controller không gọi trực tiếp Repository, phải thông qua Service Interface.
   - Định dạng mã lỗi thống nhất: `{ "code": 500, "message": { "code": "ERxxx", "params": [...] } }`.
2. **Next.js Frontend**:
   - Tách biệt hoàn toàn UI và Logic: Component $\rightarrow$ Custom Hook $\rightarrow$ API Service.
   - Không gọi axios/fetch trực tiếp bên trong component giao diện.
   - Form xử lý bằng React Hook Form kết hợp Zod schema validation.
   - Đảm bảo Type Safety (không sử dụng kiểu `any`).
