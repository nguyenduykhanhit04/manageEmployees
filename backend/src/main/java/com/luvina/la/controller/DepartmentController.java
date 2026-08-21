package com.luvina.la.controller;

import com.luvina.la.payload.DepartmentListResponse;
import com.luvina.la.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller xử lý các request liên quan đến Phòng Ban (Department).
 */
@RestController
@RequestMapping("/department")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * API lấy danh sách tất cả các phòng ban.
     * Endpoint: GET /department
     *
     * @return DepartmentListResponse chứa mã response code và danh sách phòng ban
     */
    @GetMapping
    public DepartmentListResponse getAllDepartments() {
        return departmentService.getAllDepartments();
    }
}
