/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * ApiErrorMessage.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.payload;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload chứa thông tin lỗi trả về từ API.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiErrorMessage {
    private String code;
    private List<String> params;
}