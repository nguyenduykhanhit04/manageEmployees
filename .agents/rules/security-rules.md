# 🔒 Quy Chuẩn Bảo Mật & Phân Quyền (Security Rules)

> **Mục tiêu**: Đảm bảo an toàn thông tin, kiểm soát xác thực JWT, bảo vệ mật khẩu và phân quyền RBAC chặt chẽ.

---

## 1. Xác Thực & Phân Quyền (Authentication & RBAC)

- **JWT Tokens**:
  - Token được sinh ra sau khi đăng nhập thành công với payload chứa `employeeId`, `employeeName`, `employeeLoginId`, `employeeEmail`.
  - Secret key và Expiration time được lấy từ `Constants.JWT_SECRET` và `Constants.JWT_EXPIRATION`.
  - Lọc xác thực thông qua `JwtAuthenticationFilter`.
- **Phân quyền Role**:
  - `Constants.ROLE_ADMIN = 0`: Quản trị viên (có toàn quyền xem, thêm, sửa, xóa người dùng).
  - `Constants.ROLE_USER = 1`: Người dùng thông thường.
- **Quy tắc bảo vệ Admin (ER020)**:
  - **TUYỆT ĐỐI KHÔNG** cho phép xóa bất kỳ nhân viên nào có role `ROLE_ADMIN` (`employee_login_id` là Admin hoặc trường role = 0).
  - Khi phát hiện yêu cầu xóa tài khoản Admin, Validator/Service phải lập tức ném lỗi `BusinessException(Constants.ER020, List.of())`.

---

## 2. Bảo Mật Dữ Liệu & Mật Khẩu

- **Mã Hóa Mật Khẩu**:
  - Mật khẩu phải luôn được mã hóa bằng **BCryptPasswordEncoder** trước khi lưu vào DB.
  - Tuyệt đối không lưu plain text password, không ghi log mật khẩu ra log file / console.
- **Chống SQL Injection**:
  - Sử dụng tham số hóa qua Hibernate/JPA hoặc Named Parameter `:param`.
  - Không ghép chuỗi String để tạo câu truy vấn SQL động (`"WHERE name = '" + name + "'"` là cấm tuyệt đối).
- **Chống XSS (Cross-Site Scripting)**:
  - Frontend render dữ liệu qua React JSX (tự động escape HTML).
  - Không sử dụng `dangerouslySetInnerHTML` khi hiển thị dữ liệu người dùng nhập.

---

## 3. Quản Lý Session & Token ở Frontend

- Token được lưu trữ an toàn trong HttpOnly Cookie hoặc State Management an toàn.
- Khi nhận mã lỗi xác thực 401 hoặc hết hạn token, Frontend tự động chuyển hướng người dùng về màn hình đăng nhập `/login` (ADM001) và xóa sạch state session.
