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
        org.mockito.Mockito.when(employeeRepository.existsById(1L)).thenReturn(true);
        assertDoesNotThrow(() -> employeeValidator.validateDeleteEmployee(1L));
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
        org.mockito.Mockito.when(employeeRepository.existsById(999L)).thenReturn(false);
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeValidator.validateDeleteEmployee(999L));
        assertEquals(Constants.ER014, ex.getErrorCode());
        assertEquals(Constants.LABEL_ID, ex.getParams().get(0));
    }
}

