/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationListResponse.java, 04/09/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import com.luvina.la.dto.CertificationDTO;
import java.util.List;
import lombok.Data;

/**
 * Payload chứa thông tin phản hồi danh sách chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@Data
public class CertificationListResponse {
    private int code;
    private List<CertificationDTO> certifications;

    /**
     * Khởi tạo CertificationListResponse.
     *
     * @param code mã phản hồi
     * @param certifications danh sách chứng chỉ tiếng Nhật
     */
    public CertificationListResponse(int code, List<CertificationDTO> certifications) {
        this.code = code;
        this.certifications = certifications;
    }
}
