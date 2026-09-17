/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeDetailDTO.java, 17/09/2026 nguyenduykhanh2
 */
package com.luvina.la.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO chứa thông tin chi tiết một nhân viên và danh sách chứng chỉ tiếng Nhật liên quan.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDetailDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long employeeId;
    private String employeeName;
    private String employeeBirthDate;
    private Long departmentId;
    private String departmentName;
    private String employeeEmail;
    private String employeeTelephone;
    private String employeeNameKana;
    private String employeeLoginId;
    private List<EmployeeCertificationDetailDTO> certifications = new ArrayList<>();
}
