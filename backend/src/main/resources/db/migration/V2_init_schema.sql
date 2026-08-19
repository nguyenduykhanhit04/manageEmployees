--1. Tạo bảng departments --
CREATE TABLE IF NOT EXISTS `departments` (
    `department_id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--2. Tạo bảng certifications --
CREATE TABLE IF NOT EXISTS `certifications` (
    `certification_id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `certification_name` VARCHAR(50) NOT NULL,
    `certification_level` INT NOT NULL,
    PRIMARY KEY (`certification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo dữ liệu bảng certifications --
INSERT INTO `certifications` (`certification_name`, `certification_level`) VALUES
    ('Trình độ tiếng nhật cấp 1', 1),
    ('Trình độ tiếng nhật cấp 2', 2),
    ('Trình độ tiếng nhật cấp 3', 3),
    ('Trình độ tiếng nhật cấp 4', 4),
    ('Trình độ tiếng nhật cấp 5', 5);

-- Tạo dữ liệu bảng departments --
INSERT INTO `departments` (`department_name`) VALUES
    ('Phòng QAT'),
    ('Phòng DEV1'),
    ('Phòng DEV2'),
    ('Phòng DEV3'),
    ('Phòng DEV4'),
    ('Phòng DEV5'),
    ('Phòng DEV6'),
    ('Phòng DEV7'),
    ('Phòng DEV8'),
    ('Phòng DEV9'),
    ('Phòng DEV10'),
    ('Phòng DEV11');

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

--3. Tạo bảng employees_certifications
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



