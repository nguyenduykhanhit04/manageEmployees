/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeValidatorTest.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.validator;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

import com.luvina.la.config.Constants;
import com.luvina.la.exception.BusinessException;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Unit test kiểm tra tính hợp lệ của dữ liệu đầu vào trong EmployeeValidator.
 *
 * @author nguyenduykhanh2
 */
class EmployeeValidatorTest {

    private EmployeeValidator employeeValidator;
    private EmployeeRepository employeeRepository;
    private DepartmentRepository departmentRepository;
    private CertificationRepository certificationRepository;

    @BeforeEach
    void setUp() {
        employeeRepository = mock(EmployeeRepository.class);
        departmentRepository = mock(DepartmentRepository.class);
        certificationRepository = mock(CertificationRepository.class);
        employeeValidator = new EmployeeValidator(employeeRepository, departmentRepository, certificationRepository);
    }

    @Test
    void testValidateGetEmployees_Success() {
        assertDoesNotThrow(() -> employeeValidator.validateGetEmployees(
                "Nguyen Van A",
                0,
                20,
                Map.of(Constants.ORDER_KEY_EMPLOYEE_NAME, Constants.SORT_ASC)));
    }

    @Test
    void testValidateGetEmployees_InvalidOffset() {
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateGetEmployees("Nguyen Van A", -1, 20, null));

