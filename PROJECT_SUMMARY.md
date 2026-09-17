# TỔNG QUAN DỰ ÁN QUẢN LÝ NHÂN VIÊN (MANAGE EMPLOYEES)

Tài liệu tổng hợp kiến trúc hệ thống, cấu trúc thư mục, danh mục màn hình, luồng nghiệp vụ và quy chuẩn kỹ thuật toàn diện của dự án Quản lý nhân viên (**Manage Employees**).

---

## 1. Tổng Quan Kiến Trúc (Architecture Overview)

Dự án được xây dựng theo mô hình **Client - Server (Decoupled Frontend & Backend)** độc lập:

- **Backend**: **Java 17**, **Spring Boot 2.7.8**, **Spring Security** (Stateless JWT Authentication với Auth0 `java-jwt`), **Spring Data JPA & Hibernate** (kết hợp `EntityManager` Native SQL Dynamic Multi-column Sorting & Vietnamese/Japanese collation), **MapStruct**, **Lombok**, **Flyway Database Migration**, **HikariCP Connection Pool**, **MySQL 8.x**.
- **Frontend**: **Next.js 16 (App Router)**, **React 19**, **TypeScript 5.7+**, Pure CSS (`globals.css`), **React Hook Form**, **Zod** validation, **Axios** API Client với Interceptors, **Jest & React Testing Library**.

```text
                    ┌──────────────────────────────────────────────────┐
                    │               Frontend (Next.js 16)              │
                    │   App Router + TypeScript + Zod/React-Hook-Form  │
                    └─────────────────────────┬────────────────────────┘
                                              │ HTTP REST (JSON)
                                              │ Authorization: Bearer <JWT>
                                              ▼
                    ┌──────────────────────────────────────────────────┐
                    │             Backend (Spring Boot)                │
                    │  Controller -> Service -> Repository (Custom)   │
                    └─────────────────────────┬────────────────────────┘
                                              │ Spring Data JPA / Flyway
                                              ▼
                    ┌──────────────────────────────────────────────────┐
                    │                 MySQL 8 Database                 │
                    │   (employees, departments, certifications...)    │
                    └──────────────────────────────────────────────────┘
```

---

## 2. Cấu Trúc Tài Liệu Thiết Kế & Hướng Dẫn Kỹ Thuật

