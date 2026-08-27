/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeServiceImpl.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation service xử lý các nghiệp vụ liên quan đến nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    /**
     * Khởi tạo EmployeeServiceImpl với EmployeeRepository.
     *
     * @param employeeRepository repository thao tác với dữ liệu nhân viên
     */
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

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
    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeDTO> getEmployees(
            String employeeName,
            Long departmentId,
            Map<String, String> orderParams,
            int offset,
            int limit) {

        int pageSize = limit > 0 ? limit : 20;
        int pageIndex = offset / pageSize;
        Pageable pageable = PageRequest.of(pageIndex, pageSize);

        // 1. Escape các ký tự đặc biệt cho điều kiện LIKE
        String escapedName = escapeLikePattern(employeeName);

        // 2. Đếm tổng số bản ghi thỏa mãn điều kiện
        long totalRecords = employeeRepository.countDisplayEmployees(
                escapedName,
                departmentId);

        if (totalRecords <= 0) {
            return new PageImpl<>(new ArrayList<>(), pageable, 0L);
        }

        // 3. Lấy danh sách nhân viên từ repository tùy biến theo thứ tự ưu tiên sắp xếp động
        List<EmployeeDTO> employees = employeeRepository.findDisplayEmployees(
                escapedName,
                departmentId,
                orderParams,
                offset,
                limit);

        // 4. Trả về kết quả phân trang chuẩn của Spring Data
        return new PageImpl<>(employees, pageable, totalRecords);
    }

    /**
     * Escape các ký tự đặc biệt trong từ khóa tìm kiếm cho điều kiện LIKE.
     *
     * @param keyword từ khóa tìm kiếm
     * @return từ khóa đã được escape
     */
    private String escapeLikePattern(String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return keyword;
        }

        return keyword.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }
}