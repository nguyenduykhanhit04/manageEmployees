/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationServiceImpl.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.entity.Certification;
import com.luvina.la.payload.CertificationListResponse;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.service.CertificationService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementation service xử lý các nghiệp vụ liên quan đến chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@Service
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;

    /**
     * Khởi tạo CertificationServiceImpl với CertificationRepository.
     *
     * @param certificationRepository repository thao tác với dữ liệu chứng chỉ
     */
    @Autowired
    public CertificationServiceImpl(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    /**
     * Lấy danh sách tất cả các chứng chỉ tiếng Nhật.
     *
     * @return thông tin phản hồi chứa mã response và danh sách chứng chỉ
     */
    @Override
    public CertificationListResponse getAllCertifications() {
        List<Certification> entities = certificationRepository.findAll();

        List<CertificationDTO> dtos = entities.stream().map(
                c -> new CertificationDTO(c.getCertificationId(), c.getCertificationName(), c.getCertificationLevel())
        ).collect(Collectors.toList());
        return new CertificationListResponse(Constants.CODE_SUCCESS, dtos);
    }
}
