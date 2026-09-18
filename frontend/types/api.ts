/**
 * Cấu trúc đối tượng lỗi parametric từ Backend.
 */
export interface ErrorMessageObject {
  /** Mã lỗi hệ thống (ví dụ: ER001, ER015, ER020) */
  code: string;
  /** Danh sách tham số động đi kèm mã lỗi */
  params?: (string | number)[];
}

/**
 * Cấu trúc phản hồi chung từ API.
 */
export interface ApiResponse {
  /** Mã HTTP status từ backend */
  code: number;
  /** Thông điệp từ backend (chuỗi hoặc đối tượng parametric error) */
  message?: string | ErrorMessageObject;
}
