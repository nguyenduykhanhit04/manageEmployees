/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeMapper.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.mapper;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.entity.EmployeeEntity;
import java.util.List;
import org.mapstruct.Mapper;

/**
 * Interface Mapper chuyển đổi dữ liệu giữa EmployeeEntity và EmployeeDTO.
 *
 * @author nguyenduykhanh2
 */
@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    /**
     * Chuyển đổi từ EmployeeEntity sang EmployeeDTO.
     *
     * @param entity đối tượng EmployeeEntity từ cơ sở dữ liệu
     * @return đối tượng EmployeeDTO
     */
    EmployeeDTO toDto(EmployeeEntity entity);

    /**
     * Chuyển đổi từ EmployeeDTO sang EmployeeEntity.
     *
     * @param dto đối tượng EmployeeDTO
     * @return đối tượng EmployeeEntity
     */
    EmployeeEntity toEntity(EmployeeDTO dto);

    /**
     * Chuyển đổi danh sách EmployeeEntity sang danh sách EmployeeDTO.
     *
     * @param entities danh sách entity nhân viên
     * @return danh sách DTO nhân viên
     */
    List<EmployeeDTO> toDtoList(List<EmployeeEntity> entities);
}
