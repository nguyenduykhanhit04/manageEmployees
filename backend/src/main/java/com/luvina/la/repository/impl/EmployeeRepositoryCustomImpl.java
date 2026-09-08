/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeRepositoryCustomImpl.java, 22/8/2026 nguyenduykhanh2
 */
package com.luvina.la.repository.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeCertificationDetailDTO;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.response.EmployeeDetailResponse;
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

        Query query = entityManager.createNativeQuery(sql.toString());

        // 7. Gán giá trị các tham số truy vấn
        if (employeeName != null && !employeeName.isEmpty()) {
            query.setParameter("employeeName", employeeName);
        }
        if (departmentId != null) {
            query.setParameter("departmentId", departmentId);
        }
        query.setParameter("limit", limit);
        query.setParameter("offset", offset);

        // 8. Chuyển đổi dữ liệu thô sang danh sách EmployeeDTO
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

    /**
     * Lấy thông tin chi tiết một nhân viên bao gồm phòng ban và danh sách chứng chỉ tiếng Nhật.
     *
     * @param employeeId mã định danh của nhân viên
     * @return đối tượng EmployeeDetailResponse chứa đầy đủ thông tin chi tiết
     */
    @Override
    public Optional<EmployeeDetailResponse> getEmployeeDetail(Long employeeId) {
        if (employeeId == null || employeeId <= 0) {
            return Optional.empty();
        }

        String sql = """
            select
                e.employee_id,
                e.employee_name,
                e.employee_birth_date,
                d.department_id,
                d.department_name,
                e.employee_email,
                e.employee_telephone,
                e.employee_name_kana,
                e.employee_login_id,
                c.certification_id,
                c.certification_name,
                ec.start_date,
                ec.end_date,
                ec.score
            from employees e
            inner join departments d on d.department_id = e.department_id
            left join employees_certifications ec on ec.employee_id = e.employee_id
            left join certifications c on c.certification_id = ec.certification_id
            where e.employee_id = :employeeId
            order by c.certification_level asc
        """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("employeeId", employeeId);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();

        if (rows == null || rows.isEmpty()) {
            return Optional.empty();
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        EmployeeDetailResponse response = null;
        List<EmployeeCertificationDetailDTO> certifications = new ArrayList<>();

        for (Object[] row : rows) {
            if (response == null) {
                Long empId = row[0] != null ? ((Number) row[0]).longValue() : null;
                String name = (String) row[1];
                LocalDate birthDate = row[2] != null ? ((Date) row[2]).toLocalDate() : null;
                Long deptId = row[3] != null ? ((Number) row[3]).longValue() : null;
                String deptName = (String) row[4];
                String email = (String) row[5];
                String tel = (String) row[6];
                String nameKana = (String) row[7];
                String loginId = (String) row[8];

                response = new EmployeeDetailResponse();
                response.setCode(Constants.CODE_SUCCESS);
                response.setEmployeeId(empId);
                response.setEmployeeName(name);
                response.setEmployeeBirthDate(birthDate != null ? birthDate.format(formatter) : null);
                response.setDepartmentId(deptId);
                response.setDepartmentName(deptName);
                response.setEmployeeEmail(email);
                response.setEmployeeTelephone(tel);
                response.setEmployeeNameKana(nameKana);
                response.setEmployeeLoginId(loginId);
            }

            Long certId = row[9] != null ? ((Number) row[9]).longValue() : null;
            if (certId != null) {
                String certName = (String) row[10];
                LocalDate startDate = row[11] != null ? ((Date) row[11]).toLocalDate() : null;
                LocalDate endDate = row[12] != null ? ((Date) row[12]).toLocalDate() : null;
                BigDecimal score = row[13] != null ? (BigDecimal) row[13] : null;

                EmployeeCertificationDetailDTO certDto = new EmployeeCertificationDetailDTO(
                        certId,
                        certName,
                        startDate != null ? startDate.format(formatter) : null,
                        endDate != null ? endDate.format(formatter) : null,
                        score
                );
                certifications.add(certDto);
            }
        }

        if (response != null) {
            response.setCertifications(certifications);
        }

        return Optional.ofNullable(response);
    }
}

