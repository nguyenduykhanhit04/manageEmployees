import { EmployeeListApiResponse } from "@/types/employee";
import { apiClient } from "@/lib/api/client";

export const getEmployees = async (params: {
  employee_name?: string;
  department_id?: number;
  ord_employee_name?: string;
  ord_certification_name?: string;
  ord_end_date?: string;
  offset?: number;
  limit?: number;
}): Promise<EmployeeListApiResponse> => {
  const response = await apiClient.get<EmployeeListApiResponse>('/employee', {
    params: {
      employee_name: params.employee_name,
      department_id: params.department_id,
      ord_employee_name: params.ord_employee_name ?? 'ASC',
      ord_certification_name: params.ord_certification_name ?? 'ASC',
      ord_end_date: params.ord_end_date ?? 'ASC',
      offset: params.offset ?? 0,
      limit: params.limit ?? 20,
    },
  });
  return response.data;
};