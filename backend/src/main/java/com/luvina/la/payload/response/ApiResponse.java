/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * ApiResponse.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload phản hồi chuẩn chung của toàn bộ API.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {

    private int code;
    private ApiErrorMessage message;

    /**
     * Khởi tạo ApiResponse chỉ với mã trạng thái.
     *
     * @param code mã trạng thái phản hồi
     */
    public ApiResponse(int code) {
        this.code = code;
    }
}
