/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeServiceImpl.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.entity.Certification;
import com.luvina.la.entity.Department;
import com.luvina.la.entity.Employee;
import com.luvina.la.entity.EmployeeCertification;
import com.luvina.la.exception.BusinessException;
import com.luvina.la.payload.AddEmployeeRequest;
import com.luvina.la.payload.AddEmployeeResponse;
import com.luvina.la.payload.ApiErrorMessage;
import com.luvina.la.payload.CertificationRequest;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeCertificationRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation service xử lý các nghiệp vụ liên quan đến nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("uuuu/MM/dd").withResolverStyle(ResolverStyle.STRICT);
    private static final Pattern LOGIN_ID_PATTERN = Pattern.compile("^[a-zA-Z_][a-zA-Z0-9_]*$");
    private static final Pattern KATAKANA_PATTERN = Pattern.compile("^[\\u30A0-\\u30FF\\uFF66-\\uFF9F\\s]+$");
    private static final Pattern HALF_WIDTH_PATTERN = Pattern.compile("^[\\x00-\\x7F]+$");
    private static final Pattern DATE_STRING_PATTERN = Pattern.compile("^\\d{4}/\\d{2}/\\d{2}$");

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CertificationRepository certificationRepository;
    private final EmployeeCertificationRepository employeeCertificationRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Khởi tạo EmployeeServiceImpl với các Repository và PasswordEncoder cần thiết.
     *
     * @param employeeRepository repository thao tác với dữ liệu nhân viên
     * @param departmentRepository repository thao tác với dữ liệu phòng ban
     * @param certificationRepository repository thao tác với dữ liệu chứng chỉ
     * @param employeeCertificationRepository repository thao tác với dữ liệu chứng chỉ nhân viên
     * @param passwordEncoder component mã hóa mật khẩu
     */
    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository,
            EmployeeCertificationRepository employeeCertificationRepository,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.certificationRepository = certificationRepository;
        this.employeeCertificationRepository = employeeCertificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp và phân trang.
     *
     * @param employeeName tên nhân viên cần tìm kiếm
     * @param departmentId mã phòng ban cần tìm kiếm
     * @param orderParams các tham số sắp xếp
     * @param offset vị trí bắt đầu lấy dữ liệu
     * @param limit số lượng bản ghi tối đa được lấy
     * @return thông tin phản hồi chứa mã response và danh sách nhân viên
     */
    @Override
    @Transactional(readOnly = true)
    public EmployeeListResponse getEmployees(
            String employeeName,
            Long departmentId,
            Map<String, String> orderParams,
            int offset,
            int limit) {

        // Kiểm tra điều kiện phân trang.
        if (offset < 0 || limit <= 0) {
            return new EmployeeListResponse(
                    Constants.CODE_ERROR,
                    new ApiErrorMessage(
                            Constants.ERROR_CODE_INVALID_PAGING,
                            List.of("offset/limit")));
        }

        // Kiểm tra độ dài tên nhân viên.
        if (employeeName != null
                && employeeName.length() >= Constants.MAX_EMPLOYEE_NAME_LENGTH) {
            return new EmployeeListResponse(
                    Constants.CODE_ERROR,
                    new ApiErrorMessage(
                            Constants.ERROR_CODE_INVALID_EMPLOYEE_NAME,
                            List.of(
                                     "氏名",
                                    String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH))));
        }

        // Kiểm tra giá trị các tham số sắp xếp.
        for (Map.Entry<String, String> entry : orderParams.entrySet()) {
            String value = entry.getValue();

            if (!Constants.SORT_ASC.equalsIgnoreCase(value)
                    && !Constants.SORT_DESC.equalsIgnoreCase(value)) {
                return new EmployeeListResponse(
                        Constants.CODE_ERROR,
                        new ApiErrorMessage(
                                Constants.ERROR_CODE_INVALID_SORT,
                                List.of(entry.getKey())));
            }
        }

        // Escape các ký tự đặc biệt cho điều kiện LIKE.
        String escapedName = escapeLikePattern(employeeName);

        // Đếm tổng số bản ghi.
        long totalRecords = employeeRepository.countDisplayEmployees(
                escapedName,
                departmentId);

        if (totalRecords <= 0) {
            return new EmployeeListResponse(
                    Constants.CODE_SUCCESS,
                    0L,
                    new ArrayList<>());
        }

        // Lấy danh sách nhân viên từ repository tùy biến theo thứ tự ưu tiên sắp xếp động.
        List<EmployeeDTO> employees = employeeRepository.findDisplayEmployees(
                escapedName,
                departmentId,
                orderParams,
                offset,
                limit);

        return new EmployeeListResponse(
                Constants.CODE_SUCCESS,
                totalRecords,
                employees);
    }

    /**
     * Thêm mới nhân viên và thông tin chứng chỉ tiếng Nhật liên quan.
     *
     * @param request thông tin nhân viên cần thêm mới
     * @return kết quả phản hồi chứa mã response và mã nhân viên vừa tạo
     */
    @Override
    @Transactional
    public AddEmployeeResponse addEmployee(AddEmployeeRequest request) {
        if (request == null) {
            throw new BusinessException(Constants.ER015);
        }

        // 1. Validate parameter [employeeLoginId]
        String loginId = request.getEmployeeLoginId();
        if (loginId == null || loginId.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_ACCOUNT_NAME));
        }
        loginId = loginId.trim();
        if (loginId.length() > 50) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_ACCOUNT_NAME));
        }
        if (!LOGIN_ID_PATTERN.matcher(loginId).matches()) {
            throw new BusinessException(Constants.ER019, List.of(Constants.LABEL_ACCOUNT_NAME));
        }
        if (employeeRepository.findByEmployeeLoginId(loginId).isPresent()) {
            throw new BusinessException(Constants.ER003, List.of(Constants.LABEL_ACCOUNT_NAME));
        }

        // 2. Validate parameter [employeeName]
        String name = request.getEmployeeName();
        if (name == null || name.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMPLOYEE_NAME));
        }
        name = name.trim();
        if (name.length() > 125) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_EMPLOYEE_NAME));
        }

        // 3. Validate parameter [employeeNameKana]
        String nameKana = request.getEmployeeNameKana();
        if (nameKana == null || nameKana.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMPLOYEE_NAME_KANA));
        }
        nameKana = nameKana.trim();
        if (nameKana.length() > 125) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_EMPLOYEE_NAME_KANA));
        }
        if (!KATAKANA_PATTERN.matcher(nameKana).matches()) {
            throw new BusinessException(Constants.ER009, List.of(Constants.LABEL_EMPLOYEE_NAME_KANA));
        }

        // 4. Validate parameter [employeeBirthDate]
        String birthDateStr = request.getEmployeeBirthDate();
        if (birthDateStr == null || birthDateStr.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_BIRTH_DATE));
        }
        birthDateStr = birthDateStr.trim();
        if (!DATE_STRING_PATTERN.matcher(birthDateStr).matches()) {
            throw new BusinessException(Constants.ER005, List.of(Constants.LABEL_BIRTH_DATE, "yyyy/MM/dd"));
        }
        LocalDate birthDate;
        try {
            birthDate = LocalDate.parse(birthDateStr, DATE_FORMATTER);
        } catch (DateTimeParseException ex) {
            throw new BusinessException(Constants.ER011, List.of(Constants.LABEL_BIRTH_DATE));
        }

        // 5. Validate parameter [employeeEmail]
        String email = request.getEmployeeEmail();
        if (email == null || email.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMAIL));
        }
        email = email.trim();
        if (email.length() > 125) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_EMAIL));
        }

        // 6. Validate parameter [employeeTelephone]
        String telephone = request.getEmployeeTelephone();
        if (telephone == null || telephone.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_TELEPHONE));
        }
        telephone = telephone.trim();
        if (telephone.length() > 50) {
            throw new BusinessException(Constants.ER006, List.of(Constants.LABEL_TELEPHONE));
        }
        if (!HALF_WIDTH_PATTERN.matcher(telephone).matches()) {
            throw new BusinessException(Constants.ER008, List.of(Constants.LABEL_TELEPHONE));
        }

        // 7. Validate parameter [employeeLoginPassword]
        String password = request.getEmployeeLoginPassword();
        if (password == null || password.trim().isEmpty()) {
            throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_PASSWORD));
        }
        if (password.length() < 8 || password.length() > 50) {
            throw new BusinessException(Constants.ER007, List.of(Constants.LABEL_PASSWORD, "8", "50"));
        }

        // 8. Validate parameter [departmentId]
        Long departmentId = request.getDepartmentId();
        if (departmentId == null) {
            throw new BusinessException(Constants.ER002, List.of(Constants.LABEL_GROUP));
        }
        if (departmentId <= 0) {
            throw new BusinessException(Constants.ER018, List.of(Constants.LABEL_GROUP));
        }
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new BusinessException(Constants.ER004, List.of(Constants.LABEL_GROUP)));

        // 9. Validate certifications (nếu có)
        List<CertificationRequest> certRequests = request.getCertifications();
        List<ValidCertificationItem> validCertItems = new ArrayList<>();

        if (certRequests != null && !certRequests.isEmpty()) {
            for (CertificationRequest certReq : certRequests) {
                if (certReq == null) {
                    continue;
                }

                // Validate certificationId
                Long certId = certReq.getCertificationId();
                if (certId == null) {
                    throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_CERTIFICATION));
                }
                if (certId <= 0) {
                    throw new BusinessException(Constants.ER018, List.of(Constants.LABEL_CERTIFICATION));
                }
                Certification certEntity = certificationRepository.findById(certId)
                        .orElseThrow(() -> new BusinessException(Constants.ER004, List.of(Constants.LABEL_CERTIFICATION)));

                // Validate startDate
                String startDateStr = certReq.getStartDate();
                if (startDateStr == null || startDateStr.trim().isEmpty()) {
                    throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_CERT_START_DATE));
                }
                startDateStr = startDateStr.trim();
                if (!DATE_STRING_PATTERN.matcher(startDateStr).matches()) {
                    throw new BusinessException(Constants.ER005, List.of(Constants.LABEL_CERT_START_DATE, "yyyy/MM/dd"));
                }
                LocalDate startDate;
                try {
                    startDate = LocalDate.parse(startDateStr, DATE_FORMATTER);
                } catch (DateTimeParseException ex) {
                    throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_CERT_START_DATE));
                }

                // Validate endDate
                String endDateStr = certReq.getEndDate();
                if (endDateStr == null || endDateStr.trim().isEmpty()) {
                    throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_CERT_END_DATE));
                }
                endDateStr = endDateStr.trim();
                if (!DATE_STRING_PATTERN.matcher(endDateStr).matches()) {
                    throw new BusinessException(Constants.ER005, List.of(Constants.LABEL_CERT_END_DATE, "yyyy/MM/dd"));
                }
                LocalDate endDate;
                try {
                    endDate = LocalDate.parse(endDateStr, DATE_FORMATTER);
                } catch (DateTimeParseException ex) {
                    throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_CERT_END_DATE));
                }

                // Check endDate >= startDate (ER012)
                if (endDate.isBefore(startDate)) {
                    throw new BusinessException(Constants.ER012, new ArrayList<>());
                }

                // Validate score
                BigDecimal score = certReq.getScore();
                if (score == null) {
                    throw new BusinessException(Constants.ER001, List.of(Constants.LABEL_SCORE));
                }
                if (score.compareTo(BigDecimal.ZERO) <= 0) {
                    throw new BusinessException(Constants.ER018, List.of(Constants.LABEL_SCORE));
                }

                validCertItems.add(new ValidCertificationItem(certEntity, startDate, endDate, score));
            }
        }

        // 10. Insert Employee vào Database
        Employee employee = new Employee();
        employee.setDepartment(department);
        employee.setEmployeeName(name);
        employee.setEmployeeNameKana(nameKana);
        employee.setEmployeeBirthDate(birthDate);
        employee.setEmployeeEmail(email);
        employee.setEmployeeTelephone(telephone);
        employee.setEmployeeLoginId(loginId);
        employee.setEmployeeLoginPassword(passwordEncoder.encode(password));
        employee.setEmployeeRole(1); // 1: User

        Employee savedEmployee = employeeRepository.save(employee);

        // 11. Insert EmployeeCertification vào Database
        for (ValidCertificationItem certItem : validCertItems) {
            EmployeeCertification ec = new EmployeeCertification();
            ec.setEmployee(savedEmployee);
            ec.setCertification(certItem.certification);
            ec.setStartDate(certItem.startDate);
            ec.setEndDate(certItem.endDate);
            ec.setScore(certItem.score);
            employeeCertificationRepository.save(ec);
        }

        // 12. Tạo response thành công
        return new AddEmployeeResponse(
                Constants.CODE_SUCCESS,
                savedEmployee.getEmployeeId(),
                new ApiErrorMessage(Constants.MSG_ADD_SUCCESS, new ArrayList<>()));
    }

    /**
     * Escape các ký tự đặc biệt trong từ khóa tìm kiếm cho điều kiện LIKE.
     *
     * @param keyword từ khóa tìm kiếm
     * @return từ khóa đã được escape
     */
    private String escapeLikePattern(String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return keyword;
        }

        return keyword.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }

    /**
     * Lớp nội bộ lưu trữ dữ liệu chứng chỉ đã được validate hợp lệ.
     */
    private static class ValidCertificationItem {
        final Certification certification;
        final LocalDate startDate;
        final LocalDate endDate;
        final BigDecimal score;

        ValidCertificationItem(Certification certification, LocalDate startDate, LocalDate endDate, BigDecimal score) {
            this.certification = certification;
            this.startDate = startDate;
            this.endDate = endDate;
            this.score = score;
        }
    }
}