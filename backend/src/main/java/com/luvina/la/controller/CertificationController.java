/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationController.java, 04/09/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.payload.response.CertificationListResponse;
import com.luvina.la.service.CertificationService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller xử lý các request liên quan đến chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@RestController
@CrossOrigin(origins = "*")
public class CertificationController {

    private final CertificationService certificationService;

    /**
     * Khởi tạo CertificationController.
     *
     * @param certificationService service xử lý các chức năng chứng chỉ
     */
    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    /**
     * Lấy danh sách toàn bộ chứng chỉ tiếng Nhật trong hệ thống.
     *
     * @return phản hồi chứa mã response và danh sách chứng chỉ
     */
    @GetMapping("/certifications")
    public ResponseEntity<CertificationListResponse> getCertifications() {
        List<CertificationDTO> certifications = certificationService.getAllCertifications();
        CertificationListResponse response = new CertificationListResponse(Constants.CODE_SUCCESS, certifications);
        return ResponseEntity.ok(response);
    }
}
