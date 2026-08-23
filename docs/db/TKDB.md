# Tài liệu Thiết kế Database (TKDB)

| Thông tin | Giá trị |
|---|---|
| Tên system | TKDB |
| Loại system | 14_Thiết kế DB |
| Category chức năng | ー |
| Người tạo | ThanhPD |
| Ngày tạo | 2023-01-04 |
| Người update | ThanhPD |
| Ngày update | 2023-01-04 |
| Version | 0.1 |

## Lịch sử thay đổi

| Date | Người update | Version | Nội dung thay đổi |
|---|---|---|---|
| 2023-01-04 | ThanhPD | 0.1 | Tạo mới tài liệu |

---

## Sơ đồ ER

*(Sheet chứa sơ đồ quan hệ thực thể - ER Diagram dạng hình vẽ, không có dữ liệu dạng bảng để trích xuất trực tiếp. Quan hệ giữa các bảng được tổng hợp bên dưới dựa trên khóa ngoại của từng bảng.)*

Quan hệ chính giữa các bảng:
- `employees.department_id` → `departments.department_id`
- `employees_certifications.employee_id` → `employees.employee_id`
- `employees_certifications.certification_id` → `certifications.certification_id`

---

## Danh sách các bảng

| No. | Tên logic | Tên vật lý |
|---|---|---|
| 1 | Bảng thông tin nhân viên | `employees` |
| 2 | Bảng thông tin phòng ban | `departments` |
| 3 | Bảng thông tin trình độ tiếng Nhật | `certifications` |
| 4 | Bảng quan hệ nhân viên trình độ tiếng Nhật | `employees_certifications` |

---

## Bảng: `employees`

### Thông tin bảng

| Thuộc tính | Giá trị |
|---|---|
| Tên schema | 社員サービス |
| Tên logic | Bảng thông tin nhân viên |
| Tên vật lý | `employees` |
| Ghi chú | |
| Tên RDBMS | Aurora |
| Version | Mysql |

### Thông tin cột

| No. | Tên logic | Tên vật lý | Data Type | PK | Not Null | Format |
|---|---|---|---|---|---|---|
| 1 | ID nhân viên | `employee_id` | BIGINT | Yes | Yes | |
| 2 | ID bộ phận | `department_id` | BIGINT | | Yes | |
| 3 | Tên (Tên) | `employee_name` | VARCHAR(255) | | Yes | |
| 4 | Tên (kana) (Tên) | `employee_name_kana` | VARCHAR(255) | | | |
| 5 | Ngày sinh | `employee_birth_date` | DATE | | | |
| 6 | Địa chỉ email | `employee_email` | VARCHAR(255) | | Yes | |
| 7 | Số điện thoại | `employee_telephone` | VARCHAR(50) | | | |
| 8 | Tên tài khoản | `employee_login_id` | VARCHAR(50) | | Yes | |
| 9 | Mật khẩu | `employee_login_password` | VARCHAR(100) | | | |

---

## Bảng: `departments`

### Thông tin bảng

| Thuộc tính | Giá trị |
|---|---|
| Tên schema | user |
| Tên logic | Bảng thông tin phòng ban |
| Tên vật lý | `departments` |
| Ghi chú | |
| Tên RDBMS | Aurora |
| Version | Mysql |

### Thông tin cột

| No. | Tên logic | Tên vật lý | Data Type | PK | Not Null | Format |
|---|---|---|---|---|---|---|
| 1 | ID bộ phận | `department_id` | BIGINT | Yes | Yes | |
| 2 | Tên bộ phận | `department_name` | VARCHAR(50) | | Yes | |

---

## Bảng: `certifications`

### Thông tin bảng

| Thuộc tính | Giá trị |
|---|---|
| Tên schema | user |
| Tên logic | Bảng thông tin trình độ tiếng Nhật |
| Tên vật lý | `certifications` |
| Ghi chú | |
| Tên RDBMS | Aurora |
| Version | Mysql |

### Thông tin cột

| No. | Tên logic | Tên vật lý | Data Type | PK | Not Null | Format |
|---|---|---|---|---|---|---|
| 1 | ID chứng chỉ tiếng Nhật | `certification_id` | BIGINT | Yes | Yes | |
| 2 | Tên chứng chỉ | `certification_name` | VARCHAR(50) | | Yes | |
| 3 | Cấp độ của chứng chỉ | `certification_level` | INT | | Yes | |

### Data Master

| certification_id | certification_name | certification_level |
|---|---|---|
| 1 | Trình độ tiếng nhật cấp 1 | 1 |
| 2 | Trình độ tiếng nhật cấp 2 | 2 |
| 3 | Trình độ tiếng nhật cấp 3 | 3 |
| 4 | Trình độ tiếng nhật cấp 4 | 4 |
| 5 | Trình độ tiếng nhật cấp 5 | 5 |

---

## Bảng: `employees_certifications`

### Thông tin bảng

| Thuộc tính | Giá trị |
|---|---|
| Tên schema | user |
| Tên logic | Bảng quan hệ nhân viên trình độ tiếng Nhật |
| Tên vật lý | `employees_certifications` |
| Ghi chú | |
| Tên RDBMS | Aurora |
| Version | Mysql |

### Thông tin cột

| No. | Tên logic | Tên vật lý | Data Type | PK | Not Null | Format |
|---|---|---|---|---|---|---|
| 1 | ID quan hệ nhân viên và chứng chỉ tiếng Nhật | `employee_certification_id` | BIGINT | Yes | Yes | |
| 2 | ID nhân viên | `employee_id` | BIGINT | Yes | Yes | |
| 3 | ID chứng chỉ | `certification_id` | BIGINT | Yes | Yes | |
| 4 | Ngày đạt chứng chỉ | `start_date` | DATE | | Yes | |
| 5 | Ngày hết hạn chứng chỉ | `end_date` | DATE | | Yes | |
| 6 | Điểm | `score` | DECIMAL | | Yes | |
