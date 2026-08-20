package com.luvina.la.entity;

import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;

@Entity
@Table(name = "certifications")
@Getter
@Setter
public class Certification implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certification_id", unique = true, nullable = false)
    private Long certification_id;

    @Column(name = "certification_name", unique = true, nullable = false)
    private String certificationName;
}
