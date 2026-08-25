/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeServiceImpl.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.validator.EmployeeValidator;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    private final EmployeeValidator employeeValidator;

    /**
     * Khởi tạo EmployeeServiceImpl với EmployeeRepository và EmployeeValidator.
     *
     * @param employeeRepository repository thao tác với dữ liệu nhân viên
     * @param employeeValidator validator kiểm tra tính hợp lệ của dữ liệu đầu vào
     */
    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            EmployeeValidator employeeValidator) {
        this.employeeRepository = employeeRepository;
        this.employeeValidator = employeeValidator;
    }

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
    @Override
    @Transactional(readOnly = true)
    public EmployeeListResponse getEmployees(
            String employeeName,
            Long departmentId,
            Map<String, String> orderParams,
            int offset,
            int limit) {

        // 1. Kiểm tra tính hợp lệ của tham số đầu vào thông qua Validator
        employeeValidator.validateGetEmployees(employeeName, offset, limit, orderParams);

        // 2. Escape các ký tự đặc biệt cho điều kiện LIKE
        String escapedName = escapeLikePattern(employeeName);

        // 3. Đếm tổng số bản ghi thỏa mãn điều kiện
        long totalRecords = employeeRepository.countDisplayEmployees(
                escapedName,
                departmentId);

        if (totalRecords <= 0) {
            return new EmployeeListResponse(
                    Constants.CODE_SUCCESS,
                    0L,
                    new ArrayList<>());
        }

        // 4. Lấy danh sách nhân viên từ repository tùy biến theo thứ tự ưu tiên sắp xếp động
        List<EmployeeDTO> employees = employeeRepository.findDisplayEmployees(
                escapedName,
                departmentId,
                orderParams,
                offset,
                limit);

        // 5. Trả về kết quả danh sách nhân viên và tổng số bản ghi
        return new EmployeeListResponse(
                Constants.CODE_SUCCESS,
                totalRecords,
                employees);
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