/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * AddEmployeeResponse.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Payload chứa thông tin phản hồi sau khi tạo mới nhân viên thành công.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddEmployeeResponse {

    private int code;
    private Long employeeId;
    private ApiErrorMessage message;
}
