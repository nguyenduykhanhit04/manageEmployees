/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentController.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import com.luvina.la.payload.response.DepartmentListResponse;
import com.luvina.la.service.DepartmentService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller xử lý các request liên quan đến phòng ban.
 *
 * @author nguyenduykhanh2
 */
@RestController
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentService departmentService;

    /**
     * Khởi tạo DepartmentController.
     *
     * @param departmentService service xử lý các chức năng phòng ban
     */
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * Lấy danh sách toàn bộ các phòng ban trong hệ thống.
     *
     * @return danh sách phòng ban
     */
    @GetMapping("/department")
    public DepartmentListResponse getDepartments() {
        return departmentService.getAllDepartments();
    }
}
