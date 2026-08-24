/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeCertificationDetailDTO.java, 24/8/2026 nguyenduykhanh2
 */
package com.luvina.la.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO chứa thông tin chi tiết chứng chỉ tiếng Nhật của nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeCertificationDetailDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long certificationId;
    private String certificationName;
    private String startDate;
    private String endDate;
    private BigDecimal score;
}
