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
 *
 * @author nguyenduykhanh2
 */
@Repository
public interface EmployeesCertificationRepository extends JpaRepository<EmployeesCertificationEntity, Long> {

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

    /**
     * Lấy danh sách chi tiết chứng chỉ tiếng Nhật của một nhân viên, sắp xếp theo cấp bậc chứng chỉ tăng dần.
     *
     * @param employeeId mã định danh của nhân viên
     * @return danh sách DTO chứa thông tin chi tiết chứng chỉ
     */
    @org.springframework.data.jpa.repository.Query("""
        select new com.luvina.la.dto.EmployeeCertificationDetailDTO(
            c.certificationId,
            c.certificationName,
            ec.startDate,
            ec.endDate,
            ec.score
        )
        from EmployeesCertificationEntity ec, CertificationEntity c
        where ec.certificationId = c.certificationId
        and ec.employeeId = :employeeId
        order by c.certificationLevel asc
    """)
    java.util.List<com.luvina.la.dto.EmployeeCertificationDetailDTO> findCertificationsByEmployeeId(
            @org.springframework.data.repository.query.Param("employeeId") Long employeeId);
}
