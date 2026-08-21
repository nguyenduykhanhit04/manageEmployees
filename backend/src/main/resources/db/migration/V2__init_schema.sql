-- 1. Tạo bảng departments
CREATE TABLE IF NOT EXISTS `departments` (
    `department_id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tạo bảng certifications
CREATE TABLE IF NOT EXISTS `certifications` (
    `certification_id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `certification_name` VARCHAR(50) NOT NULL,
    `certification_level` INT NOT NULL,
    PRIMARY KEY (`certification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tạo dữ liệu bảng certifications
INSERT INTO `certifications` (`certification_id`, `certification_name`, `certification_level`) VALUES
    (1, 'Trình độ tiếng nhật cấp 1', 1),
    (2, 'Trình độ tiếng nhật cấp 2', 2),
    (3, 'Trình độ tiếng nhật cấp 3', 3),
    (4, 'Trình độ tiếng nhật cấp 4', 4),
    (5, 'Trình độ tiếng nhật cấp 5', 5);

-- 4. Tạo dữ liệu bảng departments (phải insert trước khi tạo khóa ngoại ở bảng employees)
INSERT INTO `departments` (`department_id`, `department_name`) VALUES
    (1, 'Phòng QAT'),
    (2, 'Phòng DEV1'),
    (3, 'Phòng DEV2'),
    (4, 'Phòng DEV3'),
    (5, 'Phòng DEV4'),
    (6, 'Phòng DEV5'),
    (7, 'Phòng DEV6'),
    (8, 'Phòng DEV7'),
    (9, 'Phòng DEV8'),
    (10, 'Phòng DEV9'),
    (11, 'Phòng DEV10'),
    (12, 'Phòng DEV11');

-- 5. Cập nhật cấu trúc bảng employees
ALTER TABLE `employees`
    MODIFY COLUMN `employee_name` varchar(255) NOT NULL,
    MODIFY COLUMN `employee_email` varchar(255) NOT NULL,
    ADD COLUMN `employee_name_kana` varchar(255) AFTER `employee_name`,
    ADD COLUMN `employee_birth_date` date AFTER `employee_name_kana`,
    ADD COLUMN `employee_telephone` varchar(50) AFTER `employee_email`,
    ADD COLUMN `employee_role` int NOT NULL DEFAULT 1 COMMENT '0: Admin, 1: User',
    ADD UNIQUE INDEX `unique_login_id` (`employee_login_id`),
    ADD CONSTRAINT `fk_employee_department`
        FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`);

-- 6. Tạo bảng employees_certifications
CREATE TABLE IF NOT EXISTS `employees_certifications` (
    `employee_certification_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `employee_id` bigint(20) NOT NULL,
    `certification_id` bigint(20) NOT NULL,
    `start_date` date NOT NULL,
    `end_date` date NOT NULL,
    `score` decimal(10,2) NOT NULL,
    PRIMARY KEY (`employee_certification_id`),
    CONSTRAINT `fk_ec_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
    CONSTRAINT `fk_ec_certification` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`certification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================================
-- KHỐI LỆNH RESET DỮ LIỆU CŨ (Mở comment bên dưới khi muốn xóa sạch và nạp lại data)
-- =========================================================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE `employees_certifications`;
-- TRUNCATE TABLE `employees`;
-- TRUNCATE TABLE `departments`;
-- TRUNCATE TABLE `certifications`;
-- SET FOREIGN_KEY_CHECKS = 1;
-- 
-- INSERT INTO `certifications` (`certification_id`, `certification_name`, `certification_level`) VALUES
--     (1, 'Trình độ tiếng nhật cấp 1', 1),
--     (2, 'Trình độ tiếng nhật cấp 2', 2),
--     (3, 'Trình độ tiếng nhật cấp 3', 3),
--     (4, 'Trình độ tiếng nhật cấp 4', 4),
--     (5, 'Trình độ tiếng nhật cấp 5', 5);
-- 
-- INSERT INTO `departments` (`department_id`, `department_name`) VALUES
--     (1, 'Phòng QAT'),
--     (2, 'Phòng DEV1'),
--     (3, 'Phòng DEV2'),
--     (4, 'Phòng DEV3'),
--     (5, 'Phòng DEV4'),
--     (6, 'Phòng DEV5'),
--     (7, 'Phòng DEV6'),
--     (8, 'Phòng DEV7'),
--     (9, 'Phòng DEV8'),
--     (10, 'Phòng DEV9'),
--     (11, 'Phòng DEV10'),
--     (12, 'Phòng DEV11');
-- 
-- INSERT INTO `employees` (
--     `employee_id`,
--     `department_id`,
--     `employee_name`,
--     `employee_name_kana`,
--     `employee_birth_date`,
--     `employee_email`,
--     `employee_telephone`,
--     `employee_role`,
--     `employee_login_id`,
--     `employee_login_password`
-- ) VALUES (
--     1,
--     1,
--     'Administrator',
--     'アドミニストレーター',
--     '2000-01-01',
--     'la@luvina.net',
--     '0123456789',
--     0,
--     'admin',
--     '$2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy'
-- );
