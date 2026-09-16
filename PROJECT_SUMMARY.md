# TỔNG QUAN DỰ ÁN QUẢN LÝ NHÂN VIÊN (MANAGE EMPLOYEES)

Tài liệu tổng hợp kiến trúc hệ thống, cấu trúc thư mục, luồng nghiệp vụ và quy chuẩn kỹ thuật của dự án Quản lý nhân viên.

---

## 1. Tổng Quan Kiến Trúc (Architecture Overview)

Dự án được xây dựng theo mô hình **Client - Server (Decoupled Frontend & Backend)**:

- **Backend**: **Java 17**, **Spring Boot 2.7.x**, Spring Security (Stateless JWT Authentication với Auth0 java-jwt), Spring Data JPA / Hibernate (hỗ trợ Dynamic Multi-column Sorting với Custom Repository), MapStruct, Lombok, Flyway Migration, MySQL 8.x Database.
- **Frontend**: **Next.js 16 (App Router)**, **React 19**, **TypeScript**, Pure CSS (`globals.css`), React Hook Form, Zod validation, Axios API Client, Jest & React Testing Library.

```
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

## 2. Cấu Trúc Tài Liệu Thiết Kế (`docs/`)

Toàn bộ tài liệu kỹ thuật, đặc tả API và quy chuẩn được lưu trữ trong thư mục `docs/`:

| Thư mục / File | Mô tả nội dung |
| :--- | :--- |
| **`docs/api/`** | **Tài liệu thiết kế chi tiết các REST API** |
| ├── `TKAPI_ListEmployee.md` | API Tìm kiếm, lọc & phân trang danh sách nhân viên (`GET /employee`) |
| ├── `TKAPI_AddEmployee.md` | API Thêm mới nhân viên (`POST /employee`) — Màn hình ADM004 |
| ├── `TKAPI_GetEmployee.md` | API Lấy chi tiết nhân viên theo ID (`GET /employee/{id}`) — Màn hình ADM003 |
| ├── `TKAPI_UpdateEmployee.md` | API Cập nhật thông tin nhân viên (`PUT /employee/{id}`) — Màn hình ADM004 |
| ├── `TKAPI_DeleteEmployee.md` | API Xóa nhân viên (`DELETE /employee/{id}`) |
| ├── `TKAPI_ListDepartments.md` | API Lấy danh sách phòng ban cho dropdown (`GET /departments`) |
| └── `TKAPI_ListCertifications.md` | API Lấy danh sách trình độ chứng chỉ tiếng Nhật (`GET /certifications`) |
| **`docs/db/`** | **Tài liệu thiết kế Database** |
| └── `TKDB.md` | Cấu trúc các bảng (`employees`, `departments`, `certifications`, `employees_certifications`) |
| **`docs/ERROR_CODES_WIKI.md`** | **WIKI toàn bộ hệ thống mã lỗi (`ER001-ER023`), thông báo thành công & nhãn trường** |
| **`docs/guidelines/`** | **Quy chuẩn lập trình & Checklist nghiệm thu** |
| └── `ManageUser_Checklist.md` | Coding rules Java (Javadoc 100%, 3-tier), Next.js (Custom Hooks, Zod, SoC) & Checklist |

---

## 3. Luồng Hoạt Động Cốt Lõi (Core Workflows)

### 3.1. Luồng Xác Thực (Authentication Flow)
- **Đăng nhập (`POST /login`)**: Nhận `loginId` & `password` $\rightarrow$ Xác thực qua `AuthenticationManager` $\rightarrow$ Trả về JWT Access Token.
- **JWT Filter (`JwtTokenFilter`)**: Đọc token từ header `Authorization: Bearer <token>`, giải mã và thiết lập `SecurityContextHolder`.
- **Đăng xuất**: Phía Client xóa Token khỏi Cookie/Storage và điều hướng về `/login`.

### 3.2. Sơ Đồ Điều Hướng Màn Hình (Screen Flow)

```
[ ADM001: Đăng nhập (/login) ]
              │
              ▼
[ ADM002: Danh sách nhân viên (/employees/adm002) ]
       │                                     │
       │ (Bấm 新規追加)                     │ (Click Tên nhân viên)
       ▼                                     ▼
[ ADM004: Thêm mới (mode=add) ]       [ ADM003: Chi tiết nhân viên (/employees/adm003) ]
       │                                     │
       │                                     │ (Bấm 編集)
       │                                     ▼
       └─────────────────────────────> [ ADM004: Chỉnh sửa (mode=edit) ]
                                             │
                                             │ (Bấm 確認)
                                             ▼
                               [ ADM005: Xác nhận thông tin (/employees/adm005) ]
                                             │
                                             │ (Bấm OK - Lưu vào DB)
                                             ▼
                               [ ADM006: Hoàn tất thao tác (/employees/adm006) ]
                                             │
                                             │ (Bấm OK)
                                             ▼
                               [ Trở về ADM002: Danh sách nhân viên ]
