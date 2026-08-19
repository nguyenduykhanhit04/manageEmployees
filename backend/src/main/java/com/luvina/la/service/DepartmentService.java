package com.luvina.la.service;

import com.luvina.la.payload.DepartmentResponse;

/**
 * Interface định nghĩa các chức năng xử lý logic phòng ban.
 * Lớp này cung cấp các phương thức để lấy thông tin phòng ban từ database.
 *
 * @author nguyenduykhanh2
 * @since 1.0
 */
public interface DepartmentService {

    /**
     * Lấy danh sách tất cả phòng ban.
     *
     * @return DepartmentResponse chứa mã trạng thái và danh sách DepartmentDTO
     */
    DepartmentResponse getAllDepartments();
}

