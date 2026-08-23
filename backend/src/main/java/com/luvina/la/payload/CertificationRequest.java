/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * CertificationRequest.java, 23/8/2026 nguyenduykhanh2
 */
package com.luvina.la.payload;

import com.fasterxml.jackson.annotation.JsonAlias;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Payload chứa thông tin chứng chỉ tiếng Nhật trong request thêm/sửa nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificationRequest {

    private Long certificationId;

    @JsonAlias({"certificationStartDate", "startDate"})
    private String startDate;

    @JsonAlias({"certificationEndDate", "endDate"})
    private String endDate;

    @JsonAlias({"employeeCertificationScore", "score"})
    private BigDecimal score;
}
