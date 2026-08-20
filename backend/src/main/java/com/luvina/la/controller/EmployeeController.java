package com.luvina.la.controller;

import com.luvina.la.config.EmployeeConstants;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * [ADM002] GET /employee
     * Ví dụ: GET /employee?employee_name=A&department_id=1&offset=0&limit=20&ord_employee_name=ASC
     */
    @GetMapping("/employee")
    public ResponseEntity<EmployeeListResponse> getEmployees(
            @RequestParam(name = "employee_name", required = false) String employeeName,
            @RequestParam(name = "department_id", required = false) Long departmentId,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = EmployeeConstants.DEFAULT_EMPLOYEE_LIST_LIMIT) Integer limit,
            @RequestParam Map<String, String> requestParams
    ) {
        // Tách các param sắp xếp ord_*
        Map<String, String> orderParams = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : requestParams.entrySet()) {
            if (entry.getKey().startsWith("ord_")) {
                orderParams.put(entry.getKey(), entry.getValue());
            }
        }

        // Gọi Service
        EmployeeListResponse response = employeeService.getEmployees(employeeName, departmentId, orderParams, offset, limit);

        if (response.getCode() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
