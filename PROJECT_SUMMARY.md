# TÓM TẮT DỰ ÁN QUẢN LÝ NHÂN VIÊN (MANAGE EMPLOYEES)

Document tóm tắt luồng hoạt động hiện tại, cấu trúc dự án và giải thích định hướng thiết kế kiến trúc Backend & Frontend.

---

## 1. Tổng quan Kiến Trúc (Architecture Overview)

Dự án được xây dựng theo mô hình **Client - Server (Decoupled Frontend & Backend)**:
- **Backend**: Java 17+, **Spring Boot**, Spring Security (Stateless JWT Authentication), Spring Data JPA / Hibernate, MapStruct, Lombok, MySQL Database.
- **Frontend**: **Next.js** (App Router, TypeScript), Tailwind CSS, React Context / Custom Hooks, Axios / Fetch API.

---

## 2. Luồng Hoạt Động Hiện Tại (Current Workflow)

Hiện tại dự án đã hoàn tất luồng **Đăng nhập (Login), Đăng xuất (Logout) & Xác thực JWT**.

```
[ Frontend (Next.js) ]                          [ Backend (Spring Boot) ]                      [ Database (MySQL) ]
         |                                                 |                                           |
         | --- (1) POST /login (username, password) -----> |                                           |
         |                                                 | --- (2) loadUserByUsername(loginId) ----> |
         |                                                 | <--- (3) Trả về thông tin Employee ------- |
         |                                                 |                                           |
         |                                                 | --- (4) Verify Password (BCrypt)          |
         |                                                 | --- (5) Generate JWT Access Token         |
         | <--- (6) Return LoginResponse (accessToken) --- |                                           |
         |                                                 |                                           |
  (Lưu Token vào Storage/State)                            |                                           |
         |                                                 |                                           |
         | --- (7) GET /employees (Header: Bearer Token) ->|                                           |
         |                                                 | --- (8) JwtTokenFilter intercept & verify |
         |                                                 | --- (9) Set SecurityContext & execute     |
         | <--- (10) Trả dữ liệu được bảo vệ ------------- |                                           |
```

### Chi tiết luồng xử lý:

1. **Luồng Đăng nhập (Login)**:
   - User nhập thông tin trên giao diện Login (`frontend/app/(auth)/login`).
   - Frontend gửi HTTP POST request đến endpoint `/login` đi kèm `LoginRequest` (gồm `username` và `password`).
   - `AuthController` tiếp nhận request, gọi `AuthenticationManager.authenticate()`.
   - Spring Security ủy quyền cho `UserDetailsServiceImpl` tìm kiếm nhân viên trong DB qua `EmployeeRepository.findByEmployeeLoginId()`.
   - Nếu khớp mật khẩu (mã hóa BCrypt), `JwtTokenProvider` tạo một chuỗi **JWT Access Token** dựa trên thông tin tài khoản.
   - Backend phản hồi `LoginResponse` chứa `accessToken` về cho Frontend.
   - Frontend lưu `accessToken` và điều hướng người dùng tới trang quản lý nhân viên (`/employees`).

2. **Luồng Xác thực Request (JWT Authentication Filter)**:
   - Với mọi request truy cập trang/API bảo vệ, Frontend gửi đính kèm Header: `Authorization: Bearer <accessToken>`.
   - Bộ lọc `JwtTokenFilter` của Backend giải mã và kiểm tra tính hợp lệ (chữ ký, thời hạn) của Token.
   - Nếu hợp lệ, hệ thống thiết lập đối tượng `Authentication` vào `SecurityContextHolder`, cho phép request đi tiếp vào Controller.

3. **Luồng Đăng xuất (Logout)**:
   - Vì cơ chế JWT là **Stateless** (Server không duy trì Session ID), việc đăng xuất ở Frontend được thực hiện bằng cách xóa Token khỏi Client Storage/Context và redirect về màn hình `/login`.

---

## 3. Cấu Trúc Các File & Thiết Kế Thư Mục

### Phía Backend (`backend/src/main/java/com/luvina/la`)

