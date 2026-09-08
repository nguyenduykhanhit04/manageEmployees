/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeService.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.service;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.request.EmployeeSaveRequest;
import com.luvina.la.payload.response.EmployeeDetailResponse;
import java.util.Map;
import org.springframework.data.domain.Page;

/**
 * Interface định nghĩa các phương thức xử lý nghiệp vụ liên quan đến nhân viên.
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
     * @return đối tượng Page chứa danh sách nhân viên và thông tin phân trang
     */
    Page<EmployeeDTO> getEmployees(
            String employeeName,
            Long departmentId,
            Map<String, String> orderParams,
            int offset,
            int limit);

    /**
     * Thêm mới một nhân viên vào cơ sở dữ liệu (kèm chứng chỉ tiếng Nhật nếu có).
     *
     * @param request đối tượng chứa thông tin nhân viên cần thêm mới
     * @return mã định danh employeeId của nhân viên vừa được tạo
     */
    Long createEmployee(EmployeeSaveRequest request);

    /**
     * Lấy thông tin chi tiết một nhân viên theo mã employeeId.
     *
     * @param employeeId mã định danh nhân viên
     * @return đối tượng EmployeeDetailResponse chứa toàn bộ thông tin chi tiết nhân viên
     */
    EmployeeDetailResponse getEmployeeDetail(Long employeeId);
}

