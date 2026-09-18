/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * BusinessException.java, 22/8/2026 nguyenduykhanh2
 */
package com.luvina.la.exception;

import com.luvina.la.config.Constants;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.Getter;

/**
 * Exception tùy chỉnh dùng để ném các lỗi nghiệp vụ trong hệ thống.
 * Hỗ trợ tạo lỗi tham số hóa chuẩn TKAPI với cả List và Varargs.
 *
 * @author nguyenduykhanh2
 */
@Getter
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final String errorCode;
    private final List<String> params;

    /**
     * Khởi tạo BusinessException với mã lỗi.
     *
     * @param errorCode mã lỗi nghiệp vụ
     */
    public BusinessException(String errorCode) {
        super(errorCode);
        this.errorCode = errorCode;
        this.params = new ArrayList<>();
    }

    /**
     * Khởi tạo BusinessException với mã lỗi và danh sách tham số thông báo lỗi.
     *
     * @param errorCode mã lỗi nghiệp vụ
     * @param params danh sách tham số hiển thị trong câu thông báo lỗi
     */
    public BusinessException(String errorCode, List<String> params) {
        super(errorCode);
        this.errorCode = errorCode;
        this.params = params != null ? params : new ArrayList<>();
    }

    /**
     * Khởi tạo BusinessException với mã lỗi và các tham số.
     *
     * @param errorCode mã lỗi nghiệp vụ
     * @param params các tham số hiển thị trong câu thông báo lỗi
     */
    public BusinessException(String errorCode, String... params) {
        super(errorCode);
        this.errorCode = errorCode;
        this.params = (params != null && params.length > 0) ? Arrays.asList(params) : new ArrayList<>();
    }

    /**
     * Tạo đối tượng BusinessException với mã lỗi và các tham số.
     *
     * @param errorCode mã lỗi nghiệp vụ
     * @param params các tham số hiển thị trong câu thông báo lỗi
     * @return đối tượng BusinessException
     */
    public static BusinessException of(String errorCode, String... params) {
        return new BusinessException(errorCode, params);
    }

    /**
     * Tạo ngoại lệ lỗi bắt buộc nhập trường (ER001).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @return đối tượng BusinessException
     */
    public static BusinessException required(String fieldLabel) {
        return new BusinessException(Constants.ER001, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi bắt buộc chọn trường (ER002).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @return đối tượng BusinessException
     */
    public static BusinessException requiredSelect(String fieldLabel) {
        return new BusinessException(Constants.ER002, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi dữ liệu đã tồn tại (ER003).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @return đối tượng BusinessException
     */
    public static BusinessException alreadyExists(String fieldLabel) {
        return new BusinessException(Constants.ER003, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi bản ghi không tồn tại (ER004).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @return đối tượng BusinessException
     */
    public static BusinessException notFound(String fieldLabel) {
        return new BusinessException(Constants.ER004, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi sai định dạng (ER005).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @param format định dạng mong đợi (ví dụ "email")
     * @return đối tượng BusinessException
     */
    public static BusinessException invalidFormat(String fieldLabel, String format) {
        return new BusinessException(Constants.ER005, fieldLabel, format);
    }

    /**
     * Tạo ngoại lệ lỗi vượt quá độ dài tối đa (ER006).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @param maxLength độ dài tối đa cho phép
     * @return đối tượng BusinessException
     */
    public static BusinessException maxLength(String fieldLabel, int maxLength) {
        return new BusinessException(Constants.ER006, fieldLabel, String.valueOf(maxLength));
    }

    /**
     * Tạo ngoại lệ lỗi độ dài không nằm trong khoảng cho phép (ER007).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @param min độ dài tối thiểu
     * @param max độ dài tối đa
     * @return đối tượng BusinessException
     */
    public static BusinessException range(String fieldLabel, int min, int max) {
        return new BusinessException(Constants.ER007, fieldLabel, String.valueOf(min), String.valueOf(max));
    }

    /**
     * Tạo ngoại lệ lỗi chỉ cho phép ký tự half-size (ER008).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @return đối tượng BusinessException
     */
    public static BusinessException halfSize(String fieldLabel) {
        return new BusinessException(Constants.ER008, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi bắt buộc phải là ký tự Katakana (ER009).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @return đối tượng BusinessException
     */
    public static BusinessException katakana(String fieldLabel) {
        return new BusinessException(Constants.ER009, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi ngày tháng không hợp lệ (ER011).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @return đối tượng BusinessException
     */
    public static BusinessException invalidDate(String fieldLabel) {
        return new BusinessException(Constants.ER011, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi ngày kết thúc nhỏ hơn hoặc bằng ngày bắt đầu (ER012).
     *
     * @param endDateLabel nhãn của trường ngày kết thúc
     * @param startDateLabel nhãn của trường ngày bắt đầu
     * @return đối tượng BusinessException
     */
    public static BusinessException endDateBeforeStartDate(String endDateLabel, String startDateLabel) {
        return new BusinessException(Constants.ER012, endDateLabel, startDateLabel);
    }

    /**
     * Tạo ngoại lệ không tìm thấy nhân viên khi xem chi tiết hoặc cập nhật (ER013).
     *
     * @param fieldLabel nhãn của trường dữ liệu (thường là LABEL_ID)
     * @return đối tượng BusinessException
     */
    public static BusinessException employeeNotFound(String fieldLabel) {
        return new BusinessException(Constants.ER013, fieldLabel);
    }

    /**
     * Tạo ngoại lệ không tìm thấy nhân viên khi thực hiện xóa (ER014).
     *
     * @param fieldLabel nhãn của trường dữ liệu (thường là LABEL_ID)
     * @return đối tượng BusinessException
     */
    public static BusinessException employeeDeleteNotFound(String fieldLabel) {
        return new BusinessException(Constants.ER014, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi hệ thống nghiêm trọng (ER015).
     *
     * @return đối tượng BusinessException
     */
    public static BusinessException systemError() {
        return new BusinessException(Constants.ER015);
    }

    /**
     * Tạo ngoại lệ tham số phân trang hoặc điểm số không hợp lệ (ER018).
     *
     * @param fieldLabel nhãn của trường hoặc tham số
     * @return đối tượng BusinessException
     */
    public static BusinessException invalidPaging(String fieldLabel) {
        return new BusinessException(Constants.ER018, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi định dạng tên đăng nhập (ER019).
     *
     * @param fieldLabel nhãn của trường dữ liệu
     * @return đối tượng BusinessException
     */
    public static BusinessException invalidLoginId(String fieldLabel) {
        return new BusinessException(Constants.ER019, fieldLabel);
    }

    /**
     * Tạo ngoại lệ lỗi không được xóa người dùng có quyền Quản trị viên (ER020).
     *
     * @return đối tượng BusinessException
     */
    public static BusinessException cannotDeleteAdmin() {
        return new BusinessException(Constants.ER020);
    }

    /**
     * Tạo ngoại lệ lỗi tham số sắp xếp không hợp lệ (ER021).
     *
     * @param paramLabel nhãn của tham số sắp xếp
     * @return đối tượng BusinessException
     */
    public static BusinessException invalidSort(String paramLabel) {
        return new BusinessException(Constants.ER021, paramLabel);
    }
}
