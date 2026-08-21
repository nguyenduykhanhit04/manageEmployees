import { DepartmentListApiResponse } from "@/types/department";
import { apiClient } from "@/lib/api/client";

export const getDepartments = async (): Promise<DepartmentListApiResponse> => {
  const response = await apiClient.get<DepartmentListApiResponse>('/department');
  return response.data;
};
