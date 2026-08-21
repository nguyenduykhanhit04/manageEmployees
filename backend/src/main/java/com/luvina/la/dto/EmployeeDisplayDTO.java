/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeDisplayDTO.java, 21/8/2026 nguyenduykhanh2
 */
package com.luvina.la.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO hiển thị thông tin nhân viên.
 *
 * @author nguyenduykhanh2
 */
public interface EmployeeDisplayDTO {
    /**
     * Lấy mã nhân viên.
     *
     * @return mã nhân viên
     */
    Long getEmployeeId();

    /**
     * Lấy tên nhân viên.
     *
     * @return tên nhân viên
     */
    String getEmployeeName();

    /**
     * Lấy ngày sinh nhân viên.
     *
     * @return ngày sinh nhân viên
     */
    LocalDate getEmployeeBirthDate();

    /**
     * Lấy tên phòng ban.
     *
     * @return tên phòng ban
     */
    String getDepartmentName();

    /**
     * Lấy email nhân viên.
     *
     * @return email nhân viên
     */
    String getEmployeeEmail();

    /**
     * Lấy số điện thoại nhân viên.
     *
     * @return số điện thoại nhân viên
     */
    String getEmployeeTelephone();

    /**
     * Lấy tên chứng chỉ.
     *
     * @return tên chứng chỉ
     */
    String getCertificationName();

    /**
     * Lấy ngày hết hạn chứng chỉ.
     *
     * @return ngày hết hạn chứng chỉ
     */
    LocalDate getEndDate();

    /**
     * Lấy điểm chứng chỉ.
     *
     * @return điểm chứng chỉ
     */
    BigDecimal getScore();
}
