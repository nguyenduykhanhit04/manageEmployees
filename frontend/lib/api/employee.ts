/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * employee.ts, 22/8/2026 nguyenduykhanh2
 */

import { EmployeeListApiResponse } from "@/types/employee";
import { apiClient } from "@/lib/api/client";

/**
 * Gọi API lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp và phân trang.
 *
 * @param params đối tượng chứa các tham số truy vấn tìm kiếm và sắp xếp
 * @return phản hồi danh sách nhân viên từ Backend
 */
export const getEmployees = async (params: {
  employee_name?: string;
  department_id?: number;
  ord_employee_name?: string;
  ord_certification_level?: string;
  ord_certification_name?: string;
  ord_end_date?: string;
  offset?: number;
  limit?: number;
}): Promise<EmployeeListApiResponse> => {
  const response = await apiClient.get<EmployeeListApiResponse>('/employee', {
    params: {
      employee_name: params.employee_name,
      department_id: params.department_id,
      ord_employee_name: params.ord_employee_name,
      ord_certification_level: params.ord_certification_level ?? params.ord_certification_name,
      ord_end_date: params.ord_end_date,
      offset: params.offset ?? 0,
      limit: params.limit ?? 20,
    },
  });
  return response.data;
};