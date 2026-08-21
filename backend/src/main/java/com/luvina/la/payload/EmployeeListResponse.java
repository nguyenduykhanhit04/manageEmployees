package com.luvina.la.payload;

import com.luvina.la.dto.EmployeeDTO;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmployeeListResponse {
    private int code;
    private long totalRecords;
    private List<EmployeeDTO> employees = new ArrayList<>();
    private ApiErrorMessage message;

    // Response thành công
    public EmployeeListResponse(int code, long totalRecords, List<EmployeeDTO> employees) {
        this.code = code;
        this.totalRecords = totalRecords;
        this.employees = employees;
    }

    // Response lỗi (Validation)
    public EmployeeListResponse(int code, ApiErrorMessage message) {
        this.code = code;
        this.message = message;
    }
}
