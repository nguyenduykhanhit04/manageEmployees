/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentListResponse.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.payload;

import com.luvina.la.dto.DepartmentDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Payload chứa thông tin phản hồi danh sách phòng ban.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentListResponse {
    private int code;
    private List<DepartmentDTO> departments;
}
