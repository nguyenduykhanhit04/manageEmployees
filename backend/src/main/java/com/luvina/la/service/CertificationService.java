/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationService.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service;

import com.luvina.la.payload.CertificationListResponse;

/**
 * Interface service xử lý các nghiệp vụ liên quan đến chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
public interface CertificationService {

    /**
     * Lấy toàn bộ danh sách chứng chỉ tiếng Nhật.
     *
     * @return danh sách chứng chỉ tiếng Nhật
     */
    CertificationListResponse getAllCertifications();
}
