/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeValidatorTest.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.validator;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.luvina.la.config.Constants;
import com.luvina.la.exception.BusinessException;
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

    @BeforeEach
    void setUp() {
        employeeValidator = new EmployeeValidator();
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
}
