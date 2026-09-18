/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * BusinessExceptionTest.java, 18/09/2026 nguyenduykhanh2
 */
package com.luvina.la.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.luvina.la.config.Constants;
import java.util.List;
import org.junit.jupiter.api.Test;

/**
 * Unit test kiểm tra các constructor và factory method tiện ích của BusinessException.
 *
 * @author nguyenduykhanh2
 */
class BusinessExceptionTest {

    @Test
    void testConstructorWithErrorCodeOnly() {
        BusinessException ex = new BusinessException(Constants.ER015);
        assertEquals(Constants.ER015, ex.getErrorCode());
        assertNotNull(ex.getParams());
        assertTrue(ex.getParams().isEmpty());
    }

    @Test
    void testConstructorWithListParams() {
        BusinessException ex = new BusinessException(Constants.ER001, List.of(Constants.LABEL_EMPLOYEE_NAME));
        assertEquals(Constants.ER001, ex.getErrorCode());
        assertEquals(1, ex.getParams().size());
        assertEquals(Constants.LABEL_EMPLOYEE_NAME, ex.getParams().get(0));
    }

    @Test
    void testConstructorWithVarargs() {
        BusinessException ex = new BusinessException(
                Constants.ER006,
                Constants.LABEL_EMPLOYEE_NAME,
                String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)
        );
        assertEquals(Constants.ER006, ex.getErrorCode());
        assertEquals(List.of(Constants.LABEL_EMPLOYEE_NAME, "125"), ex.getParams());
    }

    @Test
    void testFactoryOf() {
        BusinessException ex = BusinessException.of(Constants.ER020);
        assertEquals(Constants.ER020, ex.getErrorCode());
        assertTrue(ex.getParams().isEmpty());

        BusinessException ex2 = BusinessException.of(Constants.ER001, Constants.LABEL_ACCOUNT_NAME);
        assertEquals(Constants.ER001, ex2.getErrorCode());
        assertEquals(List.of(Constants.LABEL_ACCOUNT_NAME), ex2.getParams());
    }

    @Test
    void testAllFactoryMethods() {
        // required (ER001)
        BusinessException reqEx = BusinessException.required(Constants.LABEL_EMPLOYEE_NAME);
        assertEquals(Constants.ER001, reqEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_EMPLOYEE_NAME), reqEx.getParams());

        // requiredSelect (ER002)
        BusinessException reqSelectEx = BusinessException.requiredSelect(Constants.LABEL_GROUP);
        assertEquals(Constants.ER002, reqSelectEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_GROUP), reqSelectEx.getParams());

        // alreadyExists (ER003)
        BusinessException existsEx = BusinessException.alreadyExists(Constants.LABEL_EMAIL);
        assertEquals(Constants.ER003, existsEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_EMAIL), existsEx.getParams());

        // notFound (ER004)
        BusinessException notFoundEx = BusinessException.notFound(Constants.LABEL_ID);
        assertEquals(Constants.ER004, notFoundEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_ID), notFoundEx.getParams());

        // invalidFormat (ER005)
        BusinessException fmtEx = BusinessException.invalidFormat(Constants.LABEL_EMAIL, "email");
        assertEquals(Constants.ER005, fmtEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_EMAIL, "email"), fmtEx.getParams());

        // maxLength (ER006)
        BusinessException maxLenEx = BusinessException.maxLength(Constants.LABEL_EMPLOYEE_NAME, 125);
        assertEquals(Constants.ER006, maxLenEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_EMPLOYEE_NAME, "125"), maxLenEx.getParams());

        // range (ER007)
        BusinessException rangeEx = BusinessException.range(Constants.LABEL_PASSWORD, 8, 50);
        assertEquals(Constants.ER007, rangeEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_PASSWORD, "8", "50"), rangeEx.getParams());

        // halfSize (ER008)
        BusinessException halfEx = BusinessException.halfSize(Constants.LABEL_TELEPHONE);
        assertEquals(Constants.ER008, halfEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_TELEPHONE), halfEx.getParams());

        // katakana (ER009)
        BusinessException kanaEx = BusinessException.katakana(Constants.LABEL_EMPLOYEE_NAME_KANA);
        assertEquals(Constants.ER009, kanaEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_EMPLOYEE_NAME_KANA), kanaEx.getParams());

        // invalidDate (ER011)
        BusinessException dateEx = BusinessException.invalidDate(Constants.LABEL_BIRTH_DATE);
        assertEquals(Constants.ER011, dateEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_BIRTH_DATE), dateEx.getParams());

        // endDateBeforeStartDate (ER012)
        BusinessException dateOrderEx = BusinessException.endDateBeforeStartDate(Constants.LABEL_CERT_END_DATE, Constants.LABEL_CERT_START_DATE);
        assertEquals(Constants.ER012, dateOrderEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_CERT_END_DATE, Constants.LABEL_CERT_START_DATE), dateOrderEx.getParams());

        // employeeNotFound (ER013)
        BusinessException empNotFoundEx = BusinessException.employeeNotFound(Constants.LABEL_ID);
        assertEquals(Constants.ER013, empNotFoundEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_ID), empNotFoundEx.getParams());

        // employeeDeleteNotFound (ER014)
        BusinessException empDelEx = BusinessException.employeeDeleteNotFound(Constants.LABEL_ID);
        assertEquals(Constants.ER014, empDelEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_ID), empDelEx.getParams());

        // systemError (ER015)
        BusinessException sysEx = BusinessException.systemError();
        assertEquals(Constants.ER015, sysEx.getErrorCode());
        assertTrue(sysEx.getParams().isEmpty());

        // invalidPaging (ER018)
        BusinessException pageEx = BusinessException.invalidPaging(Constants.OFFSET_PARAM_LABEL);
        assertEquals(Constants.ER018, pageEx.getErrorCode());
        assertEquals(List.of(Constants.OFFSET_PARAM_LABEL), pageEx.getParams());

        // invalidLoginId (ER019)
        BusinessException loginIdEx = BusinessException.invalidLoginId(Constants.LABEL_ACCOUNT_NAME);
        assertEquals(Constants.ER019, loginIdEx.getErrorCode());
        assertEquals(List.of(Constants.LABEL_ACCOUNT_NAME), loginIdEx.getParams());

        // cannotDeleteAdmin (ER020)
        BusinessException adminEx = BusinessException.cannotDeleteAdmin();
        assertEquals(Constants.ER020, adminEx.getErrorCode());
        assertTrue(adminEx.getParams().isEmpty());

        // invalidSort (ER021)
        BusinessException sortEx = BusinessException.invalidSort("invalid_key");
        assertEquals(Constants.ER021, sortEx.getErrorCode());
        assertEquals(List.of("invalid_key"), sortEx.getParams());
    }
}
