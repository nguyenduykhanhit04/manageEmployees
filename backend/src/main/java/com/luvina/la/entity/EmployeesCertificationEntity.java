/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeesCertificationEntity.java, 07/09/2026 nguyenduykhanh2
 */
package com.luvina.la.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity ánh xạ bảng employees_certifications trong cơ sở dữ liệu.
 *
 * @author nguyenduykhanh2
 */
@Entity
@Table(name = "employees_certifications")
@Getter
@Setter
@NoArgsConstructor
public class EmployeesCertificationEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_certification_id", unique = true, nullable = false)
    private Long employeeCertificationId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "certification_id", nullable = false)
    private Long certificationId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "score", nullable = false, precision = 10, scale = 2)
    private BigDecimal score;

    public EmployeesCertificationEntity(Long employeeId, Long certificationId, LocalDate startDate, LocalDate endDate, BigDecimal score) {
        this.employeeId = employeeId;
        this.certificationId = certificationId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.score = score;
    }
}
