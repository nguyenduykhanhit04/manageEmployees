/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationService.java, 04/09/2026 nguyenduykhanh2
 */
package com.luvina.la.service;

import com.luvina.la.dto.CertificationDTO;
import java.util.List;

/**
 * Service xử lý các chức năng liên quan đến chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
public interface CertificationService {

    /**
     * Lấy toàn bộ danh sách chứng chỉ tiếng Nhật.
     *
     * @return danh sách các DTO chứng chỉ tiếng Nhật
     */
    List<CertificationDTO> getAllCertifications();
}