```

---

## 4. Cấu Trúc Mã Nguồn Dự Án

### 4.1. Backend (`backend/src/main/java/com/luvina/la`)
Tuân thủ nghiêm ngặt mô hình **3-Tier Layered Architecture**:

```
com.luvina.la
├── config/                  # Cấu hình CORS, Security, WebMvc, JWT, Constants (ER001 - ER023)
├── controller/              # REST Controllers (AuthController, EmployeeController, DepartmentController, CertificationController)
├── service/                 # Tầng nghiệp vụ (Service Interfaces)
│   └── impl/                # Service Implementations (@Service, @Transactional)
├── validator/               # Tầng kiểm tra nghiệp vụ độc lập (EmployeeValidator - Clean Code, No Magic Numbers, DRY helpers)
├── repository/              # Tầng truy xuất dữ liệu Spring Data JPA
│   ├── EmployeeRepository.java
│   ├── EmployeeRepositoryCustom.java
│   ├── EmployeesCertificationRepository.java # JpaRepository hỗ trợ flush & transaction sync
│   └── impl/
│       └── EmployeeRepositoryCustomImpl.java  # Custom Native Query (sắp xếp đa cột, collate tiếng Nhật/Việt, DTO projection)
├── entity/                  # JPA Entities (EmployeeEntity, DepartmentEntity, CertificationEntity, EmployeeCertificationEntity)
├── dto/                     # Data Transfer Objects
├── payload/                 # Request/Response payloads (EmployeeRequest, EmployeeResponse, EmployeeDetailResponse...)
├── mapper/                  # MapStruct Mappers chuyển đổi giữa Entity và DTO
└── exception/               # GlobalExceptionHandler, Custom Exceptions, ErrorResponse
```

### 4.2. Frontend (`frontend/`)
Tuân thủ nghiêm ngặt nguyên tắc **Separation of Concerns (SoC)** (Page chỉ là Route Entry Point bọc `<Suspense>`, UI View tách thành Components, Logic chuyển vào Custom Hooks, Constants phân tách theo công năng):

```
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/                 # ADM001: Màn hình Đăng nhập (Page Route Entry Point)
│   ├── (protected)/
│   │   └── employees/
│   │       ├── adm002/            # ADM002: Danh sách nhân viên (Page Route Entry Point)
│   │       ├── adm003/            # ADM003: Chi tiết nhân viên (Page Route Entry Point)
│   │       ├── adm004/            # ADM004: Thêm mới / Chỉnh sửa nhân viên (Page Route Entry Point)
│   │       ├── adm005/            # ADM005: Xác nhận thông tin (Page Route Entry Point)
│   │       └── adm006/            # ADM006: Thông báo hoàn tất (Page Route Entry Point)
│   ├── globals.css                # Style toàn cục & Design System
│   └── layout.tsx                 # Root layout
├── components/                    # UI Presentation Components
│   ├── auth/                      # LoginForm...
│   ├── common/                    # Button, Input, Select, DatePicker, Modal, Header, Footer, Pagination...
│   └── employees/                 # Adm002, Adm003, Adm004, Adm005, Adm006, EmployeeTable, EmployeeSearchForm...
├── hooks/                         # Custom React Hooks (useAuth, useAdm002, useAdm003, useAdm004, useAdm005, useAdm006...)
├── lib/
│   ├── api/                       # API Services (employee.ts, department.ts, certification.ts, auth.ts, client.ts)
│   ├── constants/                 # Constants phân tách (routes.ts, http.ts, table.ts, messages.ts, validation.ts)
│   └── validation/                # Zod schemas validate form (No Magic Numbers, DRY shared validation)
├── tests/                         # Unit tests & Integration tests (Jest & Testing Library)
└── types/                         # TypeScript interfaces & types định nghĩa dữ liệu
```

---

## 5. Quy Chuẩn Kỹ Thuật Bắt Buộc (Coding Standards)

1. **Java Backend**:
   - 100% Class, Interface, Method, Field (public/protected) phải có Javadoc chuẩn format.
   - Controller không được gọi trực tiếp Repository, bắt buộc qua Service Interface.
   - Xử lý sắp xếp đa cột (Dynamic Multi-column Sorting) kết hợp Tie-breaker (`employee_id asc`) để bảo đảm phân trang ổn định.
   - Định dạng mã lỗi thống nhất theo chuẩn tài liệu đặc tả: `{ "code": 500, "message": { "code": "ERxxx", "params": [...] } }`.

2. **Next.js Frontend**:
   - Tách biệt hoàn toàn giao diện và logic: `Page/Component` $\rightarrow$ `Custom Hook` $\rightarrow$ `API Service`.
   - Validate dữ liệu hai đầu: Frontend dùng Zod Schema + React Hook Form, Backend dùng Bean Validation (`@Valid`).
   - Đảm bảo Type Safety tuyệt đối (không sử dụng kiểu `any`).
