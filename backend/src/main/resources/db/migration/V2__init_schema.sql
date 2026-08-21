-- 1. Nạp dữ liệu bảng certifications --
INSERT INTO `certifications` (`certification_id`, `certification_name`, `certification_level`) VALUES
    (1, 'Trình độ tiếng nhật cấp 1', 1),
    (2, 'Trình độ tiếng nhật cấp 2', 2),
    (3, 'Trình độ tiếng nhật cấp 3', 3),
    (4, 'Trình độ tiếng nhật cấp 4', 4),
    (5, 'Trình độ tiếng nhật cấp 5', 5);

-- 2. Nạp dữ liệu bảng departments --
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

-- 3. Nạp tài khoản quản trị Administrator (mật khẩu: Admin@123456) --
INSERT INTO `employees` (
    `employee_id`,
    `department_id`,
    `employee_name`,
    `employee_name_kana`,
    `employee_birth_date`,
    `employee_email`,
    `employee_telephone`,
    `employee_role`,
    `employee_login_id`,
    `employee_login_password`
) VALUES (
    1,
    1,
    'Administrator',
    'アドミニストレーター',
    '2000-01-01',
    'la@luvina.net',
    '0123456789',
    0,
    'admin',
    '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'
);

-- 4. Nạp dữ liệu nhân viên mẫu --
INSERT INTO `employees` (
    `employee_id`,
    `department_id`,
    `employee_name`,
    `employee_name_kana`,
    `employee_birth_date`,
    `employee_email`,
    `employee_telephone`,
    `employee_role`,
    `employee_login_id`,
    `employee_login_password`
) VALUES
    (2, 1, 'Nguyễn Thị Mai Hương', 'グエン ティ マイ フオン', '1983-07-08', 'ntmhuong@luvina.net', '0914326386', 1, 'huongntm', '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (3, 2, 'Lê Thị Xoa', 'レ ティ ソア', '1983-07-08', 'xoalt@luvina.net', '1234567894', 1, 'xoalt', '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (4, 1, 'Đặng Thị Hân', 'ダン ティ ハン', '1983-07-08', 'handt@luvina.net', '0914326386', 1, 'handt', '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (5, 2, 'Lê Nghiêm Thủy', 'レ ギエム トゥイ', '1983-07-08', 'thuyln@luvina.net', '1234567894', 1, 'thuyln', '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (6, 2, 'Lê Phương Anh', 'レ フオン アイン', '1983-07-08', 'anhlp@luvina.net', '1234567894', 1, 'anhlp', '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq');

-- 5. Nạp dữ liệu chứng chỉ cho nhân viên mẫu --
INSERT INTO `employees_certifications` (`employee_certification_id`, `employee_id`, `certification_id`, `start_date`, `end_date`, `score`) VALUES
    (1, 2, 4, '2010-07-08', '2011-07-08', 290.00),
    (2, 3, 4, '2010-07-08', '2011-07-08', 290.00),
    (3, 4, 4, '2010-07-08', '2011-07-08', 290.00),
    (4, 5, 4, '2010-07-08', '2011-07-08', 290.00),
    (5, 6, 4, '2010-07-08', '2011-07-08', 290.00);
