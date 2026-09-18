/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeesCertificationRepository.java, 07/09/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.entity.EmployeesCertificationEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác với dữ liệu chứng chỉ nhân viên trong cơ sở dữ liệu.
 * Kế thừa EmployeesCertificationRepositoryCustom để xử lý các truy vấn liên kết bảng theo quy chuẩn Luvina Checklist mục 4.3.
 *
 * @author nguyenduykhanh2
 */
@Repository
public interface EmployeesCertificationRepository
        extends JpaRepository<EmployeesCertificationEntity, Long>, EmployeesCertificationRepositoryCustom {

    /**
     * Tìm chứng chỉ của nhân viên theo mã nhân viên.
     *
     * @param employeeId mã định danh nhân viên
     * @return thông tin chứng chỉ nhân viên nếu có
     */
    Optional<EmployeesCertificationEntity> findByEmployeeId(Long employeeId);

    /**
     * Xóa chứng chỉ của nhân viên theo mã nhân viên.
     *
     * @param employeeId mã định danh nhân viên
     */
    void deleteByEmployeeId(Long employeeId);
}
