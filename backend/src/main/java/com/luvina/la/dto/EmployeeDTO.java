/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeDTO.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO chứa thông tin nhân viên trong danh sách.
 * Ngày tháng được trả về dưới dạng String định dạng "yyyy/MM/dd"
 * để thống nhất với EmployeeDetailDTO và các DTO khác trong hệ thống.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
public class EmployeeDTO implements Serializable {

    private static final long serialVersionUID = 6868189362900231672L;

    private Long employeeId;
    private String employeeName;
    private String employeeBirthDate;
    private String departmentName;
    private String employeeEmail;
    private String employeeTelephone;
    private String certificationName;
    private String endDate;
    private BigDecimal score;

    /**
     * Khởi tạo EmployeeDTO với các thông tin của nhân viên.
     *
     * @param employeeId mã nhân viên
     * @param employeeName tên nhân viên
     * @param employeeBirthDate ngày sinh của nhân viên (định dạng yyyy/MM/dd)
     * @param departmentName tên phòng ban
     * @param employeeEmail địa chỉ email của nhân viên
     * @param employeeTelephone số điện thoại của nhân viên
     * @param certificationName tên chứng chỉ
     * @param endDate ngày hết hạn chứng chỉ (định dạng yyyy/MM/dd)
     * @param score điểm chứng chỉ
     */
    public EmployeeDTO(Long employeeId,
                       String employeeName,
                       String employeeBirthDate,
                       String departmentName,
                       String employeeEmail,
                       String employeeTelephone,
                       String certificationName,
                       String endDate,
                       BigDecimal score) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeBirthDate = employeeBirthDate;
        this.departmentName = departmentName;
        this.employeeEmail = employeeEmail;
        this.employeeTelephone = employeeTelephone;
        this.certificationName = certificationName;
        this.endDate = endDate;
        this.score = score;
    }
}

