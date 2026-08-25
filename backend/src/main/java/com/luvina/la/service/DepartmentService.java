/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentService.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.service;

import com.luvina.la.payload.response.DepartmentListResponse;

/**
 * Interface định nghĩa các phương thức xử lý nghiệp vụ liên quan đến phòng ban.
 *
 * @author nguyenduykhanh2
 */
public interface DepartmentService {

    /**
     * Lấy toàn bộ danh sách phòng ban.
     *
     * @return phản hồi chứa danh sách phòng ban
     */
    DepartmentListResponse getAllDepartments();
}
