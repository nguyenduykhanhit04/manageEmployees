---
name: db-migration
description: Manage and write Flyway database migration scripts, table schemas, foreign keys, and indexes in MySQL according to TKDB specifications without breaking existing data.
---

# 🗄️ Kỹ Năng Quản Lý Database & Migration (DB Migration Skill)

Kỹ năng chuyên biệt dùng để cập nhật cấu trúc cơ sở dữ liệu MySQL bằng công cụ Flyway Migration theo tài liệu thiết kế Database (`docs/db/TKDB.md`).

---

## 📌 1. Nguyên Tắc Cốt Lõi Về Migration

1. **Bảo toàn Migration cũ**:
   - Tuyệt đối **KHÔNG** chỉnh sửa nội dung các file migration đã được áp dụng trong môi trường (`V1__init_schema.sql`).
   - Mọi thay đổi về cấu trúc bảng (thêm cột, sửa kiểu dữ liệu, thêm index) đều phải tạo file migration mới tuần tự: `V2__xxx.sql`, `V3__xxx.sql`.
2. **Quy tắc đặt tên file Migration**:
   - `V<Version>__<Mota_chuc_nang>.sql` (Ví dụ: `V2__add_employee_status_column.sql`).
   - Version phải là số nguyên hoặc định dạng phân cấp rõ ràng (ví dụ: `V2`, `V2_1`).
3. **Quy tắc viết SQL Migration**:
   - Sử dụng cú pháp DDL chuẩn của MySQL 8.
   - Luôn định nghĩa rõ ràng `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`.
   - Tạo khóa ngoại (Foreign Key) với `ON UPDATE CASCADE` / `ON DELETE RESTRICT` theo thiết kế TKDB.
   - Thêm index (`INDEX idx_xxx (col)`) cho các cột thường xuyên được tìm kiếm hoặc sắp xếp (`employee_name`, `department_id`, `end_date`).
