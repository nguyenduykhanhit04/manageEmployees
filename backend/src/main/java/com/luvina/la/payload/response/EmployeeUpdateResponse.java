/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeUpdateResponse.java, 11/09/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload phản hồi sau khi cập nhật thông tin nhân viên thành công.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeUpdateResponse {

    private int code;
    private Long employeeId;
    private ApiErrorMessage message;
}
