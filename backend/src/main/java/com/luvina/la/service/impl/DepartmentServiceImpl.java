package com.luvina.la.service.impl;

import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.entity.Department;
import com.luvina.la.payload.DepartmentListResponse;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.service.DepartmentService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public DepartmentListResponse getAllDepartments() {
        List<Department> entities = departmentRepository.findAll();

        List<DepartmentDTO> dtos = entities.stream().map(
                d -> new DepartmentDTO(d.getDepartmentId(), d.getDepartmentName())
        ).collect(Collectors.toList());
        return new DepartmentListResponse(200, dtos);
    }
}
