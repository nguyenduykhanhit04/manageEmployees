/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * ApiErrorMessage.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload chứa thông tin chi tiết lỗi (mã lỗi và danh sách tham số hiển thị thông báo).
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiErrorMessage {
    private String code;
    private List<String> params = new ArrayList<>();
}
