/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentRepository.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.entity.DepartmentEntity;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác với dữ liệu phòng ban trong cơ sở dữ liệu.
 *
 * @author nguyenduykhanh2
 */
@Repository
public interface DepartmentRepository extends CrudRepository<DepartmentEntity, Long> {

    /**
     * Lấy toàn bộ danh sách phòng ban.
     *
     * @return danh sách entity phòng ban
     */
    List<DepartmentEntity> findAll();
}
