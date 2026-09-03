/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeValidator.java, 25/08/2026 nguyenduykhanh2
 */
package com.luvina.la.validator;

import com.luvina.la.config.Constants;
import com.luvina.la.exception.BusinessException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

/**
 * Lớp thực hiện kiểm tra tính hợp lệ của dữ liệu đầu vào cho các chức năng liên quan đến Nhân viên.
 *
 * @author nguyenduykhanh2
 */
@Component
public class EmployeeValidator {

    // Danh sách các trường cho phép sắp xếp hợp lệ theo đặc tả TKAPI_ListEmployee
    private static final Set<String> VALID_ORDER_KEYS = Set.of(
            Constants.ORDER_KEY_EMPLOYEE_NAME,
            Constants.ORDER_KEY_CERTIFICATION_NAME,
            Constants.ORDER_KEY_END_DATE
    );

    /**
     * Kiểm tra tính hợp lệ của các tham số tìm kiếm, phân trang và sắp xếp danh sách nhân viên.
     *
     * @param employeeName tên nhân viên cần tìm kiếm
     * @param offset vị trí bắt đầu lấy dữ liệu
     * @param limit số lượng bản ghi tối đa được lấy
     * @param orderParams danh sách các tham số sắp xếp
     * @throws BusinessException nếu bất kỳ tham số nào không hợp lệ
     */
    public void validateGetEmployees(
            String employeeName,
            int offset,
            int limit,
            Map<String, String> orderParams) {

        // 1. Kiểm tra tham số phân trang: offset (phải lớn hơn hoặc bằng 0)
        if (offset < 0) {
            throw new BusinessException(
                    Constants.ERROR_CODE_INVALID_PAGING,
                    List.of(Constants.OFFSET_PARAM_LABEL));
        }

        // 2. Kiểm tra tham số phân trang: limit (phải lớn hơn 0)
        if (limit <= 0) {
            throw new BusinessException(
                    Constants.ERROR_CODE_INVALID_PAGING,
                    List.of(Constants.LIMIT_PARAM_LABEL));
        }

        // 3. Kiểm tra độ dài tên nhân viên (tối đa không vượt quá 125 ký tự)
        if (employeeName != null
                && employeeName.length() > Constants.MAX_EMPLOYEE_NAME_LENGTH) {
            throw new BusinessException(
                    Constants.ERROR_CODE_INVALID_EMPLOYEE_NAME,
                    List.of(
                            Constants.LABEL_EMPLOYEE_NAME,
                            String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)));
        }

        // 4. Kiểm tra các tham số sắp xếp (orderParams)
        if (orderParams != null && !orderParams.isEmpty()) {
            for (Map.Entry<String, String> entry : orderParams.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                // 4.1. Kiểm tra tên trường sắp xếp có thuộc whitelist hay không
                if (!VALID_ORDER_KEYS.contains(key.toLowerCase())) {
                    throw new BusinessException(
                            Constants.ERROR_CODE_INVALID_SORT,
                            List.of(key));
                }

                // 4.2. Kiểm tra chiều sắp xếp (bắt buộc phải là ASC hoặc DESC)
                if (!Constants.SORT_ASC.equalsIgnoreCase(value)
                        && !Constants.SORT_DESC.equalsIgnoreCase(value)) {
                    throw new BusinessException(
                            Constants.ERROR_CODE_INVALID_SORT,
                            List.of(key));
                }
            }
        }
    }

    /**
     * Kiểm tra tính hợp lệ của request tìm kiếm nhân viên.
     *
     * @param request đối tượng EmployeeSearchRequest chứa các tham số tìm kiếm
     * @throws BusinessException nếu bất kỳ tham số nào không hợp lệ
     */
    public void validateGetEmployees(com.luvina.la.payload.request.EmployeeSearchRequest request) {
        if (request == null) {
            return;
        }
        int offset = request.getOffset() != null ? request.getOffset() : 0;
        int limit = request.getLimit() != null ? request.getLimit() : 20;
        validateGetEmployees(request.getEmployeeName(), offset, limit, request.getOrderParams());
    }
}
