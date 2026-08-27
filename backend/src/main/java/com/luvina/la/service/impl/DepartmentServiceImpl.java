/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentServiceImpl.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.entity.DepartmentEntity;
import com.luvina.la.mapper.DepartmentMapper;
import com.luvina.la.payload.response.DepartmentListResponse;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.service.DepartmentService;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Implementation service xử lý các nghiệp vụ liên quan đến phòng ban.
 *
 * @author nguyenduykhanh2
 */
@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    /**
     * Khởi tạo DepartmentServiceImpl với DepartmentRepository và DepartmentMapper.
     *
     * @param departmentRepository repository thao tác với dữ liệu phòng ban
     * @param departmentMapper mapper chuyển đổi giữa DepartmentEntity và DepartmentDTO
     */
    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository,
            DepartmentMapper departmentMapper) {
        this.departmentRepository = departmentRepository;
        this.departmentMapper = departmentMapper;
    }

    /**
     * Lấy danh sách tất cả các phòng ban.
     *
     * @return danh sách các DTO phòng ban
     */
    @Override
    public List<DepartmentDTO> getAllDepartments() {
        // 1. Lấy toàn bộ danh sách Entity phòng ban từ cơ sở dữ liệu
        List<DepartmentEntity> entities = departmentRepository.findAll();

        // 2. Chuyển đổi danh sách Entity sang DTO thông qua Mapper
        return departmentMapper.toDtoList(entities);
    }
}
