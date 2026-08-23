/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeRepository.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.repository;

import com.luvina.la.dto.EmployeeDisplayDTO;
import com.luvina.la.entity.Employee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác với dữ liệu nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Long>, EmployeeRepositoryCustom {
        /**
         * Tìm nhân viên theo mã đăng nhập.
         *
         * @param employeeLoginId mã đăng nhập của nhân viên
         * @return thông tin nhân viên
         */    
        Optional<Employee> findByEmployeeLoginId(String employeeLoginId);

        /**
         * Kiểm tra xem mã đăng nhập đã tồn tại trong hệ thống hay chưa.
         *
         * @param employeeLoginId mã đăng nhập của nhân viên
         * @return true nếu đã tồn tại, ngược lại là false
         */
        boolean existsByEmployeeLoginId(String employeeLoginId);

        /**
         * Tìm nhân viên theo mã nhân viên.
         *
         * @param employeeId mã nhân viên
         * @return thông tin nhân viên
         */  
        Optional<Employee> findByEmployeeId(Long employeeId);

        /**
         * Đếm tổng số nhân viên thỏa mãn điều kiện tìm kiếm.
         *
         * @param employeeName tên nhân viên cần tìm kiếm
         * @param departmentId mã phòng ban cần tìm kiếm
         * @return tổng số nhân viên
         */
        @Query(value = """
                select count(distinct e.employee_id)
                from employees e
                inner join departments d on d.department_id = e.department_id
                where e.employee_role = 1
                and (:employeeName is null or :employeeName = '' or e.employee_name like binary concat('%', :employeeName, '%') escape '\\\\')
                and (:departmentId is null or e.department_id = :departmentId)
                """, nativeQuery = true)
        long countDisplayEmployees(@Param("employeeName") String employeeName, @Param("departmentId") Long departmentId);
}

