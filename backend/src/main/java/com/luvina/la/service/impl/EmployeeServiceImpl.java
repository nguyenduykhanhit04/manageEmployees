package com.luvina.la.service.impl;

import com.luvina.la.config.EmployeeConstants;
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

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeListResponse getEmployees(String employeeName, Long departmentId, Map<String, String> orderParams, int offset, int limit) {

        // 1. Validate Phân trang (ER018)
        if (offset < 0 || limit <= 0) {
            return new EmployeeListResponse(EmployeeConstants.CODE_ERROR, new ApiErrorMessage(EmployeeConstants.ERROR_CODE_INVALID_PAGING, List.of("offset/limit")));
        }

        // 2. Validate Độ dài tên (ER006)
        if (employeeName != null && employeeName.length() >= EmployeeConstants.MAX_EMPLOYEE_NAME_LENGTH) {
            return new EmployeeListResponse(EmployeeConstants.CODE_ERROR, new ApiErrorMessage(EmployeeConstants.ERROR_CODE_INVALID_EMPLOYEE_NAME, List.of("氏名", String.valueOf(EmployeeConstants.MAX_EMPLOYEE_NAME_LENGTH))));
        }

        // 3. Validate Sort params (ER021)
        for (Map.Entry<String, String> entry : orderParams.entrySet()) {
            String val = entry.getValue();
            if (!EmployeeConstants.SORT_ASC.equalsIgnoreCase(val) && !EmployeeConstants.SORT_DESC.equalsIgnoreCase(val)) {
                return new EmployeeListResponse(EmployeeConstants.CODE_ERROR, new ApiErrorMessage(EmployeeConstants.ERROR_CODE_INVALID_SORT, List.of(entry.getKey())));
            }
        }

        // 4. Escape ký tự đặc biệt cho LIKE
        String escapedName = escapeLikePattern(employeeName);

        // 5. Trích xuất thứ tự sort (mặc định ASC)
        String ordName = orderParams.getOrDefault(EmployeeConstants.ORDER_KEY_EMPLOYEE_NAME, EmployeeConstants.SORT_ASC);
        String ordCert = orderParams.getOrDefault(EmployeeConstants.ORDER_KEY_CERTIFICATION_LEVEL, EmployeeConstants.SORT_ASC);
        String ordEndDate = orderParams.getOrDefault(EmployeeConstants.ORDER_KEY_END_DATE, EmployeeConstants.SORT_ASC);

        // 6. Đếm tổng số bản ghi
        long totalRecords = employeeRepository.countDisplayEmployees(escapedName, departmentId);
        if (totalRecords <= 0) {
            return new EmployeeListResponse(EmployeeConstants.CODE_SUCCESS, 0L, new ArrayList<>());
        }

        // 7. Lấy danh sách Projection từ Repository
        List<EmployeeDisplayDTO> projections = employeeRepository.findDisplayEmployees(
                escapedName, departmentId,
                ordName, ordCert, ordEndDate,
                offset, limit
        );

        // 8. Map sang DTO
        List<EmployeeDTO> employees = new ArrayList<>();
        for (EmployeeDisplayDTO p : projections) {
            employees.add(new EmployeeDTO(
                    p.getEmployeeId(),
                    p.getEmployeeName(),
                    p.getEmployeeBirthDate(),
                    p.getDepartmentName(),
                    p.getEmployeeEmail(),
                    p.getEmployeeTelephone(),
                    p.getCertificationName(),
                    p.getEndDate(),
                    p.getScore()
            ));
        }

        return new EmployeeListResponse(EmployeeConstants.CODE_SUCCESS, totalRecords, employees);
    }

    private String escapeLikePattern(String keyword) {
        if (keyword == null || keyword.isEmpty()) return keyword;
        return keyword.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }
}