        assertEquals(Constants.ERROR_CODE_INVALID_PAGING, ex.getErrorCode());
    }

    @Test
    void testValidateGetEmployees_InvalidLimit() {
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateGetEmployees("Nguyen Van A", 0, 0, null));

        assertEquals(Constants.ERROR_CODE_INVALID_PAGING, ex.getErrorCode());
    }

    @Test
    void testValidateGetEmployees_NameTooLong() {
        String longName = "A".repeat(Constants.MAX_EMPLOYEE_NAME_LENGTH + 1);
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateGetEmployees(longName, 0, 20, null));

        assertEquals(Constants.ERROR_CODE_INVALID_EMPLOYEE_NAME, ex.getErrorCode());
    }

    @Test
    void testValidateGetEmployees_InvalidOrderKey() {
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateGetEmployees("Nguyen Van A", 0, 20, Map.of("invalid_key", "ASC")));

        assertEquals(Constants.ERROR_CODE_INVALID_SORT, ex.getErrorCode());
    }

    @Test
    void testValidateGetEmployees_InvalidSortDirection() {
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateGetEmployees(
                        "Nguyen Van A",
                        0,
                        20,
                        Map.of(Constants.ORDER_KEY_EMPLOYEE_NAME, "INVALID")));

        assertEquals(Constants.ERROR_CODE_INVALID_SORT, ex.getErrorCode());
    }

    @Test
    void testValidateGetEmployee_Success() {
        assertDoesNotThrow(() -> employeeValidator.validateGetEmployee(1L));
    }

    @Test
    void testValidateGetEmployee_NullId() {
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateGetEmployee(null));

        assertEquals(Constants.ER001, ex.getErrorCode());
        assertEquals(Constants.LABEL_ID, ex.getParams().get(0));
    }

    @Test
    void testValidateGetEmployee_InvalidIdZeroOrNegative() {
        BusinessException exZero = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateGetEmployee(0L));
        assertEquals(Constants.ER001, exZero.getErrorCode());

        BusinessException exNegative = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateGetEmployee(-5L));
        assertEquals(Constants.ER001, exNegative.getErrorCode());
    }

    @Test
    void testValidateDeleteEmployee_Success() {
        com.luvina.la.entity.EmployeeEntity employee = new com.luvina.la.entity.EmployeeEntity();
        employee.setEmployeeId(1L);
        employee.setEmployeeRole(Constants.ROLE_USER);
        org.mockito.Mockito.when(employeeRepository.findById(1L)).thenReturn(java.util.Optional.of(employee));
        assertDoesNotThrow(() -> employeeValidator.validateDeleteEmployee(1L));
    }

    @Test
    void testValidateDeleteEmployee_AdminRole_ThrowsER020() {
        com.luvina.la.entity.EmployeeEntity adminEmployee = new com.luvina.la.entity.EmployeeEntity();
        adminEmployee.setEmployeeId(1L);
        adminEmployee.setEmployeeRole(Constants.ROLE_ADMIN);
        org.mockito.Mockito.when(employeeRepository.findById(1L)).thenReturn(java.util.Optional.of(adminEmployee));

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateDeleteEmployee(1L));
        assertEquals(Constants.ER020, ex.getErrorCode());
    }

    @Test
    void testValidateDeleteEmployee_NullOrInvalidId() {
        BusinessException exNull = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateDeleteEmployee(null));
        assertEquals(Constants.ER001, exNull.getErrorCode());
        assertEquals(Constants.LABEL_ID, exNull.getParams().get(0));

        BusinessException exZero = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateDeleteEmployee(0L));
        assertEquals(Constants.ER001, exZero.getErrorCode());
    }

    @Test
    void testValidateDeleteEmployee_NotFound() {
        org.mockito.Mockito.when(employeeRepository.findById(999L)).thenReturn(java.util.Optional.empty());
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateDeleteEmployee(999L));
        assertEquals(Constants.ER014, ex.getErrorCode());
        assertEquals(Constants.LABEL_ID, ex.getParams().get(0));
    }

    @Test
    void testValidateAddEmployee_KatakanaHalfWidth_Success() {
        com.luvina.la.payload.request.EmployeeSaveRequest request = new com.luvina.la.payload.request.EmployeeSaveRequest();
        request.setEmployeeLoginId("user01");
        request.setDepartmentId(1L);
        request.setEmployeeName("Nguyen Van A");
        request.setEmployeeNameKana("ﾀﾅｶ ﾀﾛｳ");
        request.setEmployeeBirthDate("1990/01/01");
        request.setEmployeeEmail("test@luvina.net");
        request.setEmployeeTelephone("0123456789");
        request.setEmployeeLoginPassword("Password123!");

        org.mockito.Mockito.when(employeeRepository.existsByEmployeeLoginId("user01")).thenReturn(false);
        org.mockito.Mockito.when(departmentRepository.existsById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> employeeValidator.validateAddEmployee(request));
    }

    @Test
    void testValidateAddEmployee_KatakanaFullWidth_ThrowsER009() {
        com.luvina.la.payload.request.EmployeeSaveRequest request = new com.luvina.la.payload.request.EmployeeSaveRequest();
        request.setEmployeeLoginId("user01");
        request.setDepartmentId(1L);
        request.setEmployeeName("Nguyen Van A");
        request.setEmployeeNameKana("タナカ タロウ");
        request.setEmployeeBirthDate("1990/01/01");
        request.setEmployeeEmail("test@luvina.net");
        request.setEmployeeTelephone("0123456789");
        request.setEmployeeLoginPassword("Password123!");

        org.mockito.Mockito.when(employeeRepository.existsByEmployeeLoginId("user01")).thenReturn(false);
        org.mockito.Mockito.when(departmentRepository.existsById(1L)).thenReturn(true);

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateAddEmployee(request));
        assertEquals(Constants.ER009, ex.getErrorCode());
        assertEquals(Constants.LABEL_EMPLOYEE_NAME_KANA, ex.getParams().get(0));
    }

    @Test
    void testValidateUpdateEmployee_KatakanaFullWidth_ThrowsER009() {
        com.luvina.la.payload.request.EmployeeSaveRequest request = new com.luvina.la.payload.request.EmployeeSaveRequest();
        request.setEmployeeLoginId("user01");
        request.setDepartmentId(1L);
        request.setEmployeeName("Nguyen Van A");
        request.setEmployeeNameKana("カタカナ");
        request.setEmployeeBirthDate("1990/01/01");
        request.setEmployeeEmail("test@luvina.net");
        request.setEmployeeTelephone("0123456789");

        org.mockito.Mockito.when(employeeRepository.existsById(1L)).thenReturn(true);
        org.mockito.Mockito.when(departmentRepository.existsById(1L)).thenReturn(true);

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateUpdateEmployee(1L, request));
        assertEquals(Constants.ER009, ex.getErrorCode());
        assertEquals(Constants.LABEL_EMPLOYEE_NAME_KANA, ex.getParams().get(0));
    }

    @Test
    void testValidateAddEmployee_EmailFullWidth_ThrowsER008() {
        com.luvina.la.payload.request.EmployeeSaveRequest request = new com.luvina.la.payload.request.EmployeeSaveRequest();
        request.setEmployeeLoginId("user01");
        request.setDepartmentId(1L);
        request.setEmployeeName("Nguyen Van A");
        request.setEmployeeNameKana("ﾀﾅｶ ﾀﾛｳ");
        request.setEmployeeBirthDate("1990/01/01");
        request.setEmployeeEmail("ｎｇａ＠ｌｕｖｉｎａ．ｎｅｔ");
        request.setEmployeeTelephone("0123456789");
        request.setEmployeeLoginPassword("Password123!");

        org.mockito.Mockito.when(employeeRepository.existsByEmployeeLoginId("user01")).thenReturn(false);
        org.mockito.Mockito.when(departmentRepository.existsById(1L)).thenReturn(true);

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateAddEmployee(request));
        assertEquals(Constants.ER008, ex.getErrorCode());
        assertEquals(Constants.LABEL_EMAIL, ex.getParams().get(0));
    }

    @Test
    void testValidateAddEmployee_EmailInvalidFormat_ThrowsER005() {
        com.luvina.la.payload.request.EmployeeSaveRequest request = new com.luvina.la.payload.request.EmployeeSaveRequest();
        request.setEmployeeLoginId("user01");
        request.setDepartmentId(1L);
        request.setEmployeeName("Nguyen Van A");
        request.setEmployeeNameKana("ﾀﾅｶ ﾀﾛｳ");
        request.setEmployeeBirthDate("1990/01/01");
        request.setEmployeeEmail("invalid-email-format");
        request.setEmployeeTelephone("0123456789");
        request.setEmployeeLoginPassword("Password123!");

        org.mockito.Mockito.when(employeeRepository.existsByEmployeeLoginId("user01")).thenReturn(false);
        org.mockito.Mockito.when(departmentRepository.existsById(1L)).thenReturn(true);

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateAddEmployee(request));
        assertEquals(Constants.ER005, ex.getErrorCode());
        assertEquals(Constants.LABEL_EMAIL, ex.getParams().get(0));
    }

    @Test
    void testValidateAddEmployee_CertEndDateEqualsStartDate_ThrowsER012() {
        com.luvina.la.payload.request.EmployeeSaveRequest request = new com.luvina.la.payload.request.EmployeeSaveRequest();
        request.setEmployeeLoginId("user01");
        request.setDepartmentId(1L);
        request.setEmployeeName("Nguyen Van A");
        request.setEmployeeNameKana("ﾀﾅｶ ﾀﾛｳ");
        request.setEmployeeBirthDate("1990/01/01");
        request.setEmployeeEmail("test@luvina.net");
        request.setEmployeeTelephone("0123456789");
        request.setEmployeeLoginPassword("Password123!");
        request.setCertificationId(1L);
        request.setCertificationStartDate("2023/01/01");
        request.setCertificationEndDate("2023/01/01");
        request.setEmployeeCertificationScore(new java.math.BigDecimal("900"));

        org.mockito.Mockito.when(employeeRepository.existsByEmployeeLoginId("user01")).thenReturn(false);
        org.mockito.Mockito.when(departmentRepository.existsById(1L)).thenReturn(true);
        org.mockito.Mockito.when(certificationRepository.existsById(1L)).thenReturn(true);

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateAddEmployee(request));
        assertEquals(Constants.ER012, ex.getErrorCode());
        assertEquals(Constants.LABEL_CERT_END_DATE, ex.getParams().get(0));
        assertEquals(Constants.LABEL_CERT_START_DATE, ex.getParams().get(1));
    }

    @Test
    void testValidateAddEmployee_CertEndDateAfterStartDate_Success() {
        com.luvina.la.payload.request.EmployeeSaveRequest request = new com.luvina.la.payload.request.EmployeeSaveRequest();
        request.setEmployeeLoginId("user01");
        request.setDepartmentId(1L);
        request.setEmployeeName("Nguyen Van A");
        request.setEmployeeNameKana("ﾀﾅｶ ﾀﾛｳ");
        request.setEmployeeBirthDate("1990/01/01");
        request.setEmployeeEmail("test@luvina.net");
        request.setEmployeeTelephone("0123456789");
        request.setEmployeeLoginPassword("Password123!");
        request.setCertificationId(1L);
        request.setCertificationStartDate("2023/01/01");
        request.setCertificationEndDate("2023/01/02");
        request.setEmployeeCertificationScore(new java.math.BigDecimal("900"));

        org.mockito.Mockito.when(employeeRepository.existsByEmployeeLoginId("user01")).thenReturn(false);
        org.mockito.Mockito.when(departmentRepository.existsById(1L)).thenReturn(true);
        org.mockito.Mockito.when(certificationRepository.existsById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> employeeValidator.validateAddEmployee(request));
    }
}


