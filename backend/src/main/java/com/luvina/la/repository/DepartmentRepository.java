/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentRepository.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.entity.Department;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository thao tác với dữ liệu phòng ban.
 *
 * @author nguyenduykhanh2
 */
@Repository
public interface DepartmentRepository extends CrudRepository<Department, Long> {
    /**
     * Lấy toàn bộ danh sách phòng ban.
     *
     * @return danh sách phòng ban
     */
    List<Department> findAll();
}
