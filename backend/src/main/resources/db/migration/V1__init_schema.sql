CREATE TABLE IF NOT EXISTS `employees` (
    employee_id bigint(20) NOT NULL AUTO_INCREMENT,
    department_id bigint(20) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    employee_email VARCHAR(50) NOT NULL,
    employee_login_id VARCHAR(50) NOT NULL,
    employee_login_password VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (`employee_id`) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO employees (department_id, employee_name, employee_email, employee_login_id, employee_login_password)
VALUES (1, 'Administrator', 'la@luvina.net', 'admin', '$2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy');


-- 1. Bảng departments (Phòng ban)
CREATE TABLE IF NOT EXISTS `departments` (
                                             `department_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `department_name` varchar(50) NOT NULL,
    PRIMARY KEY (`department_id`) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert dữ liệu mẫu cho departments để test API
INSERT INTO `departments` (`department_id`, `department_name`) VALUES
                                                                   (1, 'Phát triển phần mềm'),
                                                                   (2, 'Hành chính nhân sự'),
                                                                   (3, 'Đảm bảo chất lượng (QA)');


-- Insert thêm một nhân viên nữa vào phòng số 1 để test lấy danh sách đa dạng hơn
INSERT INTO `employees` (`department_id`, `employee_name`, `employee_email`, `employee_login_id`, `employee_login_password`) VALUES
    (1, 'Tống Đăng Dương', 'duongtd@luvina.net', 'duongtd', '$2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy');


-- 2. Bảng certifications (Chứng chỉ)
CREATE TABLE IF NOT EXISTS `certifications` (
                                                `certification_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `certification_name` varchar(50) NOT NULL,
    `certification_level` int(11) NOT NULL,
    PRIMARY KEY (`certification_id`) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert dữ liệu mẫu cho certifications
-- Ghi chú từ file thiết kế: Giá trị level càng nhỏ thì trình độ càng cao
INSERT INTO `certifications` (`certification_id`, `certification_name`, `certification_level`) VALUES
                                                                                                   (1, 'JLPT N1', 1),
                                                                                                   (2, 'JLPT N2', 2),
                                                                                                   (3, 'JLPT N3', 3),
                                                                                                   (4, 'JLPT N4', 4),
                                                                                                   (5, 'JLPT N5', 5);

-- 3. Bảng employees_certifications (Bảng trung gian quản lý chứng chỉ của nhân viên)
CREATE TABLE IF NOT EXISTS `employees_certifications` (
                                                          `employee_certification_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `employee_id` bigint(20) NOT NULL,
    `certification_id` bigint(20) NOT NULL,
    `start_date` date NOT NULL,
    `end_date` date NOT NULL,
    `score` decimal(10,2) NOT NULL,
    PRIMARY KEY (`employee_certification_id`) USING BTREE,
    CONSTRAINT `fk_empcert_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_empcert_certification` FOREIGN KEY (`certification_id`) REFERENCES `certifications` (`certification_id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert dữ liệu mẫu map chứng chỉ cho nhân viên
INSERT INTO `employees_certifications` (`employee_id`, `certification_id`, `start_date`, `end_date`, `score`) VALUES
                                                                                                                  (1, 2, '2024-01-15', '2029-01-15', 130.50), -- Administrator đạt N2
                                                                                                                  (2, 4, '2025-12-05', '2030-12-05', 115.00); -- Tống Đăng Dương đạt N4