/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * Department.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.entity;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.io.Serializable;

/**
 * Entity lưu trữ thông tin phòng ban.
 *
 * @author nguyenduykhanh2
 */
@Entity
@Table(name = "departments")
@Getter
@Setter
public class Department implements Serializable {

    private static final long serialVersionUID = 374901496785272389L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id", unique = true, nullable = false)
    private Long departmentId;

    @Column(name = "department_name", nullable = false, length = 50)
    private String departmentName;
}
