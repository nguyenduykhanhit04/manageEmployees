package com.luvina.la.entity;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

import lombok.Data;

@Entity
@Table(name = "employees")
@Data
public class Employee implements Serializable {

    private static final long serialVersionUID = 5771173953267484096L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id", unique = true, nullable = false)
    private Long employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private String departmentId;

    @Column(name = "employee_name", nullable = false, length = 255)
    private String employeeName;

    @Column(name = "employee_name_kana", length = 255)
    private String employeeNameKana;

    @Column(name = "employee_birth_date")
    private LocalDate employeeBirthDate;

    @Column(name = "employee_email", nullable = false, length = 255)
    private String employeeEmail;

    @Column(name = "employee_telephone", length = 50)
    private String employeeTelephone;

    @Column(name = "employee_login_id", nullable = false, unique = true, length = 50)
    private String employeeLoginId;

    @Column(name = "employee_login_password", length = 255)
    private String employeeLoginPassword;

    @Column(name = "employee_role", nullable = false)
    private Integer employeeRole = 1; // 0: Admin, 1: User
}
