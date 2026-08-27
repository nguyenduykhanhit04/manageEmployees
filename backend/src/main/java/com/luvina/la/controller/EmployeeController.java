/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeController.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.response.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.validator.EmployeeValidator;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các request liên quan đến nhân viên.
 *
 * @author nguyenduykhanh2
 */
@RestController
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeValidator employeeValidator;

    /**
     * Khởi tạo EmployeeController với EmployeeService và EmployeeValidator.
     *
     * @param employeeService service xử lý các chức năng liên quan đến nhân viên
     * @param employeeValidator validator kiểm tra tính hợp lệ của dữ liệu đầu vào
     */
    public EmployeeController(
            EmployeeService employeeService,
            EmployeeValidator employeeValidator) {
        this.employeeService = employeeService;
        this.employeeValidator = employeeValidator;
    }

    /**
     * Lấy danh sách nhân viên theo điều kiện tìm kiếm và sắp xếp.
     *
     * @param employeeName tên nhân viên cần tìm kiếm
     * @param departmentId mã phòng ban cần tìm kiếm
     * @param offset vị trí bắt đầu lấy dữ liệu
     * @param limit số lượng nhân viên tối đa được lấy
     * @param requestParams danh sách các tham số request
     * @return thông tin phản hồi chứa mã response và danh sách nhân viên
     */
    @GetMapping("/employee")
    public ResponseEntity<EmployeeListResponse> getEmployees(
            @RequestParam(name = "employee_name", required = false) String employeeName,
            @RequestParam(name = "department_id", required = false) Long departmentId,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = Constants.DEFAULT_EMPLOYEE_LIST_LIMIT) Integer limit,
            @RequestParam Map<String, String> requestParams
    ) {
        // 1. Trích xuất các tham số sắp xếp từ request
        Map<String, String> orderParams = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : requestParams.entrySet()) {
            if (entry.getKey().startsWith("ord_")) {
                orderParams.put(entry.getKey(), entry.getValue());
            }
        }

        // 2. Kiểm tra tính hợp lệ của tham số đầu vào qua Validator
        employeeValidator.validateGetEmployees(employeeName, offset, limit, orderParams);

        // 3. Gọi Service để xử lý nghiệp vụ và lấy Page dữ liệu
        Page<EmployeeDTO> employeePage = employeeService.getEmployees(
                employeeName,
                departmentId,
                orderParams,
                offset,
                limit);

        // 4. Đóng gói dữ liệu vào Response payload theo chuẩn API spec và trả về
        EmployeeListResponse response = new EmployeeListResponse(
                Constants.CODE_SUCCESS,
                employeePage.getTotalElements(),
                employeePage.getContent());

        return ResponseEntity.ok(response);
    }
}
