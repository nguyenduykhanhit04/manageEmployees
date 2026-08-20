package com.luvina.la.dto;

/**
 * Copyright(C) 2026 Luvina Software Company
 * <p>
 * EmployeeDTO.java, 4/10/2026 nathu303
 */

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) cho thông tin nhân viên hiển thị.
 * Lớp này được sử dụng để truyền dữ liệu nhân viên từ service đến controller
 * và trả về cho frontend. Nó chứa thông tin cơ bản của nhân viên và chứng chỉ.
 *
 * @author nathu303
 * @since 1.0
 */
@Data
@NoArgsConstructor
public class EmployeeDTO implements Serializable {

    private static final long serialVersionUID = 6868189362900231672L;

    private Long employeeId;
    private String employeeName;
    private LocalDate employeeBirthDate;
    private String departmentName;
    private String employeeEmail;
    private String employeeTelephone;
    private String certificationName;
    private LocalDate endDate;
    private BigDecimal score;

    public EmployeeDTO(Long employeeId,
                       String employeeName,
                       LocalDate employeeBirthDate,
                       String departmentName,
                       String employeeEmail,
                       String employeeTelephone,
                       String certificationName,
                       LocalDate endDate,
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
