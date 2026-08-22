/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeServiceImpl.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.dto.EmployeeDisplayDTO;
import com.luvina.la.payload.ApiErrorMessage;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
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

        // Kiểm tra điều kiện phân trang.
        if (offset < 0 || limit <= 0) {
            return new EmployeeListResponse(
                    Constants.CODE_ERROR,
                    new ApiErrorMessage(
                            Constants.ERROR_CODE_INVALID_PAGING,
                            List.of("offset/limit")));
        }

        // Kiểm tra độ dài tên nhân viên.
        if (employeeName != null
                && employeeName.length() >= Constants.MAX_EMPLOYEE_NAME_LENGTH) {
            return new EmployeeListResponse(
                    Constants.CODE_ERROR,
                    new ApiErrorMessage(
                            Constants.ERROR_CODE_INVALID_EMPLOYEE_NAME,
                            List.of(
                                    "氏名",
                                    String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH))));
        }

        // Kiểm tra giá trị các tham số sắp xếp.
        for (Map.Entry<String, String> entry : orderParams.entrySet()) {
            String value = entry.getValue();

            if (!Constants.SORT_ASC.equalsIgnoreCase(value)
                    && !Constants.SORT_DESC.equalsIgnoreCase(value)) {
                return new EmployeeListResponse(
                        Constants.CODE_ERROR,
                        new ApiErrorMessage(
                                Constants.ERROR_CODE_INVALID_SORT,
                                List.of(entry.getKey())));
            }
        }

        // Escape các ký tự đặc biệt cho điều kiện LIKE.
        String escapedName = escapeLikePattern(employeeName);

        // Lấy thứ tự sắp xếp theo tham số truyền vào.
        String ordName = orderParams.get(Constants.ORDER_KEY_EMPLOYEE_NAME);
        String ordCert = orderParams.get(Constants.ORDER_KEY_CERTIFICATION_LEVEL);
        if (ordCert == null) {
            ordCert = orderParams.get("ord_certification_name");
        }
        String ordEndDate = orderParams.get(Constants.ORDER_KEY_END_DATE);

        // Đếm tổng số bản ghi.
        long totalRecords = employeeRepository.countDisplayEmployees(
                escapedName,
                departmentId);

        if (totalRecords <= 0) {
            return new EmployeeListResponse(
                    Constants.CODE_SUCCESS,
                    0L,
                    new ArrayList<>());
        }

        // Lấy danh sách nhân viên từ repository tùy biến theo thứ tự ưu tiên sắp xếp động.
        List<EmployeeDTO> employees = employeeRepository.findDisplayEmployees(
                escapedName,
                departmentId,
                orderParams,
                offset,
                limit);

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