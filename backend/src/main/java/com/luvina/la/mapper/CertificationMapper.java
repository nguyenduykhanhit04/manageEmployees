/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationMapper.java, 04/09/2026 nguyenduykhanh2
 */
package com.luvina.la.mapper;

import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.entity.CertificationEntity;
import java.util.List;
import org.mapstruct.Mapper;

/**
 * Interface Mapper chuyển đổi dữ liệu giữa CertificationEntity và CertificationDTO.
 *
 * @author nguyenduykhanh2
 */
@Mapper(componentModel = "spring")
public interface CertificationMapper {

    /**
     * Chuyển đổi từ CertificationEntity sang CertificationDTO.
     *
     * @param entity đối tượng CertificationEntity từ cơ sở dữ liệu
     * @return đối tượng CertificationDTO
     */
    CertificationDTO toDto(CertificationEntity entity);

    /**
     * Chuyển đổi từ CertificationDTO sang CertificationEntity.
     *
     * @param dto đối tượng CertificationDTO
     * @return đối tượng CertificationEntity
     */
    CertificationEntity toEntity(CertificationDTO dto);

    /**
     * Chuyển đổi danh sách CertificationEntity sang danh sách CertificationDTO.
     *
     * @param entities danh sách entity chứng chỉ
     * @return danh sách DTO chứng chỉ
     */
    List<CertificationDTO> toDtoList(List<CertificationEntity> entities);
}
