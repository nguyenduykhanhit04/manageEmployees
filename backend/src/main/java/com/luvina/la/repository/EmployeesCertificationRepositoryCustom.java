/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeesCertificationRepositoryCustom.java, 18/09/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.dto.EmployeeCertificationDetailDTO;
import java.util.List;

/**
 * Interface định nghĩa các phương thức tùy biến cho EmployeesCertificationRepository,
 * phục vụ các thao tác truy vấn liên kết bảng theo quy chuẩn Luvina Checklist.
 *
 * @author nguyenduykhanh2
 */
public interface EmployeesCertificationRepositoryCustom {

    /**
     * Lấy danh sách chi tiết chứng chỉ tiếng Nhật của một nhân viên theo mã nhân viên,
     * sắp xếp theo cấp bậc chứng chỉ tăng dần.
     *
     * @param employeeId mã định danh của nhân viên
     * @return danh sách DTO chứa thông tin chi tiết chứng chỉ
     */
    List<EmployeeCertificationDetailDTO> findCertificationsByEmployeeId(Long employeeId);
}
