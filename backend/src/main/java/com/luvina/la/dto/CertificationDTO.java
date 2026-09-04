/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationDTO.java, 04/09/2026 nguyenduykhanh2
 */
package com.luvina.la.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO chứa thông tin chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificationDTO {
    private Long certificationId;
    private String certificationName;
}
