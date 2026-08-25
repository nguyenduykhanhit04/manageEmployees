/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentListResponse.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import com.luvina.la.dto.DepartmentDTO;
import java.util.List;
import lombok.Data;

/**
 * Payload chứa thông tin phản hồi danh sách phòng ban.
 *
 * @author nguyenduykhanh2
 */
@Data
public class DepartmentListResponse {
    private int code;
    private List<DepartmentDTO> departments;

    /**
     * Khởi tạo DepartmentListResponse.
     *
     * @param code mã phản hồi
     * @param departments danh sách phòng ban
     */
    public DepartmentListResponse(int code, List<DepartmentDTO> departments) {
        this.code = code;
        this.departments = departments;
    }
}
