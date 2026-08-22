/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeRepositoryCustom.java, 22/8/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.dto.EmployeeDTO;
import java.util.List;
import java.util.Map;

/**
 * Interface định nghĩa các phương thức tùy biến cho EmployeeRepository.
 *
 * @author nguyenduykhanh2
 */
public interface EmployeeRepositoryCustom {

    /**
     * Lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp đa cột theo thứ tự ưu tiên động và phân trang.
     *
     * @param employeeName tên nhân viên cần tìm kiếm
     * @param departmentId mã phòng ban cần tìm kiếm
     * @param orderParams danh sách các trường sắp xếp theo thứ tự ưu tiên
     * @param offset vị trí bắt đầu lấy dữ liệu
     * @param limit số lượng bản ghi tối đa được lấy
     * @return danh sách DTO thông tin nhân viên
     */
    List<EmployeeDTO> findDisplayEmployees(
            String employeeName,
            Long departmentId,
            Map<String, String> orderParams,
            int offset,
            int limit
    );
}
