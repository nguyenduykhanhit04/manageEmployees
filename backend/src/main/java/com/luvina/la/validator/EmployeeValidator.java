/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeValidator.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.validator;

import com.luvina.la.config.Constants;
import com.luvina.la.entity.EmployeeEntity;
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
 * Tái cấu trúc chuẩn Clean Code, loại bỏ hoàn toàn Magic Numbers và loại bỏ mã trùng lặp (DRY).
 *
 * @author nguyenduykhanh2
 */
@Component
public class EmployeeValidator {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CertificationRepository certificationRepository;

    // Biểu thức chính quy kiểm tra định dạng
    private static final Pattern KATAKANA_PATTERN = Pattern.compile("^[\\uFF65-\\uFF9F\\s]+$");
    private static final Pattern HALF_SIZE_LOGIN_ID_PATTERN = Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_]*$");
    private static final Pattern TELEPHONE_PATTERN = Pattern.compile("^[0-9-+()]+$");
    private static final Pattern HALF_SIZE_ASCII_PATTERN = Pattern.compile("^[\\x20-\\x7E]+$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@luvina\\.net$");

    // Danh sách các trường cho phép sắp xếp hợp lệ theo đặc tả TKAPI_ListEmployee
    private static final Set<String> VALID_ORDER_KEYS = Set.of(
            Constants.ORDER_KEY_EMPLOYEE_NAME,
            Constants.ORDER_KEY_CERTIFICATION_NAME,
            Constants.ORDER_KEY_END_DATE
    );

    /**
     * Khởi tạo EmployeeValidator với các Repository phụ thuộc.
     *
     * @param employeeRepository Repository thao tác với nhân viên
     * @param departmentRepository Repository thao tác với phòng ban
     * @param certificationRepository Repository thao tác với chứng chỉ
     */
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
            throw BusinessException.required(Constants.LABEL_ID);
        }
    }

    /**
     * Kiểm tra tính hợp lệ của mã định danh nhân viên khi xóa.
     *
     * @param employeeId mã định danh của nhân viên cần xóa
     * @throws BusinessException nếu employeeId không hợp lệ (ER001), không tồn tại (ER014) hoặc là Admin (ER020)
     */
    public void validateDeleteEmployee(Long employeeId) {
        // 1. Kiểm tra tham số employeeId bắt buộc
        if (employeeId == null || employeeId <= 0) {
            throw BusinessException.required(Constants.LABEL_ID);
        }

        // 2. Kiểm tra sự tồn tại của nhân viên trong cơ sở dữ liệu
        EmployeeEntity employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> BusinessException.employeeDeleteNotFound(Constants.LABEL_ID));

        // 3. Kiểm tra không được xóa người dùng quản trị viên (Admin)
        if (employee.getEmployeeRole() != null && employee.getEmployeeRole() == Constants.ROLE_ADMIN) {
            throw BusinessException.cannotDeleteAdmin();
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
            throw BusinessException.invalidPaging(Constants.OFFSET_PARAM_LABEL);
        }

        // 2. Kiểm tra tham số phân trang: limit (phải lớn hơn 0)
        if (limit <= 0) {
            throw BusinessException.invalidPaging(Constants.LIMIT_PARAM_LABEL);
        }

        // 3. Kiểm tra độ dài tên nhân viên (tối đa không vượt quá MAX_EMPLOYEE_NAME_LENGTH)
        if (employeeName != null && employeeName.length() > Constants.MAX_EMPLOYEE_NAME_LENGTH) {
            throw BusinessException.maxLength(
                    Constants.LABEL_EMPLOYEE_NAME,
                    Constants.MAX_EMPLOYEE_NAME_LENGTH);
        }

        // 4. Kiểm tra các tham số sắp xếp (orderParams)
        if (orderParams != null && !orderParams.isEmpty()) {
            for (Map.Entry<String, String> entry : orderParams.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                // 4.1. Kiểm tra tên trường sắp xếp có thuộc whitelist hay không
                if (!VALID_ORDER_KEYS.contains(key.toLowerCase())) {
                    throw BusinessException.invalidSort(key);
                }

                // 4.2. Kiểm tra chiều sắp xếp (bắt buộc phải là ASC hoặc DESC)
                if (!Constants.SORT_ASC.equalsIgnoreCase(value)
                        && !Constants.SORT_DESC.equalsIgnoreCase(value)) {
                    throw BusinessException.invalidSort(key);
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
        int offset = request.getOffset() != null ? request.getOffset() : Constants.DEFAULT_PAGING_OFFSET;
        int limit = request.getLimit() != null ? request.getLimit() : Constants.DEFAULT_PAGING_LIMIT;
        validateGetEmployees(request.getEmployeeName(), offset, limit, request.getOrderParams());
    }

    /**
     * Kiểm tra tính hợp lệ của request thêm mới nhân viên (Mode ADD).
     *
     * @param request đối tượng EmployeeSaveRequest chứa dữ liệu thêm mới
     * @throws BusinessException nếu có lỗi vi phạm validation theo TKAPI_AddEmployee
     */
    public void validateAddEmployee(EmployeeSaveRequest request) {
        if (request == null) {
            throw BusinessException.systemError();
        }

        // 1. Kiểm tra tên đăng nhập (Login ID) cho Add
        validateLoginId(request.getEmployeeLoginId());
        if (employeeRepository.existsByEmployeeLoginId(request.getEmployeeLoginId())) {
            throw BusinessException.alreadyExists(Constants.LABEL_ACCOUNT_NAME);
        }

        // 2. Kiểm tra mật khẩu (Bắt buộc nhập khi Add)
        validatePassword(request.getEmployeeLoginPassword(), true);

        // 3. Kiểm tra toàn bộ các trường thông tin chung
        validateCommonFields(request);
    }

    /**
     * Kiểm tra tính hợp lệ của request cập nhật thông tin nhân viên (Mode EDIT).
     *
     * @param employeeId mã định danh của nhân viên cần cập nhật
     * @param request đối tượng EmployeeSaveRequest chứa dữ liệu cập nhật
     * @throws BusinessException nếu có lỗi vi phạm validation theo TKAPI_UpdateEmployee
     */
    public void validateUpdateEmployee(Long employeeId, EmployeeSaveRequest request) {
        // 1. Kiểm tra mã định danh nhân viên
        if (employeeId == null) {
            throw BusinessException.required(Constants.LABEL_ID);
        }
        if (!employeeRepository.existsById(employeeId)) {
            throw BusinessException.employeeNotFound(Constants.LABEL_ID);
        }
        if (request == null) {
            throw BusinessException.systemError();
        }

        // 2. Kiểm tra tên đăng nhập (Login ID) cho Update (không trùng với nhân viên khác)
        validateLoginId(request.getEmployeeLoginId());
        if (employeeRepository.existsByEmployeeLoginIdAndEmployeeIdNot(request.getEmployeeLoginId(), employeeId)) {
            throw BusinessException.alreadyExists(Constants.LABEL_ACCOUNT_NAME);
        }

        // 3. Kiểm tra mật khẩu (Không bắt buộc khi Update, nếu nhập mới kiểm tra độ dài)
        validatePassword(request.getEmployeeLoginPassword(), false);

        // 4. Kiểm tra toàn bộ các trường thông tin chung
        validateCommonFields(request);
    }

    /**
     * Kiểm tra các trường thông tin chung giữa Add và Update.
     *
     * @param request đối tượng chứa thông tin nhân viên cần kiểm tra
     */
    private void validateCommonFields(EmployeeSaveRequest request) {
        validateDepartment(request.getDepartmentId());
        validateEmployeeName(request.getEmployeeName());
        validateEmployeeNameKana(request.getEmployeeNameKana());
        validateBirthDate(request.getEmployeeBirthDate());
        validateEmail(request.getEmployeeEmail());
        validateTelephone(request.getEmployeeTelephone());
        validateCertifications(
                request.getCertificationId(),
                request.getCertificationStartDate(),
                request.getCertificationEndDate(),
                request.getEmployeeCertificationScore()
        );
    }

    /**
     * Kiểm tra tính hợp lệ của tên đăng nhập (Login ID).
     *
     * @param loginId tên đăng nhập cần kiểm tra
     */
    private void validateLoginId(String loginId) {
        if (loginId == null || loginId.trim().isEmpty()) {
            throw BusinessException.required(Constants.LABEL_ACCOUNT_NAME);
        }
        if (loginId.length() > Constants.MAX_LOGIN_ID_LENGTH) {
            throw BusinessException.maxLength(Constants.LABEL_ACCOUNT_NAME, Constants.MAX_LOGIN_ID_LENGTH);
        }
        if (!HALF_SIZE_LOGIN_ID_PATTERN.matcher(loginId).matches()) {
            throw BusinessException.invalidLoginId(Constants.LABEL_ACCOUNT_NAME);
        }
    }

    /**
     * Kiểm tra tính hợp lệ của mật khẩu đăng nhập.
     *
     * @param password mật khẩu cần kiểm tra
     * @param isRequired true nếu bắt buộc phải nhập (Add), false nếu là tùy chọn (Update)
     */
    private void validatePassword(String password, boolean isRequired) {
        if (isRequired) {
            if (password == null || password.trim().isEmpty()) {
                throw BusinessException.required(Constants.LABEL_PASSWORD);
            }
            checkPasswordLength(password);
        } else if (password != null && !password.trim().isEmpty()) {
            checkPasswordLength(password);
        }
    }

    /**
     * Kiểm tra độ dài mật khẩu (từ MIN_PASSWORD_LENGTH đến MAX_PASSWORD_LENGTH).
     *
     * @param password mật khẩu cần kiểm tra
     */
    private void checkPasswordLength(String password) {
        if (password.length() < Constants.MIN_PASSWORD_LENGTH || password.length() > Constants.MAX_PASSWORD_LENGTH) {
            throw BusinessException.range(
                    Constants.LABEL_PASSWORD,
                    Constants.MIN_PASSWORD_LENGTH,
                    Constants.MAX_PASSWORD_LENGTH
            );
        }
    }

    /**
     * Kiểm tra tính hợp lệ của phòng ban (Department).
     *
     * @param deptId mã phòng ban
     */
    private void validateDepartment(Long deptId) {
        if (deptId == null || deptId <= 0) {
            throw BusinessException.requiredSelect(Constants.LABEL_GROUP);
        }
        if (!departmentRepository.existsById(deptId)) {
            throw BusinessException.notFound(Constants.LABEL_GROUP);
        }
    }

    /**
     * Kiểm tra tính hợp lệ của tên nhân viên.
     *
     * @param name tên nhân viên
     */
    private void validateEmployeeName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw BusinessException.required(Constants.LABEL_EMPLOYEE_NAME);
        }
        if (name.length() > Constants.MAX_EMPLOYEE_NAME_LENGTH) {
            throw BusinessException.maxLength(Constants.LABEL_EMPLOYEE_NAME, Constants.MAX_EMPLOYEE_NAME_LENGTH);
        }
    }

    /**
     * Kiểm tra tính hợp lệ của tên Katakana của nhân viên.
     *
     * @param nameKana tên Katakana
     */
    private void validateEmployeeNameKana(String nameKana) {
        if (nameKana == null || nameKana.trim().isEmpty()) {
            throw BusinessException.required(Constants.LABEL_EMPLOYEE_NAME_KANA);
        }
        if (nameKana.length() > Constants.MAX_EMPLOYEE_NAME_KANA_LENGTH) {
            throw BusinessException.maxLength(Constants.LABEL_EMPLOYEE_NAME_KANA, Constants.MAX_EMPLOYEE_NAME_KANA_LENGTH);
        }
        if (!KATAKANA_PATTERN.matcher(nameKana).matches()) {
            throw BusinessException.katakana(Constants.LABEL_EMPLOYEE_NAME_KANA);
        }
    }

    /**
     * Kiểm tra tính hợp lệ của ngày sinh.
     *
     * @param birthDateStr chuỗi ngày sinh
     */
    private void validateBirthDate(String birthDateStr) {
        if (birthDateStr == null || birthDateStr.trim().isEmpty()) {
            throw BusinessException.required(Constants.LABEL_BIRTH_DATE);
        }
        parseAndValidateDate(birthDateStr, Constants.LABEL_BIRTH_DATE);
    }

    /**
     * Kiểm tra tính hợp lệ của địa chỉ Email.
     *
     * @param email địa chỉ email
     */
    private void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw BusinessException.required(Constants.LABEL_EMAIL);
        }
        if (email.length() > Constants.MAX_EMAIL_LENGTH) {
            throw BusinessException.maxLength(Constants.LABEL_EMAIL, Constants.MAX_EMAIL_LENGTH);
        }
        if (!HALF_SIZE_ASCII_PATTERN.matcher(email).matches()) {
            throw BusinessException.halfSize(Constants.LABEL_EMAIL);
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw BusinessException.invalidFormat(Constants.LABEL_EMAIL, "email");
        }
    }

    /**
     * Kiểm tra tính hợp lệ của số điện thoại.
     *
     * @param phone số điện thoại
     */
    private void validateTelephone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw BusinessException.required(Constants.LABEL_TELEPHONE);
        }
        if (phone.length() > Constants.MAX_TELEPHONE_LENGTH) {
            throw BusinessException.maxLength(Constants.LABEL_TELEPHONE, Constants.MAX_TELEPHONE_LENGTH);
        }
        if (!TELEPHONE_PATTERN.matcher(phone).matches()) {
            throw BusinessException.halfSize(Constants.LABEL_TELEPHONE);
        }
    }

    /**
     * Kiểm tra tính hợp lệ của thông tin chứng chỉ tiếng Nhật.
     *
     * @param certId mã chứng chỉ
     * @param startDateStr ngày bắt đầu hiệu lực
     * @param endDateStr ngày kết thúc hiệu lực
     * @param score điểm chứng chỉ
     */
    private void validateCertifications(Long certId, String startDateStr, String endDateStr, BigDecimal score) {
        if (certId == null || certId <= 0) {
            return;
        }

        // 1. Kiểm tra tồn tại chứng chỉ trong DB
        if (!certificationRepository.existsById(certId)) {
            throw BusinessException.notFound(Constants.LABEL_CERTIFICATION);
        }

        // 2. Kiểm tra ngày cấp chứng chỉ (startDate)
        if (startDateStr == null || startDateStr.trim().isEmpty()) {
            throw BusinessException.requiredSelect(Constants.LABEL_CERT_START_DATE);
        }
        LocalDate startDate = parseAndValidateDate(startDateStr, Constants.LABEL_CERT_START_DATE);

        // 3. Kiểm tra ngày hết hạn chứng chỉ (endDate)
        if (endDateStr == null || endDateStr.trim().isEmpty()) {
            throw BusinessException.requiredSelect(Constants.LABEL_CERT_END_DATE);
        }
        LocalDate endDate = parseAndValidateDate(endDateStr, Constants.LABEL_CERT_END_DATE);

        // 4. Kiểm tra logic ngày hết hạn phải sau ngày cấp (ER012)
        if (!endDate.isAfter(startDate)) {
            throw BusinessException.endDateBeforeStartDate(Constants.LABEL_CERT_END_DATE, Constants.LABEL_CERT_START_DATE);
        }

        // 5. Kiểm tra điểm số chứng chỉ (bắt buộc nhập và không được âm)
        if (score == null) {
            throw BusinessException.required(Constants.LABEL_SCORE);
        }
        if (score.compareTo(BigDecimal.ZERO) < 0) {
            throw BusinessException.range(Constants.LABEL_SCORE, 0, Integer.MAX_VALUE);
        }
    }

    /**
     * Chuyển đổi và kiểm tra tính hợp lệ của chuỗi ngày tháng theo định dạng yyyy/MM/dd.
     *
     * @param dateStr chuỗi ngày tháng cần parse
     * @param fieldLabel nhãn của trường dữ liệu để đưa vào thông báo lỗi
     * @return đối tượng LocalDate sau khi parse thành công
     * @throws BusinessException nếu không đúng định dạng ngày tháng hợp lệ (ER011)
     */
    private LocalDate parseAndValidateDate(String dateStr, String fieldLabel) {
        try {
            return LocalDate.parse(dateStr, Constants.DEFAULT_DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            throw BusinessException.invalidDate(fieldLabel);
        }
    }
}
