-- 1. Bảng phòng ban (departments) --
CREATE TABLE IF NOT EXISTS `departments` (
    `department_id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Bảng chứng chỉ tiếng Nhật (certifications) --
CREATE TABLE IF NOT EXISTS `certifications` (
    `certification_id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `certification_name` VARCHAR(50) NOT NULL,
    `certification_level` INT NOT NULL,
    PRIMARY KEY (`certification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Bảng nhân viên (employees) --
CREATE TABLE IF NOT EXISTS `employees` (
    `employee_id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `department_id` BIGINT(20) NOT NULL,
    `employee_name` VARCHAR(255) NOT NULL,
    `employee_name_kana` VARCHAR(255) DEFAULT NULL,
    `employee_birth_date` DATE DEFAULT NULL,
    `employee_email` VARCHAR(255) NOT NULL,
    `employee_telephone` VARCHAR(50) DEFAULT NULL,
    `employee_role` INT NOT NULL DEFAULT 1 COMMENT '0: Admin, 1: User',
    `employee_login_id` VARCHAR(50) NOT NULL,
    `employee_login_password` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`employee_id`),
    UNIQUE KEY `unique_login_id` (`employee_login_id`),
    CONSTRAINT `fk_employee_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Bảng liên kết chứng chỉ nhân viên (employees_certifications) --
CREATE TABLE IF NOT EXISTS `employees_certifications` (
    `employee_certification_id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `employee_id` BIGINT(20) NOT NULL,
    `certification_id` BIGINT(20) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `score` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`employee_certification_id`),
    CONSTRAINT `fk_ec_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
    CONSTRAINT `fk_ec_certification` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`certification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;