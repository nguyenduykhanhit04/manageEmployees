/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeControllerTest.java, 08/09/2026 nguyenduykhanh2
 */
package com.luvina.la.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.luvina.la.config.Constants;
import com.luvina.la.payload.response.EmployeeDetailResponse;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.validator.EmployeeValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Unit test kiểm tra EmployeeController.
 *
 * @author nguyenduykhanh2
 */
class EmployeeControllerTest {

    private EmployeeController employeeController;
    private EmployeeService employeeService;
    private EmployeeValidator employeeValidator;

    @BeforeEach
    void setUp() {
        employeeService = mock(EmployeeService.class);
        employeeValidator = mock(EmployeeValidator.class);
        employeeController = new EmployeeController(employeeService, employeeValidator);
    }

    @Test
    void testGetEmployeeDetail_Success() {
        Long employeeId = 1L;
        EmployeeDetailResponse mockResponse = new EmployeeDetailResponse();
        mockResponse.setCode(Constants.CODE_SUCCESS);
        mockResponse.setEmployeeId(employeeId);
        mockResponse.setEmployeeName("Nguyễn Văn A");

        doNothing().when(employeeValidator).validateGetEmployee(employeeId);
        when(employeeService.getEmployeeDetail(employeeId)).thenReturn(mockResponse);

        ResponseEntity<EmployeeDetailResponse> response = employeeController.getEmployeeDetail(employeeId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getEmployeeId());
        assertEquals("Nguyễn Văn A", response.getBody().getEmployeeName());

        verify(employeeValidator).validateGetEmployee(employeeId);
        verify(employeeService).getEmployeeDetail(employeeId);
    }

    @Test
    void testDeleteEmployee_Success() {
        Long employeeId = 1L;

        doNothing().when(employeeValidator).validateDeleteEmployee(employeeId);
        when(employeeService.deleteEmployee(employeeId)).thenReturn(employeeId);

        ResponseEntity<com.luvina.la.payload.response.EmployeeDeleteResponse> response = employeeController.deleteEmployee(employeeId);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(200, response.getBody().getCode());
        assertEquals(employeeId, response.getBody().getEmployeeId());
        assertEquals(Constants.MSG_DELETE_SUCCESS, response.getBody().getMessage().getCode());

        verify(employeeValidator).validateDeleteEmployee(employeeId);
        verify(employeeService).deleteEmployee(employeeId);
    }
}
