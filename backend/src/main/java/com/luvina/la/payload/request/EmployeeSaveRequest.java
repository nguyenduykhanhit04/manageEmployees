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

    /**
     * Hỗ trợ nhận object certifications lồng nhau theo chuẩn đặc tả TKAPI_UpdateEmployee.
     *
     * @param cert thông tin chứng chỉ lồng nhau
     */
    @JsonProperty("certifications")
    public void setCertifications(CertificationRequest cert) {
        if (cert != null) {
            if (cert.getCertificationId() != null) {
                this.certificationId = cert.getCertificationId();
            }
            if (cert.getStartDate() != null && !cert.getStartDate().isEmpty()) {
                this.certificationStartDate = cert.getStartDate();
            } else if (cert.getCertificationStartDate() != null && !cert.getCertificationStartDate().isEmpty()) {
                this.certificationStartDate = cert.getCertificationStartDate();
            }
            if (cert.getEndDate() != null && !cert.getEndDate().isEmpty()) {
                this.certificationEndDate = cert.getEndDate();
            } else if (cert.getCertificationEndDate() != null && !cert.getCertificationEndDate().isEmpty()) {
                this.certificationEndDate = cert.getCertificationEndDate();
            }
            if (cert.getScore() != null) {
                this.employeeCertificationScore = cert.getScore();
            } else if (cert.getEmployeeCertificationScore() != null) {
                this.employeeCertificationScore = cert.getEmployeeCertificationScore();
            }
        }
    }

    /**
     * DTO đại diện cho đối tượng chứng chỉ tiếng Nhật trong request.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationRequest {

        @JsonProperty("certificationId")
        private Long certificationId;

        @JsonProperty("startDate")
        private String startDate;

        @JsonProperty("certificationStartDate")
        private String certificationStartDate;

        @JsonProperty("endDate")
        private String endDate;

        @JsonProperty("certificationEndDate")
        private String certificationEndDate;

        @JsonProperty("score")
        private BigDecimal score;

        @JsonProperty("employeeCertificationScore")
        private BigDecimal employeeCertificationScore;
    }
}
