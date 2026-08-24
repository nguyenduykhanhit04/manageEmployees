/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeController.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import com.luvina.la.config.Constants;
import com.luvina.la.payload.AddEmployeeRequest;
import com.luvina.la.payload.AddEmployeeResponse;
import com.luvina.la.payload.EmployeeDetailResponse;
import com.luvina.la.payload.EmployeeListResponse;
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

    /**
     * Thêm mới nhân viên.
     *
     * @param request thông tin nhân viên cần thêm mới
     * @return thông tin phản hồi chứa mã kết quả và mã nhân viên vừa tạo
     */
    @PostMapping("/employee")
    public ResponseEntity<AddEmployeeResponse> addEmployee(@RequestBody AddEmployeeRequest request) {
        AddEmployeeResponse response = employeeService.addEmployee(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin chi tiết của một nhân viên.
     *
     * @param id mã nhân viên cần lấy thông tin chi tiết
     * @return thông tin phản hồi chứa mã kết quả và dữ liệu chi tiết nhân viên
     */
    @GetMapping("/employee/{id}")
    public ResponseEntity<EmployeeDetailResponse> getEmployee(@PathVariable("id") Long id) {
        EmployeeDetailResponse response = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(response);
    }
}
