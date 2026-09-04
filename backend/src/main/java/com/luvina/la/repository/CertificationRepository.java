/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationRepository.java, 04/09/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.entity.CertificationEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác với dữ liệu chứng chỉ trong cơ sở dữ liệu.
 *
 * @author nguyenduykhanh2
 */
@Repository
public interface CertificationRepository extends CrudRepository<CertificationEntity, Long> {
}
