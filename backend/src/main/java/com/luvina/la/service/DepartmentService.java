/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentService.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service;

import com.luvina.la.payload.DepartmentListResponse;

/**
 * Interface service xử lý các nghiệp vụ liên quan đến phòng ban.
 *
 * @author nguyenduykhanh2
 */
public interface DepartmentService {
    /**
     * Lấy toàn bộ danh sách phòng ban.
     *
     * @return danh sách phòng ban
     */
    DepartmentListResponse getAllDepartments();
}
