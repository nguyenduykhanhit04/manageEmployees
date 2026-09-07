/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeSaveRequest.java, 07/09/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload chứa thông tin lưu (Thêm mới / Chỉnh sửa) nhân viên từ Client.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSaveRequest {

    @JsonProperty("employeeId")
    private Long employeeId;

    @JsonProperty("employeeLoginId")
    private String employeeLoginId;

    @JsonProperty("departmentId")
    private Long departmentId;

    @JsonProperty("employeeName")
    private String employeeName;

    @JsonProperty("employeeNameKana")
    private String employeeNameKana;

    @JsonProperty("employeeBirthDate")
    private String employeeBirthDate;

    @JsonProperty("employeeEmail")
    private String employeeEmail;

    @JsonProperty("employeeTelephone")
    private String employeeTelephone;

    @JsonProperty("employeeLoginPassword")
    private String employeeLoginPassword;

    // Thông tin chứng chỉ tiếng Nhật
    @JsonProperty("certificationId")
    private Long certificationId;

    @JsonProperty("certificationStartDate")
    private String certificationStartDate;

    @JsonProperty("certificationEndDate")
    private String certificationEndDate;

    @JsonProperty("employeeCertificationScore")
    private BigDecimal employeeCertificationScore;
}
