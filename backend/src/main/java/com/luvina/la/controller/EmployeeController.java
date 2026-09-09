/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeController.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.request.EmployeeSaveRequest;
import com.luvina.la.payload.response.ApiErrorMessage;
import com.luvina.la.payload.response.ApiResponse;
import com.luvina.la.payload.response.EmployeeDeleteResponse;
import com.luvina.la.payload.response.EmployeeDetailResponse;
import com.luvina.la.payload.response.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.validator.EmployeeValidator;
import java.util.Collections;
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
    public EmployeeController(EmployeeService employeeService, EmployeeValidator employeeValidator) {
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
            @RequestParam Map<String, String> requestParams) {

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
                employeeName, departmentId, orderParams, offset, limit);

        // 4. Đóng gói dữ liệu vào Response payload theo chuẩn API spec và trả về
        EmployeeListResponse response = new EmployeeListResponse(
                Constants.CODE_SUCCESS,
                employeePage.getTotalElements(),
                employeePage.getContent());

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin chi tiết một nhân viên theo mã định danh employeeId.
     *
     * @param employeeId mã định danh của nhân viên cần lấy thông tin
     * @return thông tin chi tiết nhân viên và mã phản hồi 200
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<EmployeeDetailResponse> getEmployeeDetail(@PathVariable("employeeId") Long employeeId) {
        // 1. Kiểm tra tính hợp lệ của tham số employeeId qua Validator (bắt lỗi ER001)
        employeeValidator.validateGetEmployee(employeeId);

        // 2. Gọi Service để lấy thông tin chi tiết nhân viên (bắt lỗi ER013 nếu không tìm thấy)
        EmployeeDetailResponse response = employeeService.getEmployeeDetail(employeeId);

        // 3. Trả về phản hồi thành công mã 200
        return ResponseEntity.ok(response);
    }

    /**
     * Thêm mới một nhân viên vào hệ thống.
     *
     * @param request đối tượng chứa thông tin nhân viên cần thêm mới
     * @return thông tin phản hồi chứa mã response thành công
     */
    @PostMapping("/employee")
    public ResponseEntity<ApiResponse> createEmployee(@RequestBody EmployeeSaveRequest request) {
        // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
        employeeValidator.validateAddEmployee(request);

        // 2. Thực hiện thêm mới nhân viên qua Service
        employeeService.createEmployee(request);

        // 3. Trả về phản hồi thành công mã 200
        ApiResponse response = new ApiResponse(Constants.CODE_SUCCESS);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa một nhân viên và chứng chỉ liên quan khỏi hệ thống theo employeeId.
     *
     * @param employeeId mã định danh của nhân viên cần xóa
     * @return thông tin phản hồi chứa mã response thành công 200 và message MSG003
     */
    @DeleteMapping("/employee/{employeeId}")
    public ResponseEntity<EmployeeDeleteResponse> deleteEmployee(@PathVariable("employeeId") Long employeeId) {
        // 1. Kiểm tra tính hợp lệ của tham số employeeId qua Validator (bắt lỗi ER001 và ER014)
        employeeValidator.validateDeleteEmployee(employeeId);

        // 2. Thực hiện xóa nhân viên qua Service
        Long deletedId = employeeService.deleteEmployee(employeeId);

        // 3. Đóng gói Response và trả về
        EmployeeDeleteResponse response = new EmployeeDeleteResponse(
                Constants.CODE_SUCCESS,
                deletedId,
                new ApiErrorMessage(Constants.MSG_DELETE_SUCCESS, Collections.emptyList())
        );

        return ResponseEntity.ok(response);
    }
}

