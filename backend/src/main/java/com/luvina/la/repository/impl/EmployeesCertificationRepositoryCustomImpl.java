/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeesCertificationRepositoryCustomImpl.java, 18/09/2026 nguyenduykhanh2
 */
package com.luvina.la.repository.impl;

import com.luvina.la.dto.EmployeeCertificationDetailDTO;
import com.luvina.la.repository.EmployeesCertificationRepositoryCustom;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

/**
 * Triển khai tùy biến cho EmployeesCertificationRepository, thực thi truy vấn liên kết bảng
 * theo đúng quy chuẩn Luvina Checklist mục 4.3.
 *
 * @author nguyenduykhanh2
 */
@Repository
public class EmployeesCertificationRepositoryCustomImpl implements EmployeesCertificationRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Lấy danh sách chi tiết chứng chỉ tiếng Nhật của một nhân viên theo mã nhân viên,
     * sắp xếp theo cấp bậc chứng chỉ tăng dần.
     *
     * @param employeeId mã định danh của nhân viên
     * @return danh sách DTO chứa thông tin chi tiết chứng chỉ
     */
    @Override
    public List<EmployeeCertificationDetailDTO> findCertificationsByEmployeeId(Long employeeId) {
        String jpql = """
            select new com.luvina.la.dto.EmployeeCertificationDetailDTO(
                c.certificationId,
                c.certificationName,
                ec.startDate,
                ec.endDate,
                ec.score
            )
            from EmployeesCertificationEntity ec
            join CertificationEntity c on ec.certificationId = c.certificationId
            where ec.employeeId = :employeeId
            order by c.certificationLevel asc
        """;

        return entityManager.createQuery(jpql, EmployeeCertificationDetailDTO.class)
                .setParameter("employeeId", employeeId)
                .getResultList();
    }
}
