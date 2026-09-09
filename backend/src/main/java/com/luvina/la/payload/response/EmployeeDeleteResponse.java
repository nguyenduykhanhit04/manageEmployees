/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeDeleteResponse.java, 09/09/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload phản hồi sau khi xóa nhân viên thành công.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeDeleteResponse {

    private int code;
    private Long employeeId;
    private ApiErrorMessage message;
}
