/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeSearchRequest.java, 03/09/2026 nguyenduykhanh2
 */
package com.luvina.la.payload.request;

import java.io.Serializable;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload chứa các tiêu chí tìm kiếm, sắp xếp và phân trang danh sách nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSearchRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /** Tên nhân viên cần tìm kiếm */
    private String employeeName;

    /** Mã định danh phòng ban */
    private Long departmentId;

    /** Vị trí bắt đầu lấy dữ liệu (phân trang) */
    private Integer offset;

    /** Số lượng bản ghi tối đa trên một trang */
    private Integer limit;

    /** Danh sách các tham số sắp xếp theo thứ tự ưu tiên */
    private Map<String, String> orderParams;
}
