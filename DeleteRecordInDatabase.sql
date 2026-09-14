-- ====================================================================================================
-- TẬP LỆNH SQL QUẢN LÝ DỮ LIỆU & RESET MIGRATION FLYWAY (MANAGE EMPLOYEES)
-- ====================================================================================================
-- Hướng dẫn: Bạn có thể copy các đoạn script dưới đây vào Adminer (http://localhost:8080), 
-- Navicat, DBeaver hoặc MySQL Workbench để thực hiện reset dữ liệu tương ứng.
-- Sau khi chạy script SQL, bạn chỉ cần KHỞI ĐỘNG LẠI BACKEND (Spring Boot), Flyway sẽ tự động chạy lại!
-- ====================================================================================================

-- ----------------------------------------------------------------------------------------------------
-- CÁCH 1: RESET ĐỂ CHẠY LẠI MIGRATION V2 (Khôi phục Dataset Chuẩn mặc định)
-- Mục đích: Làm sạch DB và nạp lại: Danh mục phòng ban, Danh mục chứng chỉ N1-N5, Tài khoản Admin và danh sách nhân viên mẫu chuẩn.
-- ----------------------------------------------------------------------------------------------------

-- Bước 1: Tắt kiểm tra khóa ngoại tạm thời
SET FOREIGN_KEY_CHECKS = 0;

-- Bước 2: Xóa sạch dữ liệu trong các bảng nghiệp vụ
TRUNCATE TABLE `employees_certifications`;
TRUNCATE TABLE `employees`;
TRUNCATE TABLE `departments`;
TRUNCATE TABLE `certifications`;

-- Bước 3: Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- Bước 4: Xóa bản ghi lịch sử Migration V2 (và V3 nếu có) trong bảng flyway_schema_history
-- Khi khởi động lại Backend, Flyway thấy thiếu version '2' sẽ tự động chạy lại file V2__init_schema.sql
DELETE FROM `flyway_schema_history` WHERE `version` IN ('2', '3');


-- ----------------------------------------------------------------------------------------------------
-- CÁCH 2: RESET ĐỂ CHẠY LẠI MIGRATION V3 (Nạp Dataset Kiểm thử Testcase đặc biệt)
-- Mục đích: Dùng khi bạn muốn nạp bộ dữ liệu kiểm thử biên (124, 125, 126 ký tự, ký tự đặc biệt %, _, /...).
-- ----------------------------------------------------------------------------------------------------

-- Bước 1: Tắt kiểm tra khóa ngoại tạm thời
SET FOREIGN_KEY_CHECKS = 0;

-- Bước 2: Xóa dữ liệu nhân viên & chứng chỉ liên kết
TRUNCATE TABLE `employees_certifications`;
TRUNCATE TABLE `employees`;

-- Bước 3: Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- Bước 4: Xóa lịch sử chạy version 3 để Flyway nạp lại file V3__test_dataset.sql
DELETE FROM `flyway_schema_history` WHERE `version` = '3';


-- ----------------------------------------------------------------------------------------------------
-- CÁCH 3: RESET TOÀN BỘ HỆ THỐNG TỪ CON SỐ 0 (Chạy lại từ V1 -> V2 -> V3)
-- Mục đích: Xóa sạch toàn bộ cấu trúc bảng và lịch sử để Flyway khởi tạo lại như một Database mới tinh.
-- ----------------------------------------------------------------------------------------------------

-- Bước 1: Tắt kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- Bước 2: Xóa toàn bộ các bảng trong database
DROP TABLE IF EXISTS `employees_certifications`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `certifications`;
DROP TABLE IF EXISTS `flyway_schema_history`;

-- Bước 3: Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;


-- ----------------------------------------------------------------------------------------------------
-- CÁCH 4: CHỈ XÓA DỮ LIỆU NHÂN VIÊN DO NGƯỜI DÙNG TỰ TẠO (GIỮ LẠI ADMIN & MASTER DATA)
-- Mục đích: Dọn dẹp các bản ghi rác sau khi test tính năng Thêm/Sửa/Xóa mà không cần chạy lại Flyway.
-- ----------------------------------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- Xóa tất cả chứng chỉ của nhân viên (trừ nhân viên ID=1 là Admin)
DELETE FROM `employees_certifications` WHERE `employee_id` > 1;

-- Xóa tất cả nhân viên thường (giữ lại tài khoản Admin có employee_id = 1)
DELETE FROM `employees` WHERE `employee_id` > 1;

-- Reset lại auto_increment về tiếp theo sau Admin
ALTER TABLE `employees` AUTO_INCREMENT = 2;
ALTER TABLE `employees_certifications` AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;


-- ====================================================================================================
-- CƠ CHẾ HOẠT ĐỘNG CỦA FLYWAY TRONG DỰ ÁN:
-- 1. Bảng `flyway_schema_history` ghi lại các file SQL đã được thực thi (V1, V2, V3...) kèm mã Checksum.
-- 2. Khi Backend khởi chạy:
--    - Nếu `version` chưa có trong bảng -> Flyway tự động thực thi file SQL đó.
--    - Nếu `version` đã có trong bảng -> Flyway bỏ qua.
-- 3. Vì vậy, khi muốn chạy lại file nào, bạn chỉ cần DELETE dòng có `version` tương ứng khỏi bảng `flyway_schema_history` và Restart Backend!
-- ====================================================================================================
