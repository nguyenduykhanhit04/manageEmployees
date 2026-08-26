/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * DepartmentEntity.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity ánh xạ bảng departments trong cơ sở dữ liệu.
 *
 * @author nguyenduykhanh2
 */
@Entity
@Table(name = "departments")
@Getter
@Setter
public class DepartmentEntity implements Serializable {

    private static final long serialVersionUID = 374901496785272389L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id", unique = true, nullable = false)
    private Long departmentId;

    @Column(name = "department_name", nullable = false, length = 50)
    private String departmentName;
}
