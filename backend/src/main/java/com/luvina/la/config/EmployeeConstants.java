package com.luvina.la.config;

public class EmployeeConstants {
    private EmployeeConstants() {
    }

    /** Số bản ghi mặc định mỗi trang khi lấy danh sách nhân viên. */
    public static final String DEFAULT_EMPLOYEE_LIST_LIMIT = "20";

    /** Giá trị sắp xếp tăng dần. */
    public static final String SORT_ASC = "ASC";

    /** Giá trị sắp xếp giảm dần. */
    public static final String SORT_DESC = "DESC";

    /** Key sắp xếp theo tên nhân viên. */
    public static final String ORDER_KEY_EMPLOYEE_NAME = "ord_employee_name";

    /** Key sắp xếp theo trình độ chứng chỉ. */
    public static final String ORDER_KEY_CERTIFICATION_LEVEL = "ord_certification_level";

    /** Key sắp xếp theo ngày hết hạn chứng chỉ. */
    public static final String ORDER_KEY_END_DATE = "ord_end_date";

    /** Mã thành công HTTP 200. */
    public static final int CODE_SUCCESS = 200;

    /** Mã lỗi hệ thống HTTP 500. */
    public static final int CODE_ERROR = 500;

    /** Thông báo thành công khi thêm nhân viên. */
    public static final String MSG_ADD_SUCCESS = "MSG001";

    /** Thông báo thành công khi cập nhật nhân viên. */
    public static final String MSG_EDIT_SUCCESS = "MSG002";

    /** Thông báo thành công khi xóa nhân viên. */
    public static final String MSG_DELETE_SUCCESS = "MSG003";

    public static final String ER001 = "ER001"; // Bắt buộc nhập
    public static final String ER002 = "ER002"; // Bắt buộc chọn
    public static final String ER003 = "ER003"; // Đã tồn tại (Duplicate)
    public static final String ER004 = "ER004"; // Không tồn tại (Not Found - Foreign Key)
    public static final String ER005 = "ER005"; // Sai format email
    public static final String ER006 = "ER006"; // Vượt quá độ dài tối đa (MaxLength)
    public static final String ER007 = "ER007"; // Độ dài không hợp lệ (Range)
    public static final String ER008 = "ER008"; // Chỉ chứa ký tự half-size (1 byte)
    public static final String ER009 = "ER009"; // Phải là ký tự Katakana
    public static final String ER012 = "ER012"; // Ngày kết thúc <= Ngày bắt đầu
    public static final String ER013 = "ER013"; // Nhân viên không tồn tại (Get Detail)
    public static final String ER014 = "ER014"; // Nhân viên không tồn tại (Delete)
    public static final String ER015 = "ER015"; // Lỗi hệ thống/Database
    public static final String ER018 = "ER018"; // Phải là ký tự half-size / Paging invalid
    public static final String ER019 = "ER019"; // Sai format Login ID
    public static final String ER021 = "ER021"; // Tham số sắp xếp không hợp lệ
    public static final String ER023 = "ER023"; // Lỗi hệ thống khi truy vấn database (Department/Certification)

    /** Alias cho các mã lỗi cụ thể để code dễ đọc hơn */
    public static final String ERROR_CODE_INVALID_PAGING = ER018;
    public static final String ERROR_CODE_INVALID_SORT = ER021;
    public static final String ERROR_CODE_INVALID_EMPLOYEE_NAME = ER006;

    /** Giá trị tối đa hợp lệ cho tên nhân viên. */
    public static final int MAX_EMPLOYEE_NAME_LENGTH = 125;

    public static final String LABEL_ACCOUNT_NAME       = "アカウント名";
    public static final String LABEL_EMPLOYEE_NAME      = "氏名";
    public static final String LABEL_EMPLOYEE_NAME_KANA = "カタカナ氏名";
    public static final String LABEL_BIRTH_DATE         = "生年月日";
    public static final String LABEL_EMAIL              = "メールアドレス";
    public static final String LABEL_TELEPHONE          = "電話番号";
    public static final String LABEL_PASSWORD           = "パスワード";
    public static final String LABEL_GROUP              = "グループ";
    public static final String LABEL_CERTIFICATION      = "資格";
    public static final String LABEL_CERT_START_DATE    = "資格交付日";
    public static final String LABEL_CERT_END_DATE      = "失効日";
    public static final String LABEL_SCORE              = "点数";
    public static final String LABEL_ID                 = "ID";

    /** Alias nhãn dùng cho phân trang */
    public static final String OFFSET_PARAM_LABEL = "オフセット";
    public static final String LIMIT_PARAM_LABEL = "リミット";
    public static final String EMPLOYEE_NAME_PARAM_LABEL = LABEL_EMPLOYEE_NAME;
}
