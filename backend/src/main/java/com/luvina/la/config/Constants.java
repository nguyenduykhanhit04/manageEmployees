/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * Constants.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.config;

import java.time.format.DateTimeFormatter;

/**
 * Class chứa toàn bộ các hằng số cấu hình hệ thống, bảo mật và nghiệp vụ.
 *
 * @author nguyenduykhanh2
 */
public class Constants {

    protected Constants() {
    }

    /** Profile môi trường phát triển */
    public static final String SPRING_PROFILE_DEVELOPMENT = "dev";

    /** Profile môi trường sản xuất */
    public static final String SPRING_PROFILE_PRODUCTION = "prod";

    /** Cho phép CORS cross-origin */
    public static final boolean IS_CROSS_ALLOW = true;

    /** Secret key dùng để ký JWT */
    public static final String JWT_SECRET = "Luvina-Academe";

    /** Thời gian hết hạn JWT (đơn vị: giây) — 160 giờ */
    public static final long JWT_EXPIRATION = 160 * 60 * 60;

    /** Quyền Admin (role = 0) */
    public static final int ROLE_ADMIN = 0;

    /** Quyền User thông thường (role = 1) */
    public static final int ROLE_USER = 1;

    /** Danh sách endpoint công khai không cần xác thực */
    public static final String[] ENDPOINTS_PUBLIC = new String[] {
            "/",
            "/login/**",
            "/error/**",
            "/department/**",
            "/employee",
            "/employee/**"
    };

    /** Danh sách endpoint yêu cầu quyền USER */
    public static final String[] ENDPOINTS_WITH_ROLE = new String[] {
            "/user/**"
    };

    /** Các thuộc tính người dùng đưa vào token JWT */
    public static final String[] ATTRIBUTIES_TO_TOKEN = new String[] {
            "employeeId",
            "employeeName",
            "employeeLoginId",
            "employeeEmail"
    };

    /** Số bản ghi mặc định mỗi trang khi lấy danh sách nhân viên */
    public static final String DEFAULT_EMPLOYEE_LIST_LIMIT = "20";

    /** Số bản ghi mặc định mỗi trang (kiểu int) */
    public static final int DEFAULT_PAGING_LIMIT = 20;

    /** Vị trí offset mặc định khi phân trang */
    public static final int DEFAULT_PAGING_OFFSET = 0;

    /** Giá trị sắp xếp tăng dần */
    public static final String SORT_ASC = "ASC";

    /** Giá trị sắp xếp giảm dần */
    public static final String SORT_DESC = "DESC";

    /** Key sắp xếp theo tên nhân viên */
    public static final String ORDER_KEY_EMPLOYEE_NAME = "ord_employee_name";

    /** Key sắp xếp theo tên chứng chỉ tiếng Nhật */
    public static final String ORDER_KEY_CERTIFICATION_NAME = "ord_certification_name";

    /** Key sắp xếp theo ngày hết hạn chứng chỉ */
    public static final String ORDER_KEY_END_DATE = "ord_end_date";

    /** Độ dài tối đa tên đăng nhập */
    public static final int MAX_LOGIN_ID_LENGTH = 50;

    /** Độ dài tối đa tên nhân viên */
    public static final int MAX_EMPLOYEE_NAME_LENGTH = 125;

    /** Độ dài tối đa tên Katakana nhân viên */
    public static final int MAX_EMPLOYEE_NAME_KANA_LENGTH = 125;

    /** Độ dài tối đa địa chỉ email */
    public static final int MAX_EMAIL_LENGTH = 125;

    /** Độ dài tối đa số điện thoại */
    public static final int MAX_TELEPHONE_LENGTH = 50;

    /** Độ dài tối thiểu mật khẩu */
    public static final int MIN_PASSWORD_LENGTH = 8;

    /** Độ dài tối đa mật khẩu */
    public static final int MAX_PASSWORD_LENGTH = 50;

    /** Mã thành công HTTP 200 */
    public static final int CODE_SUCCESS = 200;

    /** Mã lỗi hệ thống HTTP 500 */
    public static final int CODE_ERROR = 500;

    /** Thông báo thêm nhân viên thành công */
    public static final String MSG_ADD_SUCCESS = "MSG001";

    /** Thông báo cập nhật nhân viên thành công */
    public static final String MSG_EDIT_SUCCESS = "MSG002";

    /** Thông báo xóa nhân viên thành công */
    public static final String MSG_DELETE_SUCCESS = "MSG003";

