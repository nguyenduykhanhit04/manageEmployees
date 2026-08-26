/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentMapper.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.mapper;

import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.entity.DepartmentEntity;
import java.util.List;
import org.mapstruct.Mapper;

/**
 * Interface Mapper chuyển đổi dữ liệu giữa DepartmentEntity và DepartmentDTO.
 *
 * @author nguyenduykhanh2
 */
@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    /**
     * Chuyển đổi từ DepartmentEntity sang DepartmentDTO.
     *
     * @param entity đối tượng DepartmentEntity từ cơ sở dữ liệu
     * @return đối tượng DepartmentDTO phục vụ dữ liệu trả về cho client
     */
    DepartmentDTO toDto(DepartmentEntity entity);

    /**
     * Chuyển đổi từ DepartmentDTO sang DepartmentEntity.
     *
     * @param dto đối tượng DepartmentDTO
     * @return đối tượng DepartmentEntity
     */
    DepartmentEntity toEntity(DepartmentDTO dto);

    /**
     * Chuyển đổi danh sách DepartmentEntity sang danh sách DepartmentDTO.
     *
     * @param entities danh sách entity phòng ban
     * @return danh sách DTO phòng ban
     */
    List<DepartmentDTO> toDtoList(List<DepartmentEntity> entities);
}
