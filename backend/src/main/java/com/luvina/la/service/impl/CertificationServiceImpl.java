/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationServiceImpl.java, 04/09/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.entity.CertificationEntity;
import com.luvina.la.mapper.CertificationMapper;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.service.CertificationService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation service xử lý các nghiệp vụ liên quan đến chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@Service
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;
    private final CertificationMapper certificationMapper;

    /**
     * Khởi tạo CertificationServiceImpl với CertificationRepository và CertificationMapper.
     *
     * @param certificationRepository repository thao tác với dữ liệu chứng chỉ
     * @param certificationMapper mapper chuyển đổi giữa CertificationEntity và CertificationDTO
     */
    public CertificationServiceImpl(
            CertificationRepository certificationRepository,
            CertificationMapper certificationMapper) {
        this.certificationRepository = certificationRepository;
        this.certificationMapper = certificationMapper;
    }

    /**
     * Lấy toàn bộ danh sách chứng chỉ tiếng Nhật trong hệ thống.
     *
     * @return danh sách các DTO chứng chỉ
     */
    @Override
    @Transactional(readOnly = true)
    public List<CertificationDTO> getAllCertifications() {
        List<CertificationEntity> certificationEntities = new ArrayList<>();
        certificationRepository.findAll().forEach(certificationEntities::add);
        return certificationMapper.toDtoList(certificationEntities);
    }
}
