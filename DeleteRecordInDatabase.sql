		-- 1. Tắt tạm thời kiểm tra khóa ngoại để Truncate không bị lỗi
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Truncate các bảng
TRUNCATE TABLE `employees_certifications`;
TRUNCATE TABLE `employees`;
TRUNCATE TABLE `departments`;
TRUNCATE TABLE `certifications`;

-- 3. Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Xóa lịch sử chạy migration V2 trong Flyway để Backend chạy lại file V2 từ đầu
DELETE FROM `flyway_schema_history` WHERE `version` = '2';
