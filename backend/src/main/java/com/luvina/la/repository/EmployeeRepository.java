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
public interface EmployeeRepository extends CrudRepository<Employee, Long> {
        /**
         * Tìm nhân viên theo mã đăng nhập.
         *
         * @param employeeLoginId mã đăng nhập của nhân viên
         * @return thông tin nhân viên
         */    
        Optional<Employee> findByEmployeeLoginId(String employeeLoginId);

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
                and (:employeeName is null or :employeeName = '' or e.employee_name like concat('%', :employeeName, '%') escape '\\\\')
                and (:departmentId is null or e.department_id = :departmentId)
                """, nativeQuery = true)
        long countDisplayEmployees(@Param("employeeName") String employeeName, @Param("departmentId") Long departmentId);

        /**
         * Lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp và phân trang.
         *
         * @param employeeName tên nhân viên cần tìm kiếm
         * @param departmentId mã phòng ban cần tìm kiếm
         * @param ordName thứ tự sắp xếp theo tên nhân viên
         * @param ordCertificationLevel thứ tự sắp xếp theo cấp độ chứng chỉ
         * @param ordEndDate thứ tự sắp xếp theo ngày hết hạn chứng chỉ
         * @param offset vị trí bắt đầu lấy dữ liệu
         * @param limit số lượng bản ghi tối đa được lấy
         * @return danh sách thông tin nhân viên
         */
        @Query(value = """
                select
                        e.employee_id as employeeId,
                        e.employee_name as employeeName,
                        e.employee_birth_date as employeeBirthDate,
                        d.department_name as departmentName,
                        e.employee_email as employeeEmail,
                        e.employee_telephone as employeeTelephone,
                        c.certification_name as certificationName,
                        ec.end_date as endDate,
                        ec.score as score
                from employees e
                cross join (
                        select
                        :employeeName as employeeName,
                        :departmentId as departmentId,
                        :ordName as ordName,
                        :ordCertificationLevel as ordCertificationLevel,
                        :ordEndDate as ordEndDate
                ) p
                inner join departments d on d.department_id = e.department_id
                left join employees_certifications ec on ec.employee_id = e.employee_id
                left join certifications c on c.certification_id = ec.certification_id
                where e.employee_role = 1
                and (p.employeeName is null or p.employeeName = '' or e.employee_name like concat('%', p.employeeName, '%') escape '\\\\')
                and (p.departmentId is null or e.department_id = p.departmentId)
                order by
                case when upper(p.ordName) = 'ASC' then e.employee_name collate utf8mb4_vietnamese_ci end asc,
                case when upper(p.ordName) = 'DESC' then e.employee_name collate utf8mb4_vietnamese_ci end desc,
                case when upper(p.ordCertificationLevel) = 'ASC' then -c.certification_level end asc,
                case when upper(p.ordCertificationLevel) = 'DESC' then -c.certification_level end desc,
                case when c.certification_level is null then 1 else 0 end asc,
                case when upper(p.ordEndDate) = 'ASC' then ec.end_date end asc,
                case when upper(p.ordEndDate) = 'DESC' then ec.end_date end desc
                limit :limit offset :offset
                """, nativeQuery = true)
        List<EmployeeDisplayDTO> findDisplayEmployees(
                @Param("employeeName") String employeeName,
                @Param("departmentId") Long departmentId,
                @Param("ordName") String ordName,
                @Param("ordCertificationLevel") String ordCertificationLevel,
                @Param("ordEndDate") String ordEndDate,
                @Param("offset") int offset,
                @Param("limit") int limit
        );
}
