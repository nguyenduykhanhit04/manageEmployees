package com.luvina.la.repository;

/**
 * Copyright(C) 2026 Luvina Software Company
 * <p>
 * DepartmentRepository.java, 19/08/2026 nguyenduykhanh2
 */
import com.luvina.la.entity.Department;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface xử lý truy vấn database cho phòng ban.
 * Interface này mở rộng CrudRepository cung cấp các phương thức CRUD cơ bản
 * Các custom query để lấy dữ liệu phòng ban.
 *
 * @author nguyenduykhanh2
 * @since 1.0
 */
@Repository
public interface DepartmentRepository extends CrudRepository<Department, Long> {
     /**
     * Tìm phòng ban theo tên.
     *
     * @param departmentName Tên phòng ban
     * @return Optional chứa Department nếu tìm thấy, hoặc empty nếu không tồn tại
     */
    Optional<Department> findByDepartmentName(String departmentName);
}
