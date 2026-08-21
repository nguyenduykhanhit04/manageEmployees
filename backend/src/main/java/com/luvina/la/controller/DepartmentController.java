/**
 * Copyright(C) 2026 Luvina Software Company
 * 
 * DepartmentController.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import com.luvina.la.payload.DepartmentListResponse;
import com.luvina.la.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller xử lý các request liên quan đến phòng ban.
 *
 * @author nguyenduykhanh2
 */
@RestController
@RequestMapping("/department")
public class DepartmentController {

    private final DepartmentService departmentService;

    /**
     * Khởi tạo DepartmentController.
     *
     * @param departmentService service xử lý các chức năng liên quan đến phòng ban
     */
    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * Lấy danh sách tất cả các phòng ban.
     *
     * @return thông tin phản hồi chứa mã response và danh sách phòng ban
     */
    @GetMapping
    public DepartmentListResponse getAllDepartments() {
        return departmentService.getAllDepartments();
    }
}
