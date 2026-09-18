/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeMapper.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.mapper;

import com.luvina.la.dto.EmployeeDetailDTO;
import com.luvina.la.entity.EmployeeEntity;
import com.luvina.la.payload.request.EmployeeSaveRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * Interface Mapper chuyển đổi dữ liệu từ EmployeeSaveRequest sang EmployeeEntity.
 *
 * @author nguyenduykhanh2
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmployeeMapper {

    /**
     * Chuyển đổi từ EmployeeSaveRequest sang EmployeeEntity.
     *
     * @param request đối tượng EmployeeSaveRequest từ Client
     * @return đối tượng EmployeeEntity
     */
    @Mapping(target = "department.departmentId", source = "departmentId")
    @Mapping(target = "employeeBirthDate", source = "employeeBirthDate", dateFormat = "yyyy/MM/dd")
    EmployeeEntity toEntity(EmployeeSaveRequest request);

    /**
     * Chuyển đổi từ EmployeeEntity sang EmployeeDetailDTO.
     *
     * @param employee đối tượng entity nhân viên
     * @return đối tượng EmployeeDetailDTO chứa thông tin cơ bản
     */
    @Mapping(target = "departmentId", source = "department.departmentId")
    @Mapping(target = "departmentName", source = "department.departmentName")
    @Mapping(target = "employeeBirthDate", source = "employeeBirthDate", dateFormat = "yyyy/MM/dd")
    @Mapping(target = "certifications", ignore = true)
    EmployeeDetailDTO toDetailDTO(EmployeeEntity employee);
}
