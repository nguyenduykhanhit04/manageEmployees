/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * LoginRequest.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload chứa thông tin yêu cầu đăng nhập từ phía client.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String username;
    private String password;
}
