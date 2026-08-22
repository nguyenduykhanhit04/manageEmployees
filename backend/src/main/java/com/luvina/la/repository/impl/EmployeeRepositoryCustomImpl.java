/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeRepositoryCustomImpl.java, 22/8/2026 nguyenduykhanh2
 */
package com.luvina.la.repository.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.repository.EmployeeRepositoryCustom;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import org.springframework.stereotype.Repository;

/**
 * Triển khai tùy biến cho EmployeeRepository, hỗ trợ câu truy vấn SQL động
 * với thứ tự ưu tiên sắp xếp nhiều cột linh hoạt theo yêu cầu từ Client.
 *
 * @author nguyenduykhanh2
 */
@Repository
public class EmployeeRepositoryCustomImpl implements EmployeeRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Lấy danh sách nhân viên với thứ tự sắp xếp được xây dựng động theo thứ tự click từ Frontend.
     *
     * @param employeeName tên nhân viên cần tìm kiếm
     * @param departmentId mã phòng ban cần tìm kiếm
     * @param orderParams danh sách các trường sắp xếp theo thứ tự ưu tiên
     * @param offset vị trí bắt đầu lấy dữ liệu
     * @param limit số lượng bản ghi tối đa được lấy
     * @return danh sách DTO thông tin nhân viên
     */
    @Override
    public List<EmployeeDTO> findDisplayEmployees(
            String employeeName,
            Long departmentId,
            Map<String, String> orderParams,
            int offset,
            int limit) {

        StringBuilder sql = new StringBuilder("""
            select
                e.employee_id,
                e.employee_name,
                e.employee_birth_date,
                d.department_name,
                e.employee_email,
                e.employee_telephone,
                c.certification_name,
                ec.end_date,
                ec.score
            from employees e
            inner join departments d on d.department_id = e.department_id
            left join employees_certifications ec on ec.employee_id = e.employee_id
            left join certifications c on c.certification_id = ec.certification_id
            where e.employee_role = 1
        """);

        // Điều kiện lọc theo tên nhân viên (phân biệt hoa thường với binary)
        if (employeeName != null && !employeeName.isEmpty()) {
            sql.append(" and e.employee_name like binary concat('%', :employeeName, '%') escape '\\\\' ");
        }

        // Điều kiện lọc theo phòng ban
        if (departmentId != null) {
            sql.append(" and e.department_id = :departmentId ");
        }

        // Xây dựng mệnh đề ORDER BY động theo thứ tự các trường được truyền từ Frontend
        sql.append(" order by ");
        List<String> orderClauses = new ArrayList<>();

        if (orderParams != null && !orderParams.isEmpty()) {
            for (Map.Entry<String, String> entry : orderParams.entrySet()) {
                String key = entry.getKey();
                String direction = "DESC".equalsIgnoreCase(entry.getValue()) ? "desc" : "asc";

                // Sắp xếp theo tên nhân viên
                if (Constants.ORDER_KEY_EMPLOYEE_NAME.equalsIgnoreCase(key)) {
                    orderClauses.add("e.employee_name collate utf8mb4_vietnamese_ci " + direction);
                } 
                // Sắp xếp theo trình độ chứng chỉ
                else if (Constants.ORDER_KEY_CERTIFICATION_LEVEL.equalsIgnoreCase(key)
                        || "ord_certification_name".equalsIgnoreCase(key)) {
                    orderClauses.add("case when c.certification_level is null then 1 else 0 end asc, -c.certification_level " + direction);
                } 
                // Sắp xếp theo ngày hết hạn chứng chỉ
                else if (Constants.ORDER_KEY_END_DATE.equalsIgnoreCase(key)) {
                    orderClauses.add("case when ec.end_date is null then 1 else 0 end asc, ec.end_date " + direction);
                }
            }
        }

        // Luôn kết thúc bằng e.employee_id asc để đảm bảo tính ổn định của phân trang
        orderClauses.add("e.employee_id asc");
        sql.append(String.join(", ", orderClauses));

        // Phân trang
        sql.append(" limit :limit offset :offset ");

        Query query = entityManager.createNativeQuery(sql.toString());

        if (employeeName != null && !employeeName.isEmpty()) {
            query.setParameter("employeeName", employeeName);
        }
        if (departmentId != null) {
            query.setParameter("departmentId", departmentId);
        }
        query.setParameter("limit", limit);
        query.setParameter("offset", offset);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        List<EmployeeDTO> result = new ArrayList<>();

        for (Object[] row : rows) {
            Long empId = row[0] != null ? ((Number) row[0]).longValue() : null;
            String name = (String) row[1];
            LocalDate birthDate = row[2] != null ? ((Date) row[2]).toLocalDate() : null;
            String deptName = (String) row[3];
            String email = (String) row[4];
            String tel = (String) row[5];
            String certName = (String) row[6];
            LocalDate endDate = row[7] != null ? ((Date) row[7]).toLocalDate() : null;
            BigDecimal score = row[8] != null ? (BigDecimal) row[8] : null;

            result.add(new EmployeeDTO(empId, name, birthDate, deptName, email, tel, certName, endDate, score));
        }

        return result;
    }
}
