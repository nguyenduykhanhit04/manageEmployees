/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * Constants.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.config;

/**
 * Class chứa toàn bộ các hằng số cấu hình hệ thống, bảo mật và nghiệp vụ.
 *
 * @author nguyenduykhanh2
 */
public class Constants {

    protected Constants() {
    }

    /**
     * Cấu hình Hệ thống & Security (JWT, Profiles, Endpoints)
     */
    public static final String SPRING_PROFILE_DEVELOPMENT = "dev";
    public static final String SPRING_PROFILE_PRODUCTION = "prod";
    public static final boolean IS_CROSS_ALLOW = true;

    public static final String JWT_SECRET = "Luvina-Academe";
    public static final long JWT_EXPIRATION = 160 * 60 * 60; // 7 days

    // Config endpoints public (không cần authenticate)
    public static final String[] ENDPOINTS_PUBLIC = new String[] {
            "/",
            "/login/**",
            "/error/**",
            "/department/**",
            "/departments/**",
            "/certifications/**",
            "/employee",
            "/employee/**"
    };

    // Config endpoints cho USER role
    public static final String[] ENDPOINTS_WITH_ROLE = new String[] {
            "/user/**"
    };

    // Các thuộc tính người dùng đưa vào token JWT
    public static final String[] ATTRIBUTIES_TO_TOKEN = new String[] {
            "employeeId",
            "employeeName",
            "employeeLoginId",
            "employeeEmail"
    };

    /**
     * Cấu hình Nghiệp vụ Nhân viên & Phòng ban (Paging, Sorting)
     */
    // Số bản ghi mặc định mỗi trang khi lấy danh sách nhân viên.
    public static final String DEFAULT_EMPLOYEE_LIST_LIMIT = "20";

    // Giá trị sắp xếp tăng dần.
    public static final String SORT_ASC = "ASC";

    // Giá trị sắp xếp giảm dần.
    public static final String SORT_DESC = "DESC";

    // Key sắp xếp theo tên nhân viên.
    public static final String ORDER_KEY_EMPLOYEE_NAME = "ord_employee_name";

    // Key sắp xếp theo trình độ chứng chỉ.
    public static final String ORDER_KEY_CERTIFICATION_LEVEL = "ord_certification_level";

    // Key sắp xếp theo ngày hết hạn chứng chỉ.
    public static final String ORDER_KEY_END_DATE = "ord_end_date";

    // Mã thành công HTTP 200.
    public static final int CODE_SUCCESS = 200;

    // Mã lỗi hệ thống HTTP 500.
    public static final int CODE_ERROR = 500;

    /**
     * Mã Thông Báo Thành Công (MSG001 - MSG003)
     */
    // Mã thông báo thành công khi thêm nhân viên.
    public static final String MSG_ADD_SUCCESS = "MSG001";

    // Mã thông báo thành công khi cập nhật nhân viên.
    public static final String MSG_EDIT_SUCCESS = "MSG002";

    // Mã thông báo thành công khi xóa nhân viên.
    public static final String MSG_DELETE_SUCCESS = "MSG003";

    /**
     * Mã Lỗi Nghiệp Vụ Toàn Hệ Thống (ER001 - ER023)
     */
    // Mã lỗi bắt buộc nhập.
    public static final String ER001 = "ER001";

    // Mã lỗi bắt buộc chọn.
    public static final String ER002 = "ER002";

    // Mã lỗi dữ liệu đã tồn tại.
    public static final String ER003 = "ER003";

    // Mã lỗi dữ liệu không tồn tại.
    public static final String ER004 = "ER004";

    // Mã lỗi sai định dạng email.
    public static final String ER005 = "ER005";

    // Mã lỗi vượt quá độ dài tối đa.
    public static final String ER006 = "ER006";

    // Mã lỗi độ dài không hợp lệ.
    public static final String ER007 = "ER007";

    // Mã lỗi chỉ chứa ký tự half-size.
    public static final String ER008 = "ER008";

    // Mã lỗi phải là ký tự Katakana.
    public static final String ER009 = "ER009";

    // Mã lỗi ngày không hợp lệ.
    public static final String ER011 = "ER011";

    // Mã lỗi ngày kết thúc nhỏ hơn hoặc bằng ngày bắt đầu.
    public static final String ER012 = "ER012";

    // Mã lỗi nhân viên không tồn tại khi lấy chi tiết.
    public static final String ER013 = "ER013";

    // Mã lỗi nhân viên không tồn tại khi xóa.
    public static final String ER014 = "ER014";

    // Mã lỗi hệ thống hoặc cơ sở dữ liệu.
    public static final String ER015 = "ER015";

    // Mã lỗi ký tự half-size hoặc tham số phân trang không hợp lệ.
    public static final String ER018 = "ER018";

    // Mã lỗi sai định dạng Login ID.
    public static final String ER019 = "ER019";

    // Mã lỗi tham số sắp xếp không hợp lệ.
    public static final String ER021 = "ER021";

    // Mã lỗi hệ thống khi truy vấn cơ sở dữ liệu phòng ban hoặc chứng chỉ.
    public static final String ER023 = "ER023";

    // Alias mã lỗi tham số phân trang không hợp lệ.
    public static final String ERROR_CODE_INVALID_PAGING = ER018;

    // Alias mã lỗi tham số sắp xếp không hợp lệ.
    public static final String ERROR_CODE_INVALID_SORT = ER021;

    // Alias mã lỗi tên nhân viên không hợp lệ.
    public static final String ERROR_CODE_INVALID_EMPLOYEE_NAME = ER006;

    // Giá trị tối đa hợp lệ cho tên nhân viên.
    public static final int MAX_EMPLOYEE_NAME_LENGTH = 125;

    /**
     * Tên Nhãn (Field Labels) Dùng Cho Thông Báo Lỗi
     */
    // Nhãn tên tài khoản.
    public static final String LABEL_ACCOUNT_NAME = "アカウント名";

    // Nhãn tên nhân viên.
    public static final String LABEL_EMPLOYEE_NAME = "氏名";

    // Nhãn tên Katakana của nhân viên.
    public static final String LABEL_EMPLOYEE_NAME_KANA = "カタカナ氏名";

    // Nhãn ngày sinh.
    public static final String LABEL_BIRTH_DATE = "生年月日";

    // Nhãn địa chỉ email.
    public static final String LABEL_EMAIL = "メールアドレス";

    // Nhãn số điện thoại.
    public static final String LABEL_TELEPHONE = "電話番号";

    // Nhãn mật khẩu.
    public static final String LABEL_PASSWORD = "パスワード";

    // Nhãn nhóm.
    public static final String LABEL_GROUP = "グループ";

    // Nhãn chứng chỉ.
    public static final String LABEL_CERTIFICATION = "資格";

    // Nhãn ngày cấp chứng chỉ.
    public static final String LABEL_CERT_START_DATE = "資格交付日";

    // Nhãn ngày hết hạn chứng chỉ.
    public static final String LABEL_CERT_END_DATE = "失効日";

    // Nhãn điểm.
    public static final String LABEL_SCORE = "点数";

    // Nhãn mã định danh.
    public static final String LABEL_ID = "ID";

    // Nhãn tham số offset dùng cho phân trang.
    public static final String OFFSET_PARAM_LABEL = "オフセット";

    // Nhãn tham số limit dùng cho phân trang.
    public static final String LIMIT_PARAM_LABEL = "リミット";

    // Nhãn tham số tên nhân viên.
    public static final String EMPLOYEE_NAME_PARAM_LABEL = LABEL_EMPLOYEE_NAME;
}
