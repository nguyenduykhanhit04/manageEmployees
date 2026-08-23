/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * AddEmployeeRequest.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.payload;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Payload chứa thông tin yêu cầu tạo mới nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddEmployeeRequest {

    private String employeeLoginId;
    private String employeeName;
    private String employeeNameKana;
    private String employeeBirthDate;
    private String employeeEmail;
    private String employeeTelephone;
    private String employeeLoginPassword;
    private Long departmentId;
    private List<CertificationRequest> certifications;
}