    /** Bắt buộc nhập trường */
    public static final String ER001 = "ER001";

    /** Bắt buộc chọn trường */
    public static final String ER002 = "ER002";

    /** Dữ liệu đã tồn tại */
    public static final String ER003 = "ER003";

    /** Bản ghi không tồn tại */
    public static final String ER004 = "ER004";

    /** Sai định dạng */
    public static final String ER005 = "ER005";

    /** Vượt quá độ dài tối đa */
    public static final String ER006 = "ER006";

    /** Độ dài không nằm trong khoảng cho phép */
    public static final String ER007 = "ER007";

    /** Chỉ cho phép ký tự half-size */
    public static final String ER008 = "ER008";

    /** Bắt buộc phải là ký tự Katakana */
    public static final String ER009 = "ER009";

    /** Ngày tháng không hợp lệ */
    public static final String ER011 = "ER011";

    /** Ngày kết thúc nhỏ hơn hoặc bằng ngày bắt đầu */
    public static final String ER012 = "ER012";

    /** Nhân viên không tồn tại khi xem chi tiết / cập nhật */
    public static final String ER013 = "ER013";

    /** Nhân viên không tồn tại khi xóa */
    public static final String ER014 = "ER014";

    /** Lỗi hệ thống hoặc cơ sở dữ liệu */
    public static final String ER015 = "ER015";

    /** Tham số phân trang không hợp lệ */
    public static final String ER018 = "ER018";

    /** Sai định dạng Login ID */
    public static final String ER019 = "ER019";

    /** Không được xóa người dùng quản trị viên (Admin) */
    public static final String ER020 = "ER020";

    /** Tham số sắp xếp không hợp lệ */
    public static final String ER021 = "ER021";

    /** Lỗi khi truy vấn master data (phòng ban hoặc chứng chỉ) */
    public static final String ER023 = "ER023";

    /** Alias: mã lỗi tham số phân trang không hợp lệ */
    public static final String ERROR_CODE_INVALID_PAGING = ER018;

    /** Alias: mã lỗi tham số sắp xếp không hợp lệ */
    public static final String ERROR_CODE_INVALID_SORT = ER021;

    /** Alias: mã lỗi tên nhân viên vượt quá độ dài tối đa */
    public static final String ERROR_CODE_INVALID_EMPLOYEE_NAME = ER006;

    /** Nhãn tên tài khoản */
    public static final String LABEL_ACCOUNT_NAME = "アカウント名";

    /** Nhãn tên nhân viên */
    public static final String LABEL_EMPLOYEE_NAME = "氏名";

    /** Nhãn tên Katakana nhân viên */
    public static final String LABEL_EMPLOYEE_NAME_KANA = "カタカナ氏名";

    /** Nhãn ngày sinh */
    public static final String LABEL_BIRTH_DATE = "生年月日";

    /** Nhãn địa chỉ email */
    public static final String LABEL_EMAIL = "メールアドレス";

    /** Nhãn số điện thoại */
    public static final String LABEL_TELEPHONE = "電話番号";

    /** Nhãn mật khẩu */
    public static final String LABEL_PASSWORD = "パスワード";

    /** Nhãn nhóm / phòng ban */
    public static final String LABEL_GROUP = "グループ";

    /** Nhãn chứng chỉ */
    public static final String LABEL_CERTIFICATION = "資格";

    /** Nhãn ngày cấp chứng chỉ */
    public static final String LABEL_CERT_START_DATE = "資格交付日";

    /** Nhãn ngày hết hạn chứng chỉ */
    public static final String LABEL_CERT_END_DATE = "失効日";

    /** Nhãn điểm chứng chỉ */
    public static final String LABEL_SCORE = "点数";

    /** Nhãn mã định danh */
    public static final String LABEL_ID = "ＩＤ";

    /** Nhãn tham số offset dùng cho phân trang */
    public static final String OFFSET_PARAM_LABEL = "オフセット";

    /** Nhãn tham số limit dùng cho phân trang */
    public static final String LIMIT_PARAM_LABEL = "リミット";

    /** Alias nhãn tên nhân viên dùng cho tham số tìm kiếm */
    public static final String EMPLOYEE_NAME_PARAM_LABEL = LABEL_EMPLOYEE_NAME;

    /** Chuỗi định dạng ngày tháng mặc định */
    public static final String DEFAULT_DATE_FORMAT = "yyyy/MM/dd";

    /** Formatter ngày tháng mặc định toàn hệ thống */
    public static final DateTimeFormatter DEFAULT_DATE_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT);
}
