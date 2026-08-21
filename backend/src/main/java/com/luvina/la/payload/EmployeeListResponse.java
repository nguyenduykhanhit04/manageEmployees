/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeListResponse.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.payload;

import com.luvina.la.dto.EmployeeDTO;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload chứa thông tin phản hồi danh sách nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
public class EmployeeListResponse {
    private int code;
    private long totalRecords;
    private List<EmployeeDTO> employees = new ArrayList<>();
    private ApiErrorMessage message;

    /**
     * Khởi tạo EmployeeListResponse cho trường hợp phản hồi thành công.
     *
     * @param code mã phản hồi
     * @param totalRecords tổng số bản ghi
     * @param employees danh sách nhân viên
     */
    public EmployeeListResponse(int code, long totalRecords, List<EmployeeDTO> employees) {
        this.code = code;
        this.totalRecords = totalRecords;
        this.employees = employees;
    }

    /**
     * Khởi tạo EmployeeListResponse cho trường hợp phản hồi lỗi validation.
     *
     * @param code mã phản hồi
     * @param message thông tin lỗi
     */
    public EmployeeListResponse(int code, ApiErrorMessage message) {
        this.code = code;
        this.message = message;
    }
}
