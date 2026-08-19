package com.luvina.la.service.impl;

import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.entity.Department;
import com.luvina.la.payload.DepartmentResponse;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.service.DepartmentService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public DepartmentResponse getAllDepartments() {
        try {
            // Lấy tất cả phòng ban từ database.
            Iterable<Department> departments = departmentRepository.findAll();

            // Chuyển Entity sang DTO.
            List<DepartmentDTO> departmentDTOs = new ArrayList<>();
            for (Department dept : departments) {
                departmentDTOs.add(new DepartmentDTO(dept.getDepartmentId(), dept.getDepartmentName()));
            }

            // Trả về response thành công (code 200).
            return new DepartmentResponse(200, departmentDTOs);
        } catch (Exception e) {
            // Xử lý exception nếu có lỗi xảy ra.
            return new DepartmentResponse(500, new ArrayList<>());
        }
    }
}

