/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationListResponse.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.payload;

import com.luvina.la.dto.CertificationDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Payload chứa thông tin phản hồi danh sách chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificationListResponse {
    private int code;
    private List<CertificationDTO> certifications;
}
