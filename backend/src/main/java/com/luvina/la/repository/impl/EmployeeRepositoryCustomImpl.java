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
import javax.persistence.Tuple;
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
    public List<EmployeeDTO> findEmployees(
            String employeeName,
            Long departmentId,
            Map<String, String> orderParams,
            int offset,
            int limit) {

        // 1. Khởi tạo câu truy vấn SQL lấy thông tin nhân viên
        StringBuilder sql = new StringBuilder("""
            select
                e.employee_id as employee_id,
                e.employee_name as employee_name,
                e.employee_birth_date as employee_birth_date,
                d.department_name as department_name,
                e.employee_email as employee_email,
                e.employee_telephone as employee_telephone,
                c.certification_name as certification_name,
                ec.end_date as end_date,
                ec.score as score
            from employees e
            inner join departments d on d.department_id = e.department_id
            left join employees_certifications ec on ec.employee_id = e.employee_id
            left join certifications c on c.certification_id = ec.certification_id
            where e.employee_role = 1
        """);

        // 2. Bổ sung điều kiện lọc theo tên nhân viên (phân biệt hoa thường với binary)
        if (employeeName != null && !employeeName.isEmpty()) {
            sql.append(" and e.employee_name like binary concat('%', :employeeName, '%') escape '\\\\' ");
        }

        // 3. Bổ sung điều kiện lọc theo phòng ban
        if (departmentId != null) {
            sql.append(" and e.department_id = :departmentId ");
        }

        // 4. Xây dựng mệnh đề ORDER BY động theo thứ tự các trường được truyền từ Frontend
        sql.append(" order by ");
        List<String> orderClauses = new ArrayList<>();

        if (orderParams != null && !orderParams.isEmpty()) {
            for (Map.Entry<String, String> entry : orderParams.entrySet()) {
                String key = entry.getKey();
                String direction = "DESC".equalsIgnoreCase(entry.getValue()) ? "desc" : "asc";

                // Sắp xếp theo tên nhân viên
                if (Constants.ORDER_KEY_EMPLOYEE_NAME.equalsIgnoreCase(key)) {
                    orderClauses.add("e.employee_name collate utf8mb4_vietnamese_ci " + direction);
                } else if (Constants.ORDER_KEY_CERTIFICATION_NAME.equalsIgnoreCase(key)) {
                    // Sắp xếp theo trình độ chứng chỉ (ưu tiên điểm/cấp bậc chứng chỉ cao nhất)
                    orderClauses.add("case when c.certification_level is null then 1 else 0 end asc, -c.certification_level " + direction);
                } else if (Constants.ORDER_KEY_END_DATE.equalsIgnoreCase(key)) {
                    // Sắp xếp theo ngày hết hạn chứng chỉ
                    orderClauses.add("case when ec.end_date is null then 1 else 0 end asc, ec.end_date " + direction);
                }
            }
        }

        // 5. Luôn kết thúc bằng e.employee_id asc để đảm bảo tính ổn định của phân trang
        orderClauses.add("e.employee_id asc");
        sql.append(String.join(", ", orderClauses));

        // 6. Bổ sung phân trang LIMIT và OFFSET
        sql.append(" limit :limit offset :offset ");

        Query query = entityManager.createNativeQuery(sql.toString(), Tuple.class);

        // 7. Gán giá trị các tham số truy vấn
        if (employeeName != null && !employeeName.isEmpty()) {
            query.setParameter("employeeName", employeeName);
        }
        if (departmentId != null) {
            query.setParameter("departmentId", departmentId);
        }
        query.setParameter("limit", limit);
        query.setParameter("offset", offset);

        // 8. Chuyển đổi dữ liệu Tuple sang danh sách EmployeeDTO (không dùng unchecked cast)
        List<?> rows = query.getResultList();
        List<EmployeeDTO> result = new ArrayList<>();

        for (Object row : rows) {
            result.add(mapEmployeeFromTuple((Tuple) row));
        }

        return result;
    }

    /**
     * Ánh xạ một dòng Tuple sang đối tượng EmployeeDTO theo tên cột.
     * Ngày tháng được format thành chuỗi "yyyy/MM/dd" để thống nhất với toàn bộ hệ thống.
     *
     * @param tuple dòng dữ liệu Tuple từ database
     * @return đối tượng EmployeeDTO
     */
    private EmployeeDTO mapEmployeeFromTuple(Tuple tuple) {
        Long empId = getLong(tuple, "employee_id");
        String name = getString(tuple, "employee_name");
        String birthDate = formatDate(tuple.get("employee_birth_date"));
        String departmentName = getString(tuple, "department_name");
        String employeeEmail = getString(tuple, "employee_email");
        String employeeTelephone = getString(tuple, "employee_telephone");
        String certificationName = getString(tuple, "certification_name");
        String endDate = formatDate(tuple.get("end_date"));
        BigDecimal score = getBigDecimal(tuple, "score");

        return new EmployeeDTO(empId, name, birthDate, departmentName, employeeEmail, employeeTelephone, certificationName, endDate, score);
    }

    /**
     * Lấy giá trị kiểu Long an toàn từ Tuple theo tên cột.
     *
     * @param tuple dòng dữ liệu Tuple
     * @param alias tên cột cần lấy
     * @return giá trị Long hoặc null nếu không có
     */
    private Long getLong(Tuple tuple, String alias) {
        Object val = tuple.get(alias);
        return val != null ? ((Number) val).longValue() : null;
    }

    /**
     * Lấy giá trị kiểu String an toàn từ Tuple theo tên cột.
     *
     * @param tuple dòng dữ liệu Tuple
     * @param alias tên cột cần lấy
     * @return giá trị String hoặc null nếu không có
     */
    private String getString(Tuple tuple, String alias) {
        Object val = tuple.get(alias);
        return val != null ? val.toString() : null;
    }

    /**
     * Lấy giá trị kiểu BigDecimal an toàn từ Tuple theo tên cột.
     *
     * @param tuple dòng dữ liệu Tuple
     * @param alias tên cột cần lấy
     * @return giá trị BigDecimal hoặc null nếu không có
     */
    private BigDecimal getBigDecimal(Tuple tuple, String alias) {
        Object val = tuple.get(alias);
        if (val == null) {
            return null;
        }
        if (val instanceof BigDecimal) {
            return (BigDecimal) val;
        }
        return new BigDecimal(val.toString());
    }

    /**
     * Chuyển đổi đối tượng ngày bất kỳ (Date hoặc LocalDate) sang chuỗi định dạng "yyyy/MM/dd".
     * Thống nhất với định dạng ngày tháng toàn hệ thống được khai báo tại Constants.DEFAULT_DATE_FORMATTER.
     *
     * @param dateObj đối tượng ngày (Date hoặc LocalDate)
     * @return chuỗi ngày tháng định dạng "yyyy/MM/dd" hoặc null nếu không có
     */
    private String formatDate(Object dateObj) {
        if (dateObj == null) {
            return null;
        }
        if (dateObj instanceof Date) {
            return ((Date) dateObj).toLocalDate().format(Constants.DEFAULT_DATE_FORMATTER);
        }
        if (dateObj instanceof LocalDate) {
            return ((LocalDate) dateObj).format(Constants.DEFAULT_DATE_FORMATTER);
        }
        return null;
    }
}
