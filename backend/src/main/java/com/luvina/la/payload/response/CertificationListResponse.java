/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationListResponse.java, 04/09/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luvina.la.dto.CertificationDTO;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload chứa thông tin phản hồi danh sách chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CertificationListResponse {
    private int code;
    private List<CertificationDTO> certifications;
    private ApiErrorMessage message;

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
