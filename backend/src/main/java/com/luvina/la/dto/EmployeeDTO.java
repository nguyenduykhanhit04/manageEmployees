package com.luvina.la.dto;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import lombok.Data;

@Data
public class EmployeeDTO implements Serializable {

    private static final long serialVersionUID = 6868189362900231672L;

    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private String employeeLoginId;
}
