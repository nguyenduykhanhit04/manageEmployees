/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * GlobalExceptionHandlerTest.java, 22/8/2026 nguyenduykhanh2
 */
package com.luvina.la.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.luvina.la.config.Constants;
import com.luvina.la.payload.ApiResponse;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void testHandleBusinessException() {
        BusinessException ex = new BusinessException(Constants.ER001, List.of("account_name"));
        ResponseEntity<ApiResponse> response = exceptionHandler.handleBusinessException(ex);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(Constants.CODE_ERROR, response.getBody().getCode());
        assertEquals(Constants.ER001, response.getBody().getMessage().getCode());
        assertEquals(List.of("account_name"), response.getBody().getMessage().getParams());
    }

    @Test
    void testHandleGeneralException() {
        Exception ex = new RuntimeException("Unexpected error");
        ResponseEntity<ApiResponse> response = exceptionHandler.handleGeneralException(ex);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(Constants.CODE_ERROR, response.getBody().getCode());
        assertEquals(Constants.ER015, response.getBody().getMessage().getCode());
    }
}
