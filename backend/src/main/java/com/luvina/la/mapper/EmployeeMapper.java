package com.luvina.la.mapper;

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
}

