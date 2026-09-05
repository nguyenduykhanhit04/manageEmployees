import { EmployeeListApiResponse } from "@/types/employee";
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
 * Gọi API thêm mới nhân viên (POST /employee).
 *
 * @param payload dữ liệu nhân viên cần tạo mới
 * @return kết quả phản hồi từ backend
 */
export const createEmployee = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/employee', payload);
  return response.data;
};

/**
 * Gọi API cập nhật thông tin nhân viên (PUT /employee/{id}).
 *
 * @param employeeId mã nhân viên cần cập nhật
 * @param payload dữ liệu nhân viên cần cập nhật
 * @return kết quả phản hồi từ backend
 */
export const updateEmployee = async (employeeId: number | string, payload: any): Promise<any> => {
  const response = await apiClient.put(`/employee/${employeeId}`, payload);
  return response.data;
};