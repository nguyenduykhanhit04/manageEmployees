/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeCertificationRepository.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.entity.EmployeeCertification;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác với dữ liệu chứng chỉ tiếng Nhật của nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Repository
public interface EmployeeCertificationRepository extends CrudRepository<EmployeeCertification, Long> {

    /**
     * Lấy danh sách chứng chỉ theo mã nhân viên.
     *
     * @param employeeId mã nhân viên
     * @return danh sách chứng chỉ của nhân viên
     */
    List<EmployeeCertification> findByEmployeeEmployeeId(Long employeeId);
}
