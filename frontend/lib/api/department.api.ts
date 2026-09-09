import { DepartmentListApiResponse } from "@/types/department";
import { apiClient } from "@/lib/api/client";

/**
 * Gọi API lấy danh sách tất cả các phòng ban.
 *
 * @return phản hồi danh sách phòng ban từ Backend
 */
export const getDepartments = async (): Promise<DepartmentListApiResponse> => {
  const response = await apiClient.get<DepartmentListApiResponse>('/department');
  return response.data;
};
