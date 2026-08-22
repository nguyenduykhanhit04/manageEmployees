/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * BusinessException.java, 22/8/2026 nguyenduykhanh2
 */
package com.luvina.la.exception;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;

/**
 * Exception tùy chỉnh dùng để ném các lỗi nghiệp vụ trong hệ thống.
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
}
