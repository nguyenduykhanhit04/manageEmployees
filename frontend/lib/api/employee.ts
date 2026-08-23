/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * employee.ts, 22/8/2026 nguyenduykhanh2
 */

import { AddEmployeeApiResponse, AddEmployeePayload, EmployeeListApiResponse } from "@/types/employee";
import { apiClient } from "@/lib/api/client";

/**
 * Gọi API lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp và phân trang.
 * Giữ nguyên thứ tự ưu tiên các trường sắp xếp theo đúng thứ tự click của người dùng.
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
  [key: string]: unknown;
}): Promise<EmployeeListApiResponse> => {
  const queryParams: Record<string, unknown> = {};

  // Điều kiện tìm kiếm
  if (params.employee_name !== undefined) {
    queryParams.employee_name = params.employee_name;
  }
  if (params.department_id !== undefined) {
    queryParams.department_id = params.department_id;
  }

  // Duyệt và giữ nguyên thứ tự các tham số sắp xếp (ord_) theo đúng thứ tự ưu tiên truyền vào
  Object.keys(params).forEach((key) => {
    if (key.startsWith('ord_') && params[key] !== undefined) {
      queryParams[key] = params[key];
    }
  });

  // Tham số phân trang
  queryParams.offset = params.offset ?? 0;
  queryParams.limit = params.limit ?? 20;

  const response = await apiClient.get<EmployeeListApiResponse>('/employee', {
    params: queryParams,
  });
  return response.data;
};

/**
 * Gọi API thêm mới nhân viên.
 *
 * @param payload dữ liệu nhân viên và chứng chỉ cần thêm
 * @return phản hồi kết quả thêm mới từ Backend
 */
export const createEmployee = async (payload: AddEmployeePayload): Promise<AddEmployeeApiResponse> => {
  const response = await apiClient.post<AddEmployeeApiResponse>('/employee', payload);
  return response.data;
};