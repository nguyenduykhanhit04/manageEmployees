/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeValidator.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.validator;

import com.luvina.la.config.Constants;
import com.luvina.la.exception.BusinessException;
import com.luvina.la.payload.request.EmployeeSaveRequest;
import com.luvina.la.payload.request.EmployeeSearchRequest;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/**
 * Lớp thực hiện kiểm tra tính hợp lệ của dữ liệu đầu vào cho các chức năng liên quan đến Nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Component
public class EmployeeValidator {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CertificationRepository certificationRepository;

    // Regex patterns
    private static final Pattern KATAKANA_PATTERN = Pattern.compile("^[ァ-ヶー\\s]+$");
    private static final Pattern HALF_SIZE_LOGIN_ID_PATTERN = Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_]*$");
    private static final Pattern TELEPHONE_PATTERN = Pattern.compile("^[0-9-+()]+$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd");

    // Danh sách các trường cho phép sắp xếp hợp lệ theo đặc tả TKAPI_ListEmployee
    private static final Set<String> VALID_ORDER_KEYS = Set.of(
            Constants.ORDER_KEY_EMPLOYEE_NAME,
            Constants.ORDER_KEY_CERTIFICATION_NAME,
            Constants.ORDER_KEY_END_DATE
    );

    public EmployeeValidator(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.certificationRepository = certificationRepository;
    }

    /**
     * Kiểm tra tính hợp lệ của mã định danh nhân viên khi lấy thông tin chi tiết.
     *
     * @param employeeId mã định danh của nhân viên
     * @throws BusinessException nếu employeeId null hoặc không hợp lệ (ER001)
     */
    public void validateGetEmployee(Long employeeId) {
        if (employeeId == null || employeeId <= 0) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_ID));
        }
    }

    /**
     * Kiểm tra tính hợp lệ của các tham số tìm kiếm, phân trang và sắp xếp danh sách nhân viên.
     *
     * @param employeeName tên nhân viên cần tìm kiếm
     * @param offset vị trí bắt đầu lấy dữ liệu
     * @param limit số lượng bản ghi tối đa được lấy
     * @param orderParams danh sách các tham số sắp xếp
     * @throws BusinessException nếu bất kỳ tham số nào không hợp lệ
     */
    public void validateGetEmployees(
            String employeeName,
            int offset,
            int limit,
            Map<String, String> orderParams) {

        // 1. Kiểm tra tham số phân trang: offset (phải lớn hơn hoặc bằng 0)
        if (offset < 0) {
            throw new BusinessException(
                    Constants.ERROR_CODE_INVALID_PAGING,
                    List.of(Constants.OFFSET_PARAM_LABEL));
        }

        // 2. Kiểm tra tham số phân trang: limit (phải lớn hơn 0)
        if (limit <= 0) {
            throw new BusinessException(
                    Constants.ERROR_CODE_INVALID_PAGING,
                    List.of(Constants.LIMIT_PARAM_LABEL));
        }

        // 3. Kiểm tra độ dài tên nhân viên (tối đa không vượt quá 125 ký tự)
        if (employeeName != null
                && employeeName.length() > Constants.MAX_EMPLOYEE_NAME_LENGTH) {
            throw new BusinessException(
                    Constants.ERROR_CODE_INVALID_EMPLOYEE_NAME,
                    List.of(
                            Constants.LABEL_EMPLOYEE_NAME,
                            String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)));
        }

        // 4. Kiểm tra các tham số sắp xếp (orderParams)
        if (orderParams != null && !orderParams.isEmpty()) {
            for (Map.Entry<String, String> entry : orderParams.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                // 4.1. Kiểm tra tên trường sắp xếp có thuộc whitelist hay không
                if (!VALID_ORDER_KEYS.contains(key.toLowerCase())) {
                    throw new BusinessException(
                            Constants.ERROR_CODE_INVALID_SORT,
                            List.of(key));
                }

                // 4.2. Kiểm tra chiều sắp xếp (bắt buộc phải là ASC hoặc DESC)
                if (!Constants.SORT_ASC.equalsIgnoreCase(value)
                        && !Constants.SORT_DESC.equalsIgnoreCase(value)) {
                    throw new BusinessException(
                            Constants.ERROR_CODE_INVALID_SORT,
                            List.of(key));
                }
            }
        }
    }

    /**
     * Kiểm tra tính hợp lệ của request tìm kiếm nhân viên.
     *
     * @param request đối tượng EmployeeSearchRequest chứa các tham số tìm kiếm
     * @throws BusinessException nếu bất kỳ tham số nào không hợp lệ
     */
    public void validateGetEmployees(EmployeeSearchRequest request) {
        if (request == null) {
            return;
        }
        int offset = request.getOffset() != null ? request.getOffset() : 0;
        int limit = request.getLimit() != null ? request.getLimit() : 20;
        validateGetEmployees(request.getEmployeeName(), offset, limit, request.getOrderParams());
    }

    /**
     * Kiểm tra tính hợp lệ của request thêm mới nhân viên (Mode ADD).
     *
     * @param request đối tượng EmployeeSaveRequest
     * @throws BusinessException nếu có lỗi vi phạm validation
     */
    public void validateAddEmployee(EmployeeSaveRequest request) {
        if (request == null) {
            throw new BusinessException(Constants.ER015, List.of());
        }

        // 1. アカウント名 (employeeLoginId)
        String loginId = request.getEmployeeLoginId();
        if (loginId == null || loginId.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_ACCOUNT_NAME));
        }
        if (loginId.length() > 50) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_ACCOUNT_NAME, "50"));
        }
        if (!HALF_SIZE_LOGIN_ID_PATTERN.matcher(loginId).matches()) {
            throw new BusinessException(Constants.ER019, List.of(Constants.LABEL_ACCOUNT_NAME));
        }
        if (employeeRepository.existsByEmployeeLoginId(loginId)) {
            throw new BusinessException(Constants.ER003, List.of(Constants.LABEL_ACCOUNT_NAME));
        }

        // 2. グループ (departmentId)
        Long deptId = request.getDepartmentId();
        if (deptId == null || deptId <= 0) {
            throw new BusinessException(Constants.ER002, List.of(Constants.LABEL_GROUP));
        }
        if (!departmentRepository.existsById(deptId)) {
            throw new BusinessException(Constants.ER004, List.of(Constants.LABEL_GROUP));
        }

        // 3. 氏名 (employeeName)
        String name = request.getEmployeeName();
        if (name == null || name.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMPLOYEE_NAME));
        }
        if (name.length() > 125) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_EMPLOYEE_NAME, "125"));
        }

        // 4. カタカナ氏名 (employeeNameKana)
        String nameKana = request.getEmployeeNameKana();
        if (nameKana == null || nameKana.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMPLOYEE_NAME_KANA));
        }
        if (nameKana.length() > 125) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_EMPLOYEE_NAME_KANA, "125"));
        }
        if (!KATAKANA_PATTERN.matcher(nameKana).matches()) {
            throw new BusinessException(Constants.ER009, List.of(Constants.LABEL_EMPLOYEE_NAME_KANA));
        }

        // 5. 生年月日 (employeeBirthDate)
        String birthDateStr = request.getEmployeeBirthDate();
        if (birthDateStr == null || birthDateStr.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_BIRTH_DATE));
        }
        parseAndValidateDate(birthDateStr, Constants.LABEL_BIRTH_DATE);

        // 6. メールアドレス (employeeEmail)
        String email = request.getEmployeeEmail();
        if (email == null || email.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMAIL));
        }
        if (email.length() > 125) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_EMAIL, "125"));
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new BusinessException(Constants.ER005, List.of(Constants.LABEL_EMAIL));
        }
        if (employeeRepository.existsByEmployeeEmail(email)) {
            throw new BusinessException(Constants.ER003, List.of(Constants.LABEL_EMAIL));
        }

        // 7. 電話番号 (employeeTelephone)
        String phone = request.getEmployeeTelephone();
        if (phone == null || phone.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_TELEPHONE));
        }
        if (phone.length() > 50) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_TELEPHONE, "50"));
        }
        if (!TELEPHONE_PATTERN.matcher(phone).matches()) {
            throw new BusinessException(Constants.ER008, List.of(Constants.LABEL_TELEPHONE));
        }

        // 8. パスワード (employeeLoginPassword)
        String password = request.getEmployeeLoginPassword();
        if (password == null || password.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_PASSWORD));
        }
        if (password.length() < 8 || password.length() > 50) {
            throw new BusinessException(Constants.ER007, List.of(Constants.LABEL_PASSWORD, "8", "50"));
        }

        // 9. Chứng chỉ tiếng Nhật (nếu có)
        Long certId = request.getCertificationId();
        if (certId != null && certId > 0) {
            if (!certificationRepository.existsById(certId)) {
                throw new BusinessException(Constants.ER004, List.of(Constants.LABEL_CERTIFICATION));
            }

            // 資格交付日
            String startDateStr = request.getCertificationStartDate();
            if (startDateStr == null || startDateStr.trim().isEmpty()) {
                throw new BusinessException(Constants.ER002, List.of(Constants.LABEL_CERT_START_DATE));
            }
            LocalDate startDate = parseAndValidateDate(startDateStr, Constants.LABEL_CERT_START_DATE);

            // 失効日
            String endDateStr = request.getCertificationEndDate();
            if (endDateStr == null || endDateStr.trim().isEmpty()) {
                throw new BusinessException(Constants.ER002, List.of(Constants.LABEL_CERT_END_DATE));
            }
            LocalDate endDate = parseAndValidateDate(endDateStr, Constants.LABEL_CERT_END_DATE);

            // 失効日 >= 資格交付日 (ER012)
            if (endDate.isBefore(startDate)) {
                throw new BusinessException(Constants.ER012, List.of(Constants.LABEL_CERT_END_DATE, Constants.LABEL_CERT_START_DATE));
            }

            // 点数
            BigDecimal score = request.getEmployeeCertificationScore();
            if (score == null) {
                throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_SCORE));
            }
            if (score.compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessException(Constants.ER018, List.of(Constants.LABEL_SCORE));
            }
        }
    }

    private LocalDate parseAndValidateDate(String dateStr, String fieldLabel) {
        try {
            return LocalDate.parse(dateStr, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            throw new BusinessException("ER011", List.of(fieldLabel));
        }
    }
}
