/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationEntity.java, 25/08/2026 nguyenduykhanh2
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
 * Entity ánh xạ bảng certifications trong cơ sở dữ liệu.
 *
 * @author nguyenduykhanh2
 */
@Entity
@Table(name = "certifications")
@Getter
@Setter
public class CertificationEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certification_id", unique = true, nullable = false)
    private Long certificationId;

    @Column(name = "certification_name", unique = true, nullable = false)
    private String certificationName;
}
