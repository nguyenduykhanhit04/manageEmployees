/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeService.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service;

import com.luvina.la.payload.EmployeeListResponse;
import java.util.Map;

/**
 * Interface service xử lý các nghiệp vụ liên quan đến nhân viên.
 *
 * @author nguyenduykhanh2
 */
public interface EmployeeService {
    /**
     * Lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp và phân trang.
     *
     * @param employeeName tên nhân viên cần tìm kiếm
     * @param departmentId mã phòng ban cần tìm kiếm
     * @param orderParams các tham số sắp xếp
     * @param offset vị trí bắt đầu lấy dữ liệu
     * @param limit số lượng bản ghi tối đa được lấy
     * @return thông tin phản hồi chứa mã response và danh sách nhân viên
     */
    EmployeeListResponse getEmployees(String employeeName, Long departmentId, Map<String, String> orderParams, int offset, int limit);
}
