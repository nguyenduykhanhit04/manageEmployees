package com.luvina.la.repository;

import com.luvina.la.entity.Department;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends CrudRepository<Department, Long> {
    // Lấy toàn bộ danh sách phòng ban
    List<Department> findAll();
}
