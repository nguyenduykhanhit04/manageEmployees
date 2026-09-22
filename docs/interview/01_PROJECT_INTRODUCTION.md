# 🎤 PHẦN 1: MỞ LỜI & GIỚI THIỆU DỰ ÁN KHI PHỎNG VẤN

---

## 📌 1. Các Kịch Bản Mở Lời Phỏng Vấn (Lời Nói Mẫu)

### 🌟 Kịch Bản 1: Chuẩn Mực & Toàn Diện (Khuyên dùng — Thời lượng ~1.5 - 2 phút)

> *"Dạ, em xin phép được giới thiệu tổng quan về dự án **Quản lý Nhân viên (Manage Employees)** mà em đã thực hiện:*
>
> *Trong quá trình học và làm đồ án, nhóm em được giao yêu cầu phát triển một hệ thống quản lý thông tin nhân viên và trình độ chứng chỉ tiếng Nhật, bám sát bộ tài liệu thiết kế chuẩn doanh nghiệp (bao gồm: Thiết kế màn hình, TKDB, TKAPI và Coding Checklist).*
>
> *Từ source base ban đầu đã có sẵn module xác thực cơ bản (**Login/Logout bằng JWT**), em đã tiếp tục nghiên cứu đặc tả và trực tiếp phát triển trọn vẹn luồng nghiệp vụ **CRUD** nhân viên từ Backend đến Frontend:*
> - * **Frontend:** Xây dựng bằng **Next.js (App Router)** kết hợp **TypeScript**, **React Hook Form**, và **Zod** để validate chặt chẽ dữ liệu từ phía client.*
> - * **Backend:** Sử dụng **Spring Boot (Java 17)**, **Spring Data JPA**, **MySQL 8** cùng **Flyway Migration** để quản lý phiên bản database.*
>
> *Điểm trọng tâm của dự án là màn hình danh sách **ADM002**, nơi em giải quyết bài toán **tìm kiếm đa điều kiện**, **phân trang** và **sắp xếp động đa cột (Multi-column sorting)** để tối ưu trải nghiệm người dùng.*
>
> *Ngoài ra, hệ thống xử lý đầy đủ các luồng: Xem chi tiết (**ADM003**), Thêm mới/Chỉnh sửa (**ADM004**), Xác nhận thông tin (**ADM005**) và Thông báo kết quả (**ADM006**). Toàn bộ luồng xử lý lỗi được chuẩn hóa theo mã lỗi tham số (**Parametric Error Code ER001 - ER023**) giúp hệ thống đồng nhất và dễ mở rộng.*
>
> *Dự án này giúp em rèn luyện kỹ năng đọc hiểu tài liệu thiết kế chuẩn, tuân thủ nghiêm ngặt Coding Convention và tổ chức kiến trúc phân tầng sạch sẽ.*
>
> *Em rất mong nhận được câu hỏi và góp ý từ anh/chị ạ."*

---

### ⚡ Kịch Bản 2: Ngắn Gọn & Đi Thẳng Vào Trọng Tâm (~45 giây - 1 phút)

> *"Dạ, em xin phép tóm tắt nhanh về dự án Quản lý nhân viên:*
>
> *Dự án này em phát triển full-stack dựa trên tài liệu thiết kế có sẵn, sử dụng **Spring Boot** cho Backend và **Next.js** cho Frontend. Hệ thống quản lý thông tin nhân viên kèm theo chứng chỉ tiếng Nhật (N1–N5).*
>
> *Trên nền source base đã có cơ chế Auth (JWT), em đảm nhận phát triển trọn bộ luồng **CRUD nhân viên**:*
> 1. * **ADM002 (Danh sách):** Tìm kiếm theo tên/phòng ban, phân trang và sắp xếp nhiều cột.*
> 2. * **ADM003 - ADM006:** Luồng thêm mới, xem chi tiết, cập nhật và xóa với bước xác nhận (Confirm) và xử lý Transaction an toàn giữa bảng Employee và Certificate.*
>
> *Qua dự án, em nắm vững cách tổ chức kiến trúc phân tầng (Controller - Service - Repository), validate dữ liệu 2 đầu (Zod & Bean Validation) và xử lý ngoại lệ tập trung ạ."*

---

## 🚀 2. Bảng Tổng Hợp Công Nghệ Sử Dụng (Tech Stack)

| Phân Hệ | Công Nghệ / Thư Viện | Phiên Bản | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| **Backend** | **Java** | 17 (LTS) | Ngôn ngữ lập trình chính, tận dụng Text Blocks `"""`, Records, Stream API |
| | **Spring Boot** | 2.7.8 | Framework cốt lõi xây dựng RESTful API |
| | **Spring Security & JWT** | Auth0 `java-jwt 4.0.0` | Xác thực Stateless qua chuỗi Token HMAC-512 |
| | **Spring Data JPA & Hibernate** | - | Tầng ORM, quản lý truy vấn và thao tác cơ sở dữ liệu |
| | **MySQL** | 8.0 | Hệ quản trị cơ sở dữ liệu quan hệ |
| | **Flyway** | 8.5.13 | Quản lý phiên bản migration cơ sở dữ liệu tự động |
| | **MapStruct** | 1.5.3 | Chuyển đổi dữ liệu hiệu năng cao lúc Compile-time (Entity $\leftrightarrow$ DTO) |
| | **Lombok** | 1.18.24 | Giảm thiểu boilerplate code (`@Getter`, `@Setter`, `@RequiredArgsConstructor`) |
| | **JUnit 5 & Mockito** | - | Viết Unit Test cho tầng Service, Controller, Validator |
| **Frontend** | **Next.js** | 16 (App Router) | Framework React với Server Components, File-based Routing |
| | **React** | 19 | Thư viện xây dựng giao diện người dùng |
| | **TypeScript** | 5.x | Đảm bảo tính an toàn kiểu dữ liệu (Type-safety) |
| | **Vanilla CSS Module** | - | Styling độc lập theo từng Component, tối ưu hiệu năng |
| | **React Hook Form & Zod** | RHF 7.x, Zod 4.x | Quản lý Form State và Validation phía Client |
| | **Axios** | - | HTTP Client kết nối API với Request/Response Interceptors |
| | **date-fns & react-datepicker** | - | Xử lý format và chọn ngày tháng chuẩn `yyyy/MM/dd` |

---

## 📱 3. Danh Sách Màn Hình & Phân Hệ Chức Năng

```text
[ADM001: Đăng nhập] 
       │
       ▼
[ADM002: Danh sách nhân viên] ◄────────────────────────────────────────┐
       ├── Tìm kiếm theo tên & phòng ban                               │ (Quay lại)
       ├── Sắp xếp động đa cột (Tên, Trình độ N1-N5, Hạn chứng chỉ)    │
       └── Phân trang dữ liệu (LIMIT / OFFSET)                         │
       │                                                               │
       ├───► [ADM003: Xem chi tiết nhân viên] ─────────────────────────┤
       │                                                               │
       ├───► [ADM004: Thêm mới / Chỉnh sửa nhân viên]                  │
       │             │                                                 │
       │             ▼ (Chuyển dữ liệu qua sessionStorage)             │
       │     [ADM005: Xác nhận thông tin trước khi Lưu / Xóa]          │
       │             │                                                 │
       │             ▼ (Gọi API lưu DB thành công)                     │
       └─────► [ADM006: Thông báo hoàn tất Thao tác] ──────────────────┘
```
