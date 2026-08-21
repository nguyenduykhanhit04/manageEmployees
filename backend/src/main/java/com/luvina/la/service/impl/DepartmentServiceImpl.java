package com.luvina.la.service.impl;

import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.entity.Department;
import com.luvina.la.payload.DepartmentResponse;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public DepartmentResponse getAllDepartments() {
        List<Department> entities = departmentRepository.findAll();

        List<DepartmentDTO> dtos = entities.stream().map(
                d -> new DepartmentDTO(d.getDepartmentId(), d.getDepartmentName())
        ).collect(Collectors.toList());
        return new DepartmentResponse(200, dtos);
    }
}

