/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * LoginResponse.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import java.util.Map;
import lombok.Data;

/**
 * Payload chứa thông tin phản hồi sau khi đăng nhập.
 *
 * @author nguyenduykhanh2
 */
@Data
public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Map<String, String> errors;

    /**
     * Khởi tạo LoginResponse với Access Token.
     *
     * @param accessToken chuỗi JWT Access Token
     */
    public LoginResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    /**
     * Khởi tạo LoginResponse với thông tin lỗi.
     *
     * @param errors map chứa mã lỗi đăng nhập
     */
    public LoginResponse(Map<String, String> errors) {
        this.errors = errors;
    }
}