| Tài liệu | Đường dẫn tập tin | Mô tả nội dung |
| :--- | :--- | :--- |
| **Phân tích chi tiết Backend** | [BACKEND_ANALYSIS.md](file:///d:/Project/manageEmployees/BACKEND_ANALYSIS.md) | Tài liệu kiến trúc chuyên sâu, deep-dive 23 câu hỏi Spring Boot, Native SQL, HikariCP, Security & Test |
| **Phân tích chi tiết Frontend** | [FRONTEND_ANALYSIS.md](file:///d:/Project/manageEmployees/FRONTEND_ANALYSIS.md) | Tài liệu kiến trúc chuyên sâu Next.js App Router, Zod, React Hook Form, Custom Hooks, State & Test |
| **Frontend README** | [frontend/README.md](file:///d:/Project/manageEmployees/frontend/README.md) | Hướng dẫn cài đặt, cấu hình, chạy dev, build production & kiểm thử Unit Test Frontend |
| **WIKI Mã Lỗi & Thông Báo** | [docs/ERROR_CODES_WIKI.md](file:///d:/Project/manageEmployees/docs/ERROR_CODES_WIKI.md) | Toàn bộ mã lỗi `ER001-ER023`, thông báo `MSG001-MSG005` và nhãn trường Nhật ngữ |
| **Quy chuẩn Lập trình** | [ManageUser_Checklist.md](file:///d:/Project/manageEmployees/docs/guidelines/ManageUser_Checklist.md) | Checklist nghiệm thu coding rule Java (Javadoc 100%, 3-tier) và Next.js (SoC, Custom Hooks) |
| **Thiết kế Database (TKDB)** | [TKDB.md](file:///d:/Project/manageEmployees/docs/db/TKDB.md) | Thiết kế 4 bảng (`employees`, `departments`, `certifications`, `employees_certifications`) |
| **Thiết kế API (TKAPI)** | [docs/api/](file:///d:/Project/manageEmployees/docs/api/) | Toàn bộ tài liệu đặc tả 7 API: Danh sách, Thêm, Sửa, Xóa, Chi tiết, Phòng ban, Chứng chỉ |

---

## 3. Danh Sách Màn Hình & Luồng Nghiệp Vụ (Screens & Workflows)

### 3.1. Danh Sách Màn Hình (Screens)

| Mã | Tên Màn Hình | Route URL | Vai Trò Nghiệp Vụ |
| :---: | :--- | :--- | :--- |
| **ADM001** | Đăng nhập (Login) | `/login` | Xác thực tài khoản quản trị, cấp phát và lưu trữ JWT Token |
| **LOGOUT** | Đăng xuất (Logout) | `/logout` | Xóa sạch Access Token trong Local/Session Storage và điều hướng về Login |
| **ADM002** | Danh sách nhân viên (List) | `/employees/adm002` | Tìm kiếm theo tên & phòng ban, sắp xếp đa cột ưu tiên, phân trang, đồng bộ URL Search Params |
| **ADM003** | Chi tiết nhân viên (Detail) | `/employees/adm003` | Xem chi tiết thông tin nhân viên & chứng chỉ, Modal xóa xác nhận, Modal lỗi hệ thống |
| **ADM004** | Thêm mới / Sửa nhân viên (Form) | `/employees/adm004` | Form nhập liệu (Mode Add: mật khẩu bắt buộc; Mode Edit: mật khẩu tùy chọn), Tab focus loop, Datepicker |
| **ADM005** | Xác nhận thông tin (Confirm) | `/employees/adm005` | Xem lại dữ liệu trước khi commit DB, khôi phục data từ `sessionStorage`, phòng chống Double Submit |
| **ADM006** | Hoàn tất thao tác (Complete) | `/employees/adm006` | Hiển thị thông báo hoàn tất (`MSG001`/`MSG002`/`MSG003`), quay về ADM002 giữ nguyên bộ lọc |

### 3.2. Sơ Đồ Điều Hướng Màn Hình (Screen Flow)

```text
[ ADM001: Đăng nhập (/login) ]
              │
              ▼
[ ADM002: Danh sách nhân viên (/employees/adm002) ]
       │                                     │
       │ (Bấm 新規追加 - Add New)             │ (Click Tên nhân viên)
       ▼                                     ▼
[ ADM004: Thêm mới (mode=add) ]       [ ADM003: Chi tiết nhân viên (/employees/adm003) ]
       │                                     │
       │                                     │ (Bấm 編集 - Edit)
       │                                     ▼
       └─────────────────────────────> [ ADM004: Chỉnh sửa (mode=edit) ]
                                             │
                                             │ (Bấm 確認 - Confirm)
                                             ▼
                                [ ADM005: Xác nhận thông tin (/employees/adm005) ]
                                             │
                                             │ (Bấm OK - Gửi API POST/PUT/DELETE)
                                             ▼
                                [ ADM006: Hoàn tất thao tác (/employees/adm006) ]
                                             │
                                             │ (Bấm OK)
                                             ▼
                                [ Trở về ADM002: Bảo lưu bộ lọc & Phân trang cũ ]
```

---

## 4. Cấu Trúc Mã Nguồn Dự Án (Source Code Structure)

### 4.1. Backend (`backend/src/main/java/com/luvina/la`)
Tuân thủ nghiêm ngặt mô hình **5-Tier Layered Architecture**:

```text
com.luvina.la
├── config/                  # Cấu hình Security, CORS, WebMvc, JWT, Constants (ER001-ER023, Regex, Limit)
│   └── jwt/                 # JwtTokenFilter, JwtTokenProvider (HMAC-512), AuthEntryPoint
├── controller/              # REST Controllers (AuthController, EmployeeController, DepartmentController, CertificationController)
├── validator/               # Tầng kiểm tra nghiệp vụ độc lập (EmployeeValidator - DRY helpers, No Magic Numbers)
├── service/                 # Tầng nghiệp vụ (Service Interfaces)
│   └── impl/                # Service Implementations (@Service, @Transactional rollbackFor = Exception.class)
├── repository/              # Tầng truy xuất dữ liệu Spring Data JPA
│   ├── EmployeeRepository.java
│   ├── EmployeeRepositoryCustom.java
│   ├── EmployeesCertificationRepository.java # JpaRepository hỗ trợ flush & transaction sync
│   └── impl/
│       └── EmployeeRepositoryCustomImpl.java  # Native SQL động (Sắp xếp đa cột ưu tiên, collate tiếng Việt/Nhật, tie-breaker)
├── entity/                  # JPA Entities (EmployeeEntity, DepartmentEntity, CertificationEntity, EmployeesCertificationEntity)
├── dto/                     # Data Transfer Objects (EmployeeDTO, DepartmentDTO, CertificationDTO...)
├── payload/                 # Request/Response payloads (EmployeeSaveRequest, EmployeeListResponse, ApiResponse...)
├── mapper/                  # MapStruct Mappers (Compile-time mapping giữa Entity và DTO)
└── exception/               # GlobalExceptionHandler (@RestControllerAdvice), BusinessException
```

### 4.2. Frontend (`frontend/`)
Tuân thủ nghiêm ngặt nguyên tắc **Separation of Concerns (SoC)**:

```text
frontend/
├── app/
│   ├── (auth)/                    # Route Group công khai: login, logout
│   ├── (protected)/employees/     # Route Group bảo vệ: adm002, adm003, adm004, adm005, adm006
│   ├── globals.css                # Toàn bộ CSS thuần và Design System Token
│   └── layout.tsx                 # Root layout tự động điều kiện Header/Footer
├── components/                    # UI Presentation Components
│   ├── auth/                      # LoginForm.tsx
│   ├── common/                    # Button, Input, Select, DatePicker, Modal, Header, Footer, Pagination...
│   └── employees/                 # Adm002, Adm003, Adm004, Adm005, Adm006, EmployeeTable, EmployeeSearchForm...
├── hooks/                         # Custom React Hooks đóng gói 100% Business Logic
│   ├── useAdm002.ts               # Search, multi-sort, pagination, URL Search Params sync
│   ├── useAdm003.ts               # Chi tiết nhân viên, modal xác nhận xóa, modal lỗi hệ thống
│   ├── useAdm004.ts               # Form lifecycle, restore sessionStorage, tab trap, check exist
│   ├── useAdm005.ts               # Review data, API submit, double submit guard
│   ├── useAdm006.ts               # Hiển thị thông báo MSG001-MSG003, điều hướng về returnTo
│   ├── useAuth.ts                 # Route guards useAuth & useGuest
│   ├── useDepartments.ts          # Master Data phòng ban
│   └── useCertifications.ts       # Master Data chứng chỉ tiếng Nhật
├── lib/
│   ├── api/                       # API HTTP Services (client.ts, employee.api.ts, department.api.ts, certification.api.ts)
│   ├── auth/                      # Token storage & expiration check (token.ts)
│   ├── constants/                 # Constants phân tách (routes.ts, http.ts, table.ts, messages.ts, validation.ts)
│   ├── utils/                     # format.ts, messageHelper.ts (formatErrorMessage)
│   └── validation/                # Zod schemas (auth.ts, employee.ts)
├── types/                         # TypeScript interfaces & types (api, auth, department, certification, employee)
└── tests/                         # Unit tests Jest & React Testing Library (__tests__/)
```

---

## 5. Quy Chuẩn Kỹ Thuật Bắt Buộc (Coding Standards)

1. **Java Spring Boot Backend**:
   - 100% Class, Interface, Method, Field (public/protected) phải có Javadoc chuẩn format (`@author`, `@param`, `@return`, `@throws`).
   - Controller không được gọi trực tiếp Repository, bắt buộc qua Service Interface.
   - Sắp xếp đa cột động (Dynamic Multi-column Sorting) kết hợp Tie-breaker (`e.employee_id asc`) để bảo đảm phân trang tất định (Deterministic Pagination).
   - Định dạng mã lỗi thống nhất theo chuẩn tài liệu đặc tả: `{ "code": 500, "message": { "code": "ERxxx", "params": [...] } }`.

2. **Next.js Frontend**:
   - Tách biệt hoàn toàn giao diện và logic: `Page Route Entry Point` $\rightarrow$ `UI View Component` $\rightarrow$ `Custom Hook` $\rightarrow$ `API Service`.
   - Validate dữ liệu hai đầu: Frontend dùng Zod Schema + React Hook Form, Backend dùng Validator nghiệp vụ ném `BusinessException`.
   - Đảm bảo Type Safety tuyệt đối (không sử dụng kiểu `any`).
   - Xử lý Modal Lỗi Hệ Thống chuẩn mực với duy nhất 1 nút `[OK]` điều hướng an toàn về ADM002.

---

## 6. Hướng Dẫn Khởi Chạy Nhanh (Quick Start)

### 6.1 Khởi động Database (Docker)
```bash
# Tại thư mục gốc manageEmployees:
docker compose up -d
```
*(Khởi chạy MySQL 8.0 tại cổng `3306` & Adminer Web UI tại `http://localhost:8080`)*

### 6.2 Khởi chạy Backend API
```bash
cd backend
./mvnw spring-boot:run
```
*(Backend hoạt động tại: `http://localhost:8085`)*

### 6.3 Khởi chạy Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
*(Frontend hoạt động tại: `http://localhost:3000`)*

### 6.4 Chạy Kiểm Thử Tự Động (Unit Tests)
- **Backend Tests:** `cd backend && ./mvnw test`
- **Frontend Tests:** `cd frontend && npm test`