| Package / Folder | Vai trò & Lý do thiết kế |
| :--- | :--- |
| **`config/`** | Cấu hình hệ thống (CORS, JPA/Persistence, Spring Security). Gồm subpackage `config/jwt` quản lý các lớp liên quan đến JWT Token (Filter, Token Provider, UserDetails). |
| **`controller/`** | Tầng tiếp nhận request REST API (`AuthController`, `HomeController`). Đóng vai trò làm đầu mối tiếp nhận HTTP Request và phản hồi HTTP Response. |
| **`entity/`** | Ánh xạ trực tiếp các bảng trong Database MySQL sang Java Object bằng JPA (`Employee.java`). |
| **`repository/`** | Tầng truy xuất dữ liệu DB, mở rộng từ Spring Data `CrudRepository` (`EmployeeRepository.java`). Tránh viết câu lệnh SQL thủ công. |
| **`dto/`** | Data Transfer Object (`EmployeeDTO.java`) dùng để truyền tải dữ liệu ra bên ngoài API. Giúp ẩn các thông tin nhạy cảm của Entity gốc (như `employeeLoginPassword`). |
| **`payload/`** | Chứa các Class định dạng dữ liệu đầu vào / đầu ra của API (VD: `LoginRequest`, `LoginResponse`). |
| **`mapper/`** | Sử dụng **MapStruct** (`EmployeeMapper.java`) để tự động chuyển đổi qua lại giữa Entity và DTO một cách tối ưu. |

### Phía Frontend (`frontend/`)

| Đường dẫn | Vai trò & Lý do thiết kế |
| :--- | :--- |
| **`app/(auth)`** | Group route trong Next.js dành cho các trang xác thực không cần bảo vệ (`login`, `logout`). |
| **`app/(protected)`** | Group route trong Next.js dành cho các trang yêu cầu đăng nhập (`employees`). |
| **`lib/`** | Nơi chứa logic bổ trợ: `api` (gọi API backend), `auth` (Context/State quản lý auth), `validation` (Zod validation schema). |
| **`proxy.ts`** | Middleware hỗ trợ điều hướng và kiểm tra route an toàn phía server/proxy. |

---

## 4. Giải Thích Về Package `service` Phía Backend

### 🔴 Thực trạng hiện tại:
Trong cấu trúc backend hiện tại **chưa có package `com.luvina.la.service` riêng biệt**.
- **Nguyên nhân**: Dự án mới ở giai đoạn đầu (chỉ mới phát triển chức năng Login/Logout).
- Nơi xử lý nghiệp vụ duy nhất hiện tại là `UserDetailsServiceImpl` (được gắn annotation `@Service`), nhưng lại đang được đặt trong package `config/jwt` để phục vụ trực tiếp cho cấu hình Spring Security.
- Trong `AuthController`, logic xác thực được gọi trực tiếp thông qua `AuthenticationManager`.

### 🟢 Tại sao CẦN PHẢI DÙNG package `service` ở các bước tiếp theo?

Mô hình tiêu chuẩn của Spring Boot là **Mô hình 3 lớp (3-Tier Layered Architecture)**:
$$\text{Controller} \longrightarrow \text{Service (Business Layer)} \longrightarrow \text{Repository (Data Access Layer)} \longrightarrow \text{Database}$$

Khi bạn tiến hành làm tiếp các chức năng quản lý nhân viên (CRUD: Tìm kiếm, Thêm mới, Chỉnh sửa, Xóa, Export CSV,...), **việc bổ sung package `service` là BẮT BUỘC** vì các lý do sau:

1. **Tách biệt trách nhiệm (Separation of Concerns - SoC)**:
   - `Controller` chỉ nên làm nhiệm vụ validate input HTTP, điều hướng và trả về kết quả JSON (`LoginResponse`, `EmployeeDTO`).
   - `Service` sẽ là nơi chứa toàn bộ **Business Logic** (logic nghiệp vụ) như: kiểm tra tính hợp lệ của dữ liệu nhân viên, kiểm tra trùng lặp ID/Email, mã hóa mật khẩu, tính toán trình độ tiếng Nhật, v.v.

2. **Quản lý Giao dịch (Transaction Management - `@Transactional`)**:
   - Các thao tác cập nhật dữ liệu liên quan đến nhiều bảng (VD: thêm nhân viên đồng thời lưu trình độ tiếng Nhật) cần được bọc trong một Transaction ở tầng Service để đảm bảo tính toàn vẹn dữ liệu (Rollback khi có lỗi).

3. **Khả năng tái sử dụng & Viết Unit Test**:
   - Khi tách Business Logic ra `Service`, bạn có thể dễ dàng tái sử dụng logic đó ở các Controller khác nhau.
   - Giúp viết Unit Test (sử dụng JUnit / Mockito) cho phần nghiệp vụ một cách độc lập mà không cần phải khởi chạy web container hay HTTP Context.

### 💡 Đề xuất kiến trúc cho giai đoạn tiếp theo:
Tạo package `com.luvina.la.service` chứa:
- `EmployeeService.java` (Interface định nghĩa các hàm nghiệp vụ: `searchEmployees`, `createEmployee`, `updateEmployee`, `deleteEmployee`,...)
- `impl/EmployeeServiceImpl.java` (Class triển khai interface, inject `EmployeeRepository` và `EmployeeMapper`).
