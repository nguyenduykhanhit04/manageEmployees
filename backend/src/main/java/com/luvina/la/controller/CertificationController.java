/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationController.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import com.luvina.la.payload.CertificationListResponse;
import com.luvina.la.service.CertificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller xử lý các request liên quan đến chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/certifications")
public class CertificationController {

    private final CertificationService certificationService;

    /**
     * Khởi tạo CertificationController.
     *
     * @param certificationService service xử lý các chức năng liên quan đến chứng chỉ
     */
    @Autowired
    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    /**
     * Lấy danh sách tất cả các chứng chỉ tiếng Nhật.
     *
     * @return thông tin phản hồi chứa mã response và danh sách chứng chỉ
     */
    @GetMapping
    public CertificationListResponse getAllCertifications() {
        return certificationService.getAllCertifications();
    }
}
