/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeCertificationDetailDTO.java, 08/09/2026 nguyenduykhanh2
 */
package com.luvina.la.dto;

import com.luvina.la.config.Constants;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO chứa thông tin chi tiết chứng chỉ tiếng Nhật của nhân viên trong phản hồi API.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCertificationDetailDTO {
    private Long certificationId;
    private String certificationName;
    private String startDate;
    private String endDate;
    private BigDecimal score;

    /**
     * Khởi tạo DTO từ kết quả truy vấn JPQL với các trường ngày kiểu LocalDate.
     *
     * @param certificationId mã chứng chỉ
     * @param certificationName tên chứng chỉ
     * @param startDate ngày cấp chứng chỉ
     * @param endDate ngày hết hạn chứng chỉ
     * @param score điểm thi
     */
    public EmployeeCertificationDetailDTO(
            Long certificationId,
            String certificationName,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            BigDecimal score) {
        this.certificationId = certificationId;
        this.certificationName = certificationName;
        this.startDate = startDate != null ? startDate.format(Constants.DEFAULT_DATE_FORMATTER) : null;
        this.endDate = endDate != null ? endDate.format(Constants.DEFAULT_DATE_FORMATTER) : null;
        this.score = score;
    }
}
