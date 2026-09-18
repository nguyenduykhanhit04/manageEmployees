import { apiClient } from '@/lib/api/client';
import { LoginRequest, LoginResponse } from '@/types/auth';

/**
 * Gọi API đăng nhập hệ thống (POST /login).
 *
 * @param payload thông tin tài khoản và mật khẩu
 * @return dữ liệu phản hồi chứa accessToken và tokenType
 */
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', payload);
  return response.data;
};
