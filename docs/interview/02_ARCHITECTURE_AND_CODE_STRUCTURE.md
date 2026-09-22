# 🏗️ PHẦN 2: KIẾN TRÚC HỆ THỐNG & CẤU TRÚC SOURCE CODE

---

## 🏛️ 1. Tổng Quan Kiến Trúc Dự Án (Clean Layered Architecture)

Dự án được phân tách rõ ràng thành hai phân hệ độc lập: **Backend (Spring Boot)** và **Frontend (Next.js)**, giao tiếp với nhau thông qua **RESTful API** và xác thực bằng **JWT**.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         FRONTEND (Next.js 16)                          │
 │  [UI Page] ──► [Components] ──► [Custom Hooks] ──► [Axios API Client]  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ (HTTP JSON Request / JWT Header)
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                        BACKEND (Spring Boot 2.7)                       │
 │                                                                        │
 │   [JwtTokenFilter] ──► [Controller] ──► [Validator]                   │
 │                              │                                         │
 │                              ▼                                         │
 │                      [Service Layer] ◄──► [Mapper (MapStruct)]         │
 │                              │                                         │
 │                              ▼                                         │
 │                     [Repository Layer] (Custom Native Query)           │
 │                              │                                         │
 └──────────────────────────────┼─────────────────────────────────────────┘
                                ▼
                   ┌──────────────────────────┐
                   │  MySQL 8.0 Database      │
                   │  (user-manage Schema)    │
                   └──────────────────────────┘
```

---

## 📁 2. Chi Tiết Cấu Trúc Source Code

### 🔹 Phía Backend (`backend/src/main/java/com/luvina/la/`)

| Package / Thư mục | Vai trò và Trách nhiệm |
| :--- | :--- |
| `controller/` | **Tầng Giao tiếp:** Tiếp nhận HTTP Request từ Client, gọi Validator kiểm tra tham số, chuyển tiếp xuống Service và bọc Response payload trả về mã HTTP (200, 500...). |
| `service/` | **Tầng Nghiệp vụ cốt lõi:** Chứa các Interface và Implementation (`ServiceImpl`) xử lý toàn bộ logic nghiệp vụ, tính toán, và quản lý giao dịch database qua `@Transactional`. |
| `repository/` | **Tầng Truy xuất Dữ liệu (DAO):** Kế thừa `JpaRepository` cho các hàm CRUD cơ bản, kết hợp `EmployeeRepositoryCustomImpl` để viết các câu truy vấn SQL Native động phức tạp. |
| `entity/` | **Tầng Cơ sở dữ liệu:** Định nghĩa các JPA Entities ánh xạ 1-1 với các bảng trong MySQL (`employees`, `departments`, `certifications`, `employees_certifications`). |
| `dto/` | **Tầng Vận chuyển Dữ liệu:** Chứa các Object trung gian (`EmployeeDTO`, `EmployeeDetailDTO`) đã được làm sạch, format ngày tháng và ẩn các trường nhạy cảm. |
| `payload/` | Chứa các cấu trúc Request và Response chuyên biệt cho từng API (`EmployeeSaveRequest`, `EmployeeListResponse`, `LoginRequest`). |
| `mapper/` | Sử dụng thư viện **MapStruct** để tự động chuyển đổi dữ liệu giữa `Request $\leftrightarrow$ Entity $\leftrightarrow$ DTO` lúc Compile-time. |
| `validator/` | Chịu trách nhiệm kiểm tra tính hợp lệ của dữ liệu đầu vào (bắt lỗi `ER001` - `ER023`). |
| `exception/` | Quản lý ngoại lệ tập trung toàn hệ thống qua `@RestControllerAdvice` (`GlobalExceptionHandler`) và định nghĩa `BusinessException`. |
| `config/` | Cấu hình Spring Security, JWT Token Filter, CORS và kết nối Database. |

---

### 🔹 Phía Frontend (`frontend/`)

| Thư mục | Vai trò và Trách nhiệm |
| :--- | :--- |
| `app/` | Quản lý các màn hình và định tuyến (Routing) theo cơ chế **Next.js App Router**: Route group `(auth)` cho login và `(protected)/employees` cho ADM002 $\rightarrow$ ADM006. |
| `components/` | Các UI Components tái sử dụng (Header, Footer, SearchForm, EmployeeTable, Pagination...). |
| `hooks/` | Chứa các **Custom Hooks** (`useAdm002`, `useAdm004`, `useAdm005`...) chịu trách nhiệm quản lý toàn bộ State, logic giao diện và gọi API. **Tách biệt 100% logic khỏi UI Component**. |
| `lib/` | Cấu hình Axios Client (`client.ts`), Token Management (`token.ts`), và các Schema kiểm tra dữ liệu bằng **Zod** (`validation/`). |
| `types/` | Định nghĩa các Type và Interface TypeScript đảm bảo an toàn kiểu dữ liệu Type-safe toàn diện. |
| `public/` | Chứa các tài nguyên tĩnh (hình ảnh, icons). |

---

## 🔄 3. Luồng Hoạt Động End-to-End (Ví Dụ Màn Hình ADM002)

Khi người dùng mở màn hình Danh sách nhân viên:

```text
[1. User vào trang /employees/adm002]
         │
         ▼
