/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeServiceImplTest.java, 08/09/2026 nguyenduykhanh2
 */
package com.luvina.la.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.luvina.la.config.Constants;
import com.luvina.la.exception.BusinessException;
import com.luvina.la.mapper.EmployeeMapper;
import com.luvina.la.payload.response.EmployeeDetailResponse;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.repository.EmployeesCertificationRepository;
import com.luvina.la.service.impl.EmployeeServiceImpl;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Unit test kiểm tra các nghiệp vụ trong EmployeeServiceImpl.
 *
 * @author nguyenduykhanh2
 */
class EmployeeServiceImplTest {

    private EmployeeServiceImpl employeeService;
    private EmployeeRepository employeeRepository;
    private DepartmentRepository departmentRepository;
    private EmployeesCertificationRepository employeesCertificationRepository;
    private EmployeeMapper employeeMapper;
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        employeeRepository = mock(EmployeeRepository.class);
        departmentRepository = mock(DepartmentRepository.class);
        employeesCertificationRepository = mock(EmployeesCertificationRepository.class);
        employeeMapper = mock(EmployeeMapper.class);
        passwordEncoder = mock(PasswordEncoder.class);

        employeeService = new EmployeeServiceImpl(
                employeeRepository,
                departmentRepository,
                employeesCertificationRepository,
                employeeMapper,
                passwordEncoder
        );
    }

    @Test
    void testGetEmployeeDetail_Success() {
        EmployeeDetailResponse mockResponse = new EmployeeDetailResponse();
        mockResponse.setCode(Constants.CODE_SUCCESS);
        mockResponse.setEmployeeId(1L);
        mockResponse.setEmployeeName("Nguyễn Văn A");

        when(employeeRepository.getEmployeeDetail(1L)).thenReturn(Optional.of(mockResponse));

        EmployeeDetailResponse result = employeeService.getEmployeeDetail(1L);

        assertNotNull(result);
        assertEquals(1L, result.getEmployeeId());
        assertEquals("Nguyễn Văn A", result.getEmployeeName());
        assertEquals(200, result.getCode());
    }

    @Test
    void testGetEmployeeDetail_NotFound_ThrowsER013() {
        when(employeeRepository.getEmployeeDetail(999L)).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeService.getEmployeeDetail(999L)
        );

        assertEquals(Constants.ER013, ex.getErrorCode());
        assertEquals(Constants.LABEL_ID, ex.getParams().get(0));
    }

    @Test
    void testDeleteEmployee_Success() {
        Long employeeId = 1L;

        Long result = employeeService.deleteEmployee(employeeId);

        assertEquals(employeeId, result);
        org.mockito.Mockito.verify(employeesCertificationRepository, org.mockito.Mockito.times(1)).deleteByEmployeeId(employeeId);
        org.mockito.Mockito.verify(employeeRepository, org.mockito.Mockito.times(1)).deleteById(employeeId);
    }

    @Test
    void testCheckEmployeeExist_Success() {
        Long employeeId = 1L;
        when(employeeRepository.existsById(employeeId)).thenReturn(true);

        // Should not throw exception
        employeeService.checkEmployeeExist(employeeId);

        org.mockito.Mockito.verify(employeeRepository, org.mockito.Mockito.times(1)).existsById(employeeId);
    }

    @Test
    void testCheckEmployeeExist_NotFound_ThrowsER013() {
        Long employeeId = 999L;
        when(employeeRepository.existsById(employeeId)).thenReturn(false);

        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> employeeService.checkEmployeeExist(employeeId)
        );

        assertEquals(Constants.ER013, ex.getErrorCode());
    }
}
