/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeController.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import com.luvina.la.config.Constants;
import com.luvina.la.payload.response.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
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

    /**
     * Khởi tạo EmployeeController.
     *
     * @param employeeService service xử lý các chức năng liên quan đến nhân viên
     */
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
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
        Map<String, String> orderParams = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : requestParams.entrySet()) {
            if (entry.getKey().startsWith("ord_")) {
                orderParams.put(entry.getKey(), entry.getValue());
            }
        }

        EmployeeListResponse response = employeeService.getEmployees(employeeName, departmentId, orderParams, offset, limit);

        if (response.getCode() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
