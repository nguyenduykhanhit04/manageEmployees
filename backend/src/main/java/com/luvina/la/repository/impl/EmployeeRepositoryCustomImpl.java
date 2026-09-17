/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeRepositoryCustomImpl.java, 22/8/2026 nguyenduykhanh2
 */
package com.luvina.la.repository.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeCertificationDetailDTO;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.dto.EmployeeDetailDTO;
import com.luvina.la.repository.EmployeeRepositoryCustom;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd");

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

        // 8. Chuyển đổi dữ liệu Tuple sang danh sách EmployeeDTO
        @SuppressWarnings("unchecked")
        List<Tuple> rows = query.getResultList();
        List<EmployeeDTO> result = new ArrayList<>();

        for (Tuple row : rows) {
            result.add(mapEmployeeFromTuple(row));
        }

        return result;
    }

    /**
     * Lấy thông tin chi tiết một nhân viên bao gồm phòng ban và danh sách chứng chỉ tiếng Nhật.
     *
     * @param employeeId mã định danh của nhân viên
     * @return đối tượng EmployeeDetailDTO chứa đầy đủ thông tin chi tiết nếu tồn tại
     */
    @Override
    public Optional<EmployeeDetailDTO> getEmployeeDetail(Long employeeId) {
        // 1. Khởi tạo câu truy vấn SQL Native lấy thông tin nhân viên, phòng ban và chứng chỉ
        String sql = """
            select
                e.employee_id as employee_id,
                e.employee_name as employee_name,
                e.employee_birth_date as employee_birth_date,
                d.department_id as department_id,
                d.department_name as department_name,
                e.employee_email as employee_email,
                e.employee_telephone as employee_telephone,
                e.employee_name_kana as employee_name_kana,
                e.employee_login_id as employee_login_id,
                c.certification_id as certification_id,
                c.certification_name as certification_name,
                ec.start_date as start_date,
                ec.end_date as end_date,
                ec.score as score
            from employees e
            inner join departments d on d.department_id = e.department_id
            left join employees_certifications ec on ec.employee_id = e.employee_id
            left join certifications c on c.certification_id = ec.certification_id
            where e.employee_id = :employeeId
            and e.employee_role = 1
            order by c.certification_level asc
        """;

        Query query = entityManager.createNativeQuery(sql, Tuple.class);
        query.setParameter("employeeId", employeeId);

        // 2. Thực thi truy vấn và lấy danh sách kết quả Tuple
        @SuppressWarnings("unchecked")
        List<Tuple> rows = query.getResultList();

        // 3. Nếu không tìm thấy bản ghi nào thì trả về rỗng
        if (rows == null || rows.isEmpty()) {
            return Optional.empty();
        }

        // 4. Ánh xạ thông tin cơ bản của nhân viên từ dòng đầu tiên
        EmployeeDetailDTO employeeDetailDTO = mapEmployeeDetailFromTuple(rows.get(0));

        // 5. Duyệt qua các dòng kết quả để gom danh sách chứng chỉ tiếng Nhật (nếu có)
        List<EmployeeCertificationDetailDTO> certificationList = new ArrayList<>();
        for (Tuple row : rows) {
            EmployeeCertificationDetailDTO cert = mapCertificationFromTuple(row);
            if (cert != null) {
                certificationList.add(cert);
            }
        }
        employeeDetailDTO.setCertifications(certificationList);

        return Optional.of(employeeDetailDTO);
    }

    /**
     * Ánh xạ một dòng Tuple sang đối tượng EmployeeDTO theo tên cột.
     *
     * @param tuple dòng dữ liệu Tuple từ database
     * @return đối tượng EmployeeDTO
     */
    private EmployeeDTO mapEmployeeFromTuple(Tuple tuple) {
        Long empId = getLong(tuple, "employee_id");
        String name = getString(tuple, "employee_name");
        LocalDate birthDate = toLocalDate(tuple.get("employee_birth_date"));
        String departmentName = getString(tuple, "department_name");
        String employeeEmail = getString(tuple, "employee_email");
        String employeeTelephone = getString(tuple, "employee_telephone");
        String certificationName = getString(tuple, "certification_name");
        LocalDate endDate = toLocalDate(tuple.get("end_date"));
        BigDecimal score = getBigDecimal(tuple, "score");

        return new EmployeeDTO(empId, name, birthDate, departmentName, employeeEmail, employeeTelephone, certificationName, endDate, score);
    }

    /**
     * Ánh xạ thông tin cơ bản nhân viên từ Tuple theo tên cột.
     *
     * @param tuple dòng dữ liệu Tuple từ database
     * @return đối tượng EmployeeDetailDTO chứa thông tin cơ bản
     */
    private EmployeeDetailDTO mapEmployeeDetailFromTuple(Tuple tuple) {
        EmployeeDetailDTO dto = new EmployeeDetailDTO();
        dto.setEmployeeId(getLong(tuple, "employee_id"));
        dto.setEmployeeName(getString(tuple, "employee_name"));
        dto.setEmployeeBirthDate(formatDate(tuple.get("employee_birth_date")));
        dto.setDepartmentId(getLong(tuple, "department_id"));
        dto.setDepartmentName(getString(tuple, "department_name"));
        dto.setEmployeeEmail(getString(tuple, "employee_email"));
        dto.setEmployeeTelephone(getString(tuple, "employee_telephone"));
        dto.setEmployeeNameKana(getString(tuple, "employee_name_kana"));
        dto.setEmployeeLoginId(getString(tuple, "employee_login_id"));
        return dto;
    }

    /**
     * Ánh xạ thông tin chứng chỉ tiếng Nhật từ Tuple theo tên cột.
     *
     * @param tuple dòng dữ liệu Tuple từ database
     * @return đối tượng EmployeeCertificationDetailDTO hoặc null nếu không có chứng chỉ
     */
    private EmployeeCertificationDetailDTO mapCertificationFromTuple(Tuple tuple) {
        Long certificationId = getLong(tuple, "certification_id");
        if (certificationId == null) {
            return null;
        }

        return new EmployeeCertificationDetailDTO(
                certificationId,
                getString(tuple, "certification_name"),
                formatDate(tuple.get("start_date")),
                formatDate(tuple.get("end_date")),
                getBigDecimal(tuple, "score")
        );
    }

    /**
     * Lấy giá trị kiểu Long an toàn từ Tuple theo tên cột.
     */
    private Long getLong(Tuple tuple, String alias) {
        Object val = tuple.get(alias);
        return val != null ? ((Number) val).longValue() : null;
    }

    /**
     * Lấy giá trị kiểu String an toàn từ Tuple theo tên cột.
     */
    private String getString(Tuple tuple, String alias) {
        Object val = tuple.get(alias);
        return val != null ? val.toString() : null;
    }

    /**
     * Lấy giá trị kiểu BigDecimal an toàn từ Tuple theo tên cột.
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
     * Chuyển đổi đối tượng ngày bất kỳ (Date hoặc LocalDate) sang chuỗi theo định dạng yyyy/MM/dd.
     */
    private String formatDate(Object dateObj) {
        LocalDate localDate = toLocalDate(dateObj);
        return localDate != null ? localDate.format(DATE_FORMATTER) : null;
    }

    /**
     * Chuyển đổi đối tượng ngày bất kỳ (Date hoặc LocalDate) sang LocalDate.
     */
    private LocalDate toLocalDate(Object dateObj) {
        if (dateObj == null) {
            return null;
        }
        if (dateObj instanceof Date) {
            return ((Date) dateObj).toLocalDate();
        }
        if (dateObj instanceof LocalDate) {
            return (LocalDate) dateObj;
        }
        return null;
    }
}

