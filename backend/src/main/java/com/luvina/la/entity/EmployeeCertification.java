/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeCertification.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity lưu trữ thông tin chứng chỉ tiếng Nhật của nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Entity
@Table(name = "employees_certifications")
@Getter
@Setter
@NoArgsConstructor
public class EmployeeCertification implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_certification_id", unique = true, nullable = false)
    private Long employeeCertificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "score", nullable = false, precision = 10, scale = 2)
    private BigDecimal score;
}
