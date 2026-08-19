package com.luvina.la.entity;

/**
 * Copyright(C) 2026 Luvina Software Company
 * <p>
 * Department.java, 19/08/2026 nguyenduykhanh2
 */
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.io.Serializable;

/**
 * Entity class đại diện cho bảng phòng ban (departments) trong database.
 * Lớp này chứa thông tin chi tiết về phòng ban trong công ty.
 *
 * @author nguyenduykhanh2
 * @since 1.0
 */
@Entity
@Table(name = "departments")
@Getter
@Setter
public class Department implements Serializable {

    private static final long serialVersionUID = 374901496785272389L;

    /**
     * ID duy nhất của phòng ban (Primary Key).
     * Được tự động tăng bởi database (Auto Increment).
     * Giá trị không âm, duy nhất và bắt buộc.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id", unique = true, nullable = false)
    private Long departmentId;

    /**
     * Tên của phòng ban (ví dụ: Phòng QAT, Phòng DEV1, etc.).
     * Độ dài tối đa 50 ký tự.
     * Trường bắt buộc (NOT NULL).
     */
    @Column(name = "department_name", nullable = false, length = 50)
    private String departmentName;
}
