/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeServiceTest.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.luvina.la.config.Constants;
import com.luvina.la.entity.Certification;
import com.luvina.la.entity.Department;
import com.luvina.la.entity.Employee;
import com.luvina.la.exception.BusinessException;
import com.luvina.la.payload.AddEmployeeRequest;
import com.luvina.la.payload.AddEmployeeResponse;
import com.luvina.la.payload.CertificationRequest;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeCertificationRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.impl.EmployeeServiceImpl;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Unit Test cho EmployeeService (chức năng Add Employee).
 *
 * @author nguyenduykhanh2
 */
@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private EmployeeCertificationRepository employeeCertificationRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private AddEmployeeRequest validRequest;
    private Department testDepartment;
    private Certification testCert;

    @BeforeEach
    void setUp() {
        testDepartment = new Department();
        testDepartment.setDepartmentId(1L);
        testDepartment.setDepartmentName("Phòng DEV1");

        testCert = new Certification();
        testCert.setCertificationId(1L);
        testCert.setCertificationName("N1");
        testCert.setCertificationLevel(1);

        validRequest = new AddEmployeeRequest();
        validRequest.setEmployeeLoginId("duykhanh_01");
        validRequest.setEmployeeName("Nguyễn Duy Khánh");
        validRequest.setEmployeeNameKana("グエン ズイ カイン");
        validRequest.setEmployeeBirthDate("2000/01/01");
        validRequest.setEmployeeEmail("khanh@luvina.net");
        validRequest.setEmployeeTelephone("0987654321");
        validRequest.setEmployeeLoginPassword("Password123");
        validRequest.setDepartmentId(1L);
    }

    @Test
    @DisplayName("Thêm nhân viên thành công không có chứng chỉ")
    void testAddEmployeeSuccess_WithoutCertifications() {
        when(employeeRepository.findByEmployeeLoginId(validRequest.getEmployeeLoginId())).thenReturn(Optional.empty());
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(testDepartment));
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");

        Employee savedEmployee = new Employee();
        savedEmployee.setEmployeeId(10L);
        when(employeeRepository.save(any(Employee.class))).thenReturn(savedEmployee);

        AddEmployeeResponse response = employeeService.addEmployee(validRequest);

        assertNotNull(response);
        assertEquals(Constants.CODE_SUCCESS, response.getCode());
        assertEquals(10L, response.getEmployeeId());
        assertEquals(Constants.MSG_ADD_SUCCESS, response.getMessage().getCode());
        verify(employeeRepository, times(1)).save(any(Employee.class));
        verify(employeeCertificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Thêm nhân viên thành công có kèm chứng chỉ")
    void testAddEmployeeSuccess_WithCertifications() {
        CertificationRequest certReq = new CertificationRequest(1L, "2023/01/01", "2024/01/01", new BigDecimal("150"));
        validRequest.setCertifications(List.of(certReq));

        when(employeeRepository.findByEmployeeLoginId(validRequest.getEmployeeLoginId())).thenReturn(Optional.empty());
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(testDepartment));
        when(certificationRepository.findById(1L)).thenReturn(Optional.of(testCert));
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");

        Employee savedEmployee = new Employee();
        savedEmployee.setEmployeeId(11L);
        when(employeeRepository.save(any(Employee.class))).thenReturn(savedEmployee);

        AddEmployeeResponse response = employeeService.addEmployee(validRequest);

        assertNotNull(response);
        assertEquals(Constants.CODE_SUCCESS, response.getCode());
        assertEquals(11L, response.getEmployeeId());
        verify(employeeCertificationRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Lỗi ER001 khi thiếu tên tài khoản (login ID)")
    void testAddEmployee_MissingLoginId() {
        validRequest.setEmployeeLoginId(null);
        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER001, ex.getErrorCode());
        assertEquals(List.of(Constants.LABEL_ACCOUNT_NAME), ex.getParams());
    }

    @Test
    @DisplayName("Lỗi ER019 khi tên tài khoản không đúng định dạng regex")
    void testAddEmployee_InvalidLoginIdFormat() {
        validRequest.setEmployeeLoginId("123invalidStartWithNumber");
        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER019, ex.getErrorCode());
    }

    @Test
    @DisplayName("Lỗi ER003 khi tên tài khoản đã tồn tại trong DB")
    void testAddEmployee_DuplicateLoginId() {
        when(employeeRepository.findByEmployeeLoginId(validRequest.getEmployeeLoginId()))
                .thenReturn(Optional.of(new Employee()));
        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER003, ex.getErrorCode());
    }

    @Test
    @DisplayName("Lỗi ER009 khi Katakana chứa ký tự không hợp lệ")
    void testAddEmployee_InvalidKatakana() {
        validRequest.setEmployeeNameKana("Nguyen Duy Khanh");
        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER009, ex.getErrorCode());
    }

    @Test
    @DisplayName("Lỗi ER005 khi ngày sinh sai định dạng")
    void testAddEmployee_InvalidBirthDateFormat() {
        validRequest.setEmployeeBirthDate("01-01-2000");
        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER005, ex.getErrorCode());
    }

    @Test
    @DisplayName("Lỗi ER008 khi số điện thoại chứa ký tự 2-byte")
    void testAddEmployee_NonHalfWidthTelephone() {
        validRequest.setEmployeeTelephone("０９８７６５４３２１");
        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER008, ex.getErrorCode());
    }

    @Test
    @DisplayName("Lỗi ER007 khi mật khẩu dưới 8 ký tự")
    void testAddEmployee_ShortPassword() {
        validRequest.setEmployeeLoginPassword("pass");
        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER007, ex.getErrorCode());
    }

    @Test
    @DisplayName("Lỗi ER004 khi departmentId không tồn tại")
    void testAddEmployee_DepartmentNotFound() {
        when(employeeRepository.findByEmployeeLoginId(validRequest.getEmployeeLoginId())).thenReturn(Optional.empty());
        when(departmentRepository.findById(1L)).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER004, ex.getErrorCode());
        assertEquals(List.of(Constants.LABEL_GROUP), ex.getParams());
    }

    @Test
    @DisplayName("Lỗi ER012 khi ngày hết hạn chứng chỉ nhỏ hơn ngày bắt đầu")
    void testAddEmployee_CertEndDateBeforeStartDate() {
        CertificationRequest certReq = new CertificationRequest(1L, "2024/01/01", "2023/01/01", new BigDecimal("100"));
        validRequest.setCertifications(List.of(certReq));

        when(employeeRepository.findByEmployeeLoginId(validRequest.getEmployeeLoginId())).thenReturn(Optional.empty());
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(testDepartment));
        when(certificationRepository.findById(1L)).thenReturn(Optional.of(testCert));

        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.addEmployee(validRequest));
        assertEquals(Constants.ER012, ex.getErrorCode());
    }

    @Test
    @DisplayName("Lấy chi tiết nhân viên thành công kèm thông tin chứng chỉ")
    void testGetEmployeeById_Success_WithCertifications() {
        Employee emp = new Employee();
        emp.setEmployeeId(1L);
        emp.setEmployeeName("Nguyễn Văn A");
        emp.setEmployeeBirthDate(LocalDate.of(1990, 5, 20));
        emp.setEmployeeEmail("nguyenvana@luvina.net");
        emp.setEmployeeTelephone("0123456789");
        emp.setEmployeeNameKana("グエン ヴァン A");
        emp.setEmployeeLoginId("nguyenvana");
        emp.setDepartment(testDepartment);

        Certification cert = new Certification();
        cert.setCertificationId(1L);
        cert.setCertificationName("N1");
        cert.setCertificationLevel(1);

        com.luvina.la.entity.EmployeeCertification empCert = new com.luvina.la.entity.EmployeeCertification();
        empCert.setEmployee(emp);
        empCert.setCertification(cert);
        empCert.setStartDate(LocalDate.of(2023, 1, 1));
        empCert.setEndDate(LocalDate.of(2025, 1, 1));
        empCert.setScore(new BigDecimal("180"));

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(emp));
        when(employeeCertificationRepository.findByEmployeeEmployeeIdOrderByCertificationCertificationLevelAsc(1L))
                .thenReturn(List.of(empCert));

        var response = employeeService.getEmployeeById(1L);

        assertNotNull(response);
        assertEquals(200, response.getCode());
        assertEquals(1L, response.getEmployeeId());
        assertEquals("Nguyễn Văn A", response.getEmployeeName());
        assertEquals("1990/05/20", response.getEmployeeBirthDate());
        assertEquals("Phòng DEV1", response.getDepartmentName());
        assertEquals("nguyenvana@luvina.net", response.getEmployeeEmail());
        assertEquals("0123456789", response.getEmployeeTelephone());
        assertEquals("グエン ヴァン A", response.getEmployeeNameKana());
        assertEquals("nguyenvana", response.getEmployeeLoginId());
        assertEquals(1, response.getCertifications().size());
        assertEquals("N1", response.getCertifications().get(0).getCertificationName());
        assertEquals("2023/01/01", response.getCertifications().get(0).getStartDate());
        assertEquals("2025/01/01", response.getCertifications().get(0).getEndDate());
        assertEquals(new BigDecimal("180"), response.getCertifications().get(0).getScore());
    }

    @Test
    @DisplayName("Lấy chi tiết nhân viên thành công khi không có chứng chỉ")
    void testGetEmployeeById_Success_WithoutCertifications() {
        Employee emp = new Employee();
        emp.setEmployeeId(2L);
        emp.setEmployeeName("Trần Thị B");
        emp.setEmployeeBirthDate(LocalDate.of(1995, 10, 15));
        emp.setEmployeeEmail("tranthib@luvina.net");
        emp.setEmployeeTelephone("0987654321");
        emp.setEmployeeNameKana("トラン ティ B");
        emp.setEmployeeLoginId("tranthib");
        emp.setDepartment(testDepartment);

        when(employeeRepository.findById(2L)).thenReturn(Optional.of(emp));
        when(employeeCertificationRepository.findByEmployeeEmployeeIdOrderByCertificationCertificationLevelAsc(2L))
                .thenReturn(List.of());

        var response = employeeService.getEmployeeById(2L);

        assertNotNull(response);
        assertEquals(200, response.getCode());
        assertEquals(2L, response.getEmployeeId());
        assertEquals("Trần Thị B", response.getEmployeeName());
        assertEquals("1995/10/15", response.getEmployeeBirthDate());
        assertEquals(0, response.getCertifications().size());
    }

    @Test
    @DisplayName("Lỗi ER001 khi employeeId là null")
    void testGetEmployeeById_NullId_ThrowsER001() {
        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.getEmployeeById(null));
        assertEquals(Constants.ER001, ex.getErrorCode());
        assertEquals(List.of("ＩＤ"), ex.getParams());
    }

    @Test
    @DisplayName("Lỗi ER013 khi không tìm thấy nhân viên trong DB")
    void testGetEmployeeById_NotFound_ThrowsER013() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class, () -> employeeService.getEmployeeById(999L));
        assertEquals(Constants.ER013, ex.getErrorCode());
        assertEquals(List.of("ＩＤ"), ex.getParams());
    }
}
