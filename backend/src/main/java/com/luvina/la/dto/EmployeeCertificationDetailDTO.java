/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeCertificationDetailDTO.java, 08/09/2026 nguyenduykhanh2
 */
package com.luvina.la.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO chứa thông tin chi tiết chứng chỉ tiếng Nhật của nhân viên trong phản hồi API.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCertificationDetailDTO {
    private Long certificationId;
    private String certificationName;
    private String startDate;
    private String endDate;
    private BigDecimal score;
}
