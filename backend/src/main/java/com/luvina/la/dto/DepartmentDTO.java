/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentDTO.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO chứa thông tin phòng ban.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@AllArgsConstructor
public class DepartmentDTO {
    private Long departmentId;
    private String departmentName;
}
