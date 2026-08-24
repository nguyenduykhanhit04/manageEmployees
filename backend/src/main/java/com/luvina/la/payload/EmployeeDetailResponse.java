/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeDetailResponse.java, 24/8/2026 nguyenduykhanh2
 */
package com.luvina.la.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luvina.la.dto.EmployeeCertificationDetailDTO;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Payload chứa thông tin phản hồi chi tiết của một nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
     *
     * @param code mã phản hồi HTTP
     * @param employeeId mã nhân viên
     * @param employeeName tên nhân viên
     * @param employeeBirthDate ngày sinh
     * @param departmentId mã phòng ban
     * @param departmentName tên phòng ban
     * @param employeeEmail email
     * @param employeeTelephone số điện thoại
     * @param employeeNameKana tên Kana
     * @param employeeLoginId tài khoản đăng nhập
     * @param certifications danh sách chứng chỉ tiếng Nhật
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
     * Khởi tạo EmployeeDetailResponse cho trường hợp lỗi.
     *
     * @param code mã phản hồi HTTP
     * @param message đối tượng thông báo lỗi
     */
    public EmployeeDetailResponse(int code, ApiErrorMessage message) {
        this.code = code;
        this.message = message;
    }
}
