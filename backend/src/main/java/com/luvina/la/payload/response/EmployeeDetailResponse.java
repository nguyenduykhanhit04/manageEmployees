/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeDetailResponse.java, 08/09/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luvina.la.dto.EmployeeCertificationDetailDTO;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload chứa thông tin phản hồi chi tiết của một nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeDetailResponse {
    private int code;
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
    private ApiErrorMessage message;

    /**
     * Khởi tạo EmployeeDetailResponse cho trường hợp thành công.
     */
    public EmployeeDetailResponse(
            int code,
            Long employeeId,
            String employeeName,
            String employeeBirthDate,
            Long departmentId,
            String departmentName,
            String employeeEmail,
            String employeeTelephone,
            String employeeNameKana,
            String employeeLoginId,
            List<EmployeeCertificationDetailDTO> certifications) {
        this.code = code;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeBirthDate = employeeBirthDate;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.employeeEmail = employeeEmail;
        this.employeeTelephone = employeeTelephone;
        this.employeeNameKana = employeeNameKana;
        this.employeeLoginId = employeeLoginId;
        this.certifications = certifications != null ? certifications : new ArrayList<>();
    }

    /**
     * Khởi tạo EmployeeDetailResponse cho trường hợp phản hồi lỗi.
     *
     * @param code mã phản hồi lỗi
     * @param message thông tin lỗi
     */
    public EmployeeDetailResponse(int code, ApiErrorMessage message) {
        this.code = code;
        this.message = message;
    }
}
