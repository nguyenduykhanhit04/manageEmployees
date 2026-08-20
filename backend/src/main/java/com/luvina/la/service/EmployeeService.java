package com.luvina.la.service;

import com.luvina.la.payload.EmployeeListResponse;
import java.util.Map;

public interface EmployeeService {
    EmployeeListResponse getEmployees(String employeeName, Long departmentId, Map<String, String> orderParams, int offset, int limit);
}
