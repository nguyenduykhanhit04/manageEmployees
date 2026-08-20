package com.luvina.la.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface EmployeeDisplayDTO {
    Long getEmployeeId();
    String getEmployeeName();
    LocalDate getEmployeeBirthDate();
    String getDepartmentName();
    String getEmployeeEmail();
    String getEmployeeTelephone();
    String getCertificationName();
    LocalDate getEndDate();
    BigDecimal getScore();
}
