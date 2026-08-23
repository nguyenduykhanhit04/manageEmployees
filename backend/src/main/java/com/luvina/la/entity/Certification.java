/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * Certification.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.entity;

import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;

/**
 * Entity lưu trữ thông tin chứng chỉ.
 *
 * @author nguyenduykhanh2
 */
@Entity
@Table(name = "certifications")
@Getter
@Setter
public class Certification implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certification_id", unique = true, nullable = false)
    private Long certificationId;

    @Column(name = "certification_name", unique = true, nullable = false, length = 50)
    private String certificationName;

    @Column(name = "certification_level", nullable = false)
    private Integer certificationLevel;
}