[2. Page Component kích hoạt Hook: useAdm002()]
         │
         ▼
[3. Hook gọi API qua Axios Client (lib/api/employee.api.ts)]
         │ (Tự động gắn Header: Authorization: Bearer <jwt_token>)
         ▼
[4. Backend: JwtTokenFilter chặn kiểm tra Token]
         │ (Chữ ký hợp lệ -> Set Authentication vào SecurityContextHolder)
         ▼
[5. EmployeeController tiếp nhận Request]
         │ (Gọi EmployeeValidator kiểm tra tham số: offset, limit, sort)
         ▼
[6. EmployeeService điều phối xử lý]
         │
         ├── Gọi countEmployees() để đếm tổng số bản ghi (total_records)
         └── Gọi findEmployees() với câu SQL động (JOIN, WHERE, ORDER BY, LIMIT)
         ▼
[7. EmployeeRepositoryCustomImpl thực thi câu Native Query]
         │ (Map từ JPA Tuple sang List<EmployeeDTO>)
         ▼
[8. Controller đóng gói vào EmployeeListResponse (Code 200, totalRecords, employees)]
         │ (Jackson tự động chuyển đổi sang chuỗi JSON trả về qua HTTP)
         ▼
[9. Frontend Hook nhận JSON]
         │ (Cập nhật State: setEmployees, setTotalRecords, setIsLoading = false)
         ▼
[10. React render Bảng danh sách nhân viên và Thanh phân trang lên UI]
```

---

## 🗣️ 4. Kịch Bản Trình Bày Phỏng Vấn (Nói Mồm)

> *"Dạ, về kiến trúc mã nguồn của dự án, em phân tách thành hai phân hệ độc lập:*
>
> * **Phía Backend (Spring Boot):** Em xây dựng theo **Kiến trúc phân tầng (Clean Layered Architecture)**:
>   - Trục xử lý chính đi từ `Controller` (tiếp nhận HTTP Request) $\rightarrow$ `Service` (xử lý logic nghiệp vụ) $\rightarrow$ `Repository` (truy xuất DB) $\rightarrow$ và `Entity` (ánh xạ bảng MySQL).
>   - Tầng `dto` và `payload` dùng để đóng gói dữ liệu trao đổi; kết hợp với `mapper` (sử dụng MapStruct) để chuyển đổi dữ liệu an toàn.
>   - Tầng `validator` kiểm tra tính hợp lệ của dữ liệu đầu vào, và `exception` xử lý lỗi tập trung toàn hệ thống qua `@RestControllerAdvice`.
>
> * **Phía Frontend (Next.js App Router):** Em áp dụng nguyên tắc **Tách biệt giao diện và logic (Separation of Concerns)**:
>   - Giao diện được quản lý trong `app` và `components`.
>   - Toàn bộ logic nghiệp vụ, quản lý state và gọi API được đóng gói vào các **Custom Hooks** (như `useAdm002`, `useAdm004`).
>   - Tầng `lib` chứa cấu hình Axios Client và Schema validate bằng Zod.
>
> *Cách tổ chức này giúp dự án dễ đọc, dễ mở rộng, giảm thiểu phụ thuộc lẫn nhau và cực kỳ thuận tiện cho việc viết Unit Test cho từng tầng riêng biệt ạ."*
