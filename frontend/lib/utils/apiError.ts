import { AxiosError } from 'axios';
import { ApiResponse } from '@/types/api';
import { formatErrorMessage, ERROR_MESSAGES } from '@/lib/constants/messages';

/**
 * Trích xuất chuỗi thông báo lỗi tiếng Nhật từ lỗi phản hồi của Backend API.
 * Hỗ trợ cả 2 định dạng phản hồi: Parametric Error Object ({ code, params }) và chuỗi String thông thường.
 *
 * @param error đối tượng ngoại lệ bắt được từ khối catch
 * @param defaultFallback thông điệp dự phòng nếu không parse được lỗi từ server (mặc định: ER015)
 * @return chuỗi thông báo lỗi hoàn chỉnh
 */
export function extractApiErrorMessage(
  error: unknown,
  defaultFallback: string = ERROR_MESSAGES.ER015
): string {
  const axiosError = error as AxiosError<ApiResponse>;
  const errorData = axiosError?.response?.data;

  if (errorData?.message && typeof errorData.message === 'object' && errorData.message.code) {
    return formatErrorMessage(errorData.message.code, errorData.message.params || []);
  }

  if (typeof errorData?.message === 'string' && errorData.message.trim() !== '') {
    return errorData.message;
  }

  return defaultFallback;
}
