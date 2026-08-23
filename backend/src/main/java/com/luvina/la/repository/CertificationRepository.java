/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationRepository.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.entity.Certification;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác với dữ liệu chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 */
@Repository
public interface CertificationRepository extends CrudRepository<Certification, Long> {

    /**
     * Lấy toàn bộ danh sách chứng chỉ tiếng Nhật.
     *
     * @return danh sách chứng chỉ
     */
    List<Certification> findAll();
}
