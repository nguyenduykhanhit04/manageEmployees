/**
 * Thông tin lỗi phản hồi từ API.
 */
export interface ApiError {
  /** Thông điệp lỗi hiển thị */
  message: string;
  /** Mã HTTP status */
  status: number;
  /** Mã lỗi hệ thống (ví dụ: ER001, ER015) */
  code?: string;
}

/**
 * Tham số phân trang dùng trong các request lấy dữ liệu.
 */
export interface PaginationParams {
  /** Số trang hiện tại (bắt đầu từ 1) */
  page: number;
  /** Số lượng bản ghi trên một trang */
  limit: number;
}

/**
 * Metadata thông tin phân trang trả về cho UI.
 */
export interface PaginationMeta {
  /** Tổng số bản ghi thỏa mãn điều kiện */
  total: number;
  /** Trang hiện tại */
  page: number;
  /** Số lượng bản ghi trên trang */
  limit: number;
  /** Tổng số trang */
  totalPages: number;
}
