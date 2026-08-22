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
    (6, 2, 'Lê Phương Anh', 'レ フオン アイン', '1983-07-08', 'anhlp@luvina.net', '1234567894', 1, 'anhlp', '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (7,  3, 'Nguyễn Văn An',       'グエン ヴァン アン',       '1990-03-15', 'anvn@luvina.net',       '0901234501', 1, 'anvn',       '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (8,  4, 'Trần Thị Lan',        'チャン ティ ラン',         '1992-06-20', 'lantt@luvina.net',      '0901234502', 1, 'lantt',      '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (9,  5, 'Phạm Minh Đức',       'ファム ミン ドゥック',     '1988-11-12', 'ducpm@luvina.net',      '0901234503', 1, 'ducpm',      '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (10, 6, 'Hoàng Thị Ngọc',      'ホアン ティ ゴック',       '1995-01-25', 'ngocht@luvina.net',     '0901234504', 1, 'ngocht',     '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (11, 7, 'Vũ Minh Quân',         'ヴ ミン クアン',           '1991-09-10', 'quanvm@luvina.net',     '0901234505', 1, 'quanvm',      '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (12, 8, 'Đỗ Thị Hạnh',          'ド ティ ハイン',           '1993-04-18', 'hanhdt@luvina.net',     '0901234506', 1, 'hanhdt',      '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (13, 9, 'Nguyễn Hoàng Nam',     'グエン ホアン ナム',       '1987-12-05', 'namnh@luvina.net',      '0901234507', 1, 'namnh',       '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (14, 10, 'Bùi Thị Mai',         'ブイ ティ マイ',           '1996-02-14', 'maibt@luvina.net',      '0901234508', 1, 'maibt',       '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (15, 11, 'Lê Văn Hùng',         'レ ヴァン フン',           '1989-08-30', 'hungle@luvina.net',     '0901234509', 1, 'hungle',      '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (16, 12, 'Nguyễn Thị Hà',       'グエン ティ ハー',         '1994-10-22', 'hant@luvina.net',       '0901234510', 1, 'hant',        '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (17, 3, 'Trần Văn Bình',        'チャン ヴァン ビン',       '1986-05-17', 'binhtv@luvina.net',     '0901234511', 1, 'binhtv',      '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (18, 4, 'Phan Thị Thảo',        'ファン ティ タオ',         '1997-03-08', 'thaopt@luvina.net',     '0901234512', 1, 'thaopt',      '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (19, 5, 'Đặng Minh Tâm',        'ダン ミン タム',           '1990-07-27', 'tamdm@luvina.net',      '0901234513', 1, 'tamdm',       '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (20, 6, 'Nguyễn Đức Long',      'グエン ドゥック ロン',     '1992-11-03', 'longnd@luvina.net',     '0901234514', 1, 'longnd',      '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq'),
    (21, 7, 'Trịnh Thị Yến',        'チン ティ イエン',         '1995-09-19', 'yentt@luvina.net',      '0901234515', 1, 'yentt',       '$2a$10$.2W3K6BiWBW5kBT/miKZBOOR.Dn0ZBbwJg47EG4meNOPhvn7V6lCq');

-- 5. Nạp dữ liệu chứng chỉ cho nhân viên mẫu --
INSERT INTO `employees_certifications` (`employee_certification_id`, `employee_id`, `certification_id`, `start_date`, `end_date`, `score`) VALUES
    (1, 2, 4, '2010-07-08', '2011-07-08', 290.00),
    (2, 3, 4, '2010-07-08', '2011-07-08', 290.00),
    (3, 4, 4, '2010-07-08', '2011-07-08', 290.00),
    (4, 5, 4, '2010-07-08', '2011-07-08', 290.00),
    (5, 6, 4, '2010-07-08', '2011-07-08', 290.00),
    (6,  7,  3, '2018-04-01', '2019-04-01', 320.00),
    (7,  8,  4, '2019-06-15', '2020-06-15', 280.00),
    (8,  9,  2, '2017-03-20', '2018-03-20', 350.00),
    (9,  11, 5, '2020-01-10', '2021-01-10', 270.00),
    (10, 13, 3, '2018-09-01', '2019-09-01', 310.00),
    (11, 14, 4, '2021-04-01', '2022-04-01', 300.00),
    (12, 15, 2, '2016-07-01', '2017-07-01', 330.00),
    (13, 17, 5, '2022-02-15', '2023-02-15', 250.00),
    (14, 18, 3, '2019-10-01', '2020-10-01', 305.00),
    (15, 20, 4, '2020-08-01', '2021-08-01', 290.00);
