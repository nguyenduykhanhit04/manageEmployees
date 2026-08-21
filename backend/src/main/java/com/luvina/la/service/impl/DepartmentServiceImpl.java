/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentServiceImpl.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.entity.Department;
import com.luvina.la.payload.DepartmentListResponse;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.service.DepartmentService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementation service xử lý các nghiệp vụ liên quan đến phòng ban.
 *
 * @author nguyenduykhanh2
 */
@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    /**
     * Khởi tạo DepartmentServiceImpl với DepartmentRepository.
     *
     * @param departmentRepository repository thao tác với dữ liệu phòng ban
     */
    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    /**
     * Lấy danh sách tất cả các phòng ban.
     *
     * @return thông tin phản hồi chứa mã response và danh sách phòng ban
     */
    @Override
    public DepartmentListResponse getAllDepartments() {
        List<Department> entities = departmentRepository.findAll();

        List<DepartmentDTO> dtos = entities.stream().map(
                d -> new DepartmentDTO(d.getDepartmentId(), d.getDepartmentName())
        ).collect(Collectors.toList());
        return new DepartmentListResponse(Constants.CODE_SUCCESS, dtos);
    }
}
