/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeServiceImpl.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.service.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.entity.DepartmentEntity;
import com.luvina.la.entity.EmployeeEntity;
import com.luvina.la.entity.EmployeesCertificationEntity;
import com.luvina.la.exception.BusinessException;
import com.luvina.la.mapper.EmployeeMapper;
import com.luvina.la.payload.request.EmployeeSaveRequest;
import com.luvina.la.payload.response.EmployeeDetailResponse;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.repository.EmployeesCertificationRepository;
import com.luvina.la.service.EmployeeService;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeesCertificationRepository employeesCertificationRepository;
    private final EmployeeMapper employeeMapper;
    private final PasswordEncoder passwordEncoder;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd");

    /**
     * Khởi tạo EmployeeServiceImpl với các dependencies cần thiết.
     *
     * @param employeeRepository repository thao tác với dữ liệu nhân viên
     * @param departmentRepository repository thao tác với dữ liệu phòng ban
     * @param employeesCertificationRepository repository thao tác với chứng chỉ nhân viên
     * @param employeeMapper mapper chuyển đổi đối tượng
     * @param passwordEncoder encoder mã hóa mật khẩu
     */
    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            EmployeesCertificationRepository employeesCertificationRepository,
            EmployeeMapper employeeMapper,
            PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.employeesCertificationRepository = employeesCertificationRepository;
        this.employeeMapper = employeeMapper;
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
     * @return đối tượng Page chứa danh sách nhân viên và thông tin phân trang
     */
    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeDTO> getEmployees(
            String employeeName,
            Long departmentId,
            Map<String, String> orderParams,
            int offset,
            int limit) {

        int pageSize = limit > 0 ? limit : 20;
        int pageIndex = offset / pageSize;
        Pageable pageable = PageRequest.of(pageIndex, pageSize);

        // 1. Escape các ký tự đặc biệt cho điều kiện LIKE
        String escapedName = escapeLikePattern(employeeName);

        // 2. Đếm tổng số bản ghi thỏa mãn điều kiện
        long totalRecords = employeeRepository.countEmployees(
                escapedName,
                departmentId);

        if (totalRecords <= 0) {
            return new PageImpl<>(new ArrayList<>(), pageable, 0L);
        }

        // 3. Lấy danh sách nhân viên từ repository tùy biến theo thứ tự ưu tiên sắp xếp động
        List<EmployeeDTO> employees = employeeRepository.findEmployees(
                escapedName,
                departmentId,
                orderParams,
                offset,
                limit);

        // 4. Trả về kết quả phân trang chuẩn của Spring Data
        return new PageImpl<>(employees, pageable, totalRecords);
    }

    /**
     * Thêm mới một nhân viên vào cơ sở dữ liệu (kèm chứng chỉ tiếng Nhật nếu có).
     * Toàn bộ thao tác thêm nhân viên và chứng chỉ được quản lý trong cùng một Transaction.
     *
     * @param request đối tượng chứa thông tin nhân viên cần thêm mới
     * @return mã định danh employeeId của nhân viên vừa được tạo
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createEmployee(EmployeeSaveRequest request) {
        // 1. Chuyển đổi từ Request sang EmployeeEntity
        EmployeeEntity employeeEntity = employeeMapper.toEntity(request);

        // 2. Mã hóa mật khẩu đăng nhập
        if (request.getEmployeeLoginPassword() != null && !request.getEmployeeLoginPassword().isEmpty()) {
            employeeEntity.setEmployeeLoginPassword(passwordEncoder.encode(request.getEmployeeLoginPassword()));
        }

        // 3. Mặc định gán quyền người dùng thông thường (ROLE_USER = 1)
        employeeEntity.setEmployeeRole(Constants.ROLE_USER);

        // 4. Lưu thông tin nhân viên vào bảng employees -> Tự sinh employee_id
        EmployeeEntity savedEmployee = employeeRepository.save(employeeEntity);

        // 5. Nếu có chọn chứng chỉ tiếng Nhật -> Lưu thông tin vào bảng employees_certifications
        if (request.getCertificationId() != null && request.getCertificationId() > 0) {
            LocalDate startDate = LocalDate.parse(request.getCertificationStartDate(), DATE_FORMATTER);
            LocalDate endDate = LocalDate.parse(request.getCertificationEndDate(), DATE_FORMATTER);

            EmployeesCertificationEntity certEntity = new EmployeesCertificationEntity(
                    savedEmployee.getEmployeeId(),
                    request.getCertificationId(),
                    startDate,
                    endDate,
                    request.getEmployeeCertificationScore()
            );

            employeesCertificationRepository.save(certEntity);
        }

        // 6. Trả về employeeId vừa được tạo
        return savedEmployee.getEmployeeId();
    }

    /**
     * Lấy thông tin chi tiết một nhân viên theo mã định danh employeeId.
     *
     * @param employeeId mã định danh nhân viên
     * @return đối tượng EmployeeDetailResponse chứa toàn bộ thông tin chi tiết
     * @throws BusinessException nếu nhân viên không tồn tại trong hệ thống (ER013)
     */
    @Override
    @Transactional(readOnly = true)
    public EmployeeDetailResponse getEmployeeDetail(Long employeeId) {
        return employeeRepository.getEmployeeDetail(employeeId)
                .orElseThrow(() -> new BusinessException(Constants.ER013, List.of(Constants.LABEL_ID)));
    }

    /**
     * Cập nhật thông tin nhân viên và chứng chỉ tiếng Nhật trong cơ sở dữ liệu.
     * Toàn bộ thao tác cập nhật được quản lý trong cùng một Transaction (rollback nếu có lỗi).
     *
     * @param employeeId mã định danh của nhân viên cần cập nhật
     * @param request đối tượng chứa thông tin cập nhật
     * @return mã định danh employeeId của nhân viên đã được cập nhật
     * @throws BusinessException nếu không tìm thấy nhân viên (ER013)
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long updateEmployee(Long employeeId, EmployeeSaveRequest request) {
        // 1. Tìm nhân viên cần cập nhật trong database
        EmployeeEntity employeeEntity = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new BusinessException(Constants.ER013, List.of(Constants.LABEL_ID)));

        // 2. Cập nhật các trường thông tin cơ bản
        employeeEntity.setEmployeeLoginId(request.getEmployeeLoginId());
        if (request.getDepartmentId() != null) {
            DepartmentEntity dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new BusinessException(Constants.ER004, List.of(Constants.LABEL_GROUP)));
            employeeEntity.setDepartment(dept);
        }
        employeeEntity.setEmployeeName(request.getEmployeeName());
        employeeEntity.setEmployeeNameKana(request.getEmployeeNameKana());
        if (request.getEmployeeBirthDate() != null && !request.getEmployeeBirthDate().isEmpty()) {
            employeeEntity.setEmployeeBirthDate(LocalDate.parse(request.getEmployeeBirthDate(), DATE_FORMATTER));
        }
        employeeEntity.setEmployeeEmail(request.getEmployeeEmail());
        employeeEntity.setEmployeeTelephone(request.getEmployeeTelephone());

        // 3. Nếu có nhập mật khẩu mới -> Mã hóa và cập nhật. Nếu để trống -> Giữ nguyên mật khẩu cũ
        if (request.getEmployeeLoginPassword() != null && !request.getEmployeeLoginPassword().trim().isEmpty()) {
            employeeEntity.setEmployeeLoginPassword(passwordEncoder.encode(request.getEmployeeLoginPassword()));
        }

        // 4. Lưu thông tin nhân viên vào bảng employees
        employeeRepository.save(employeeEntity);

        // 5. Cập nhật chứng chỉ tiếng Nhật: Xóa chứng chỉ cũ
        employeesCertificationRepository.deleteByEmployeeId(employeeId);

        // 6. Nếu có chọn chứng chỉ tiếng Nhật mới -> Lưu vào bảng employees_certifications
        if (request.getCertificationId() != null && request.getCertificationId() > 0) {
            LocalDate startDate = LocalDate.parse(request.getCertificationStartDate(), DATE_FORMATTER);
            LocalDate endDate = LocalDate.parse(request.getCertificationEndDate(), DATE_FORMATTER);

            EmployeesCertificationEntity certEntity = new EmployeesCertificationEntity(
                    employeeId,
                    request.getCertificationId(),
                    startDate,
                    endDate,
                    request.getEmployeeCertificationScore()
            );

            employeesCertificationRepository.save(certEntity);
        }

        // 7. Trả về employeeId đã cập nhật thành công
        return employeeId;
    }

    /**
     * Xóa thông tin nhân viên và các chứng chỉ tiếng Nhật liên quan.
     * Toàn bộ thao tác xóa được quản lý trong cùng một Transaction (rollback nếu có lỗi).
     *
     * @param employeeId mã định danh của nhân viên cần xóa
     * @return mã định danh employeeId của nhân viên đã được xóa
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long deleteEmployee(Long employeeId) {
        // 1. Xóa thông tin chứng chỉ tiếng Nhật của nhân viên trong bảng employees_certifications
        employeesCertificationRepository.deleteByEmployeeId(employeeId);

        // 2. Xóa thông tin nhân viên trong bảng employees
        employeeRepository.deleteById(employeeId);

        // 3. Trả về employeeId đã xóa thành công
        return employeeId;
    }

    /**
     * Kiểm tra sự tồn tại của nhân viên trong cơ sở dữ liệu.
     *
     * @param employeeId mã định danh nhân viên cần kiểm tra
     */
    @Override
    public void checkEmployeeExist(Long employeeId) {
        boolean exists = employeeRepository.existsById(employeeId);
        if (!exists) {
            throw new BusinessException(Constants.ER013, List.of(Constants.LABEL_ID));
        }
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
}