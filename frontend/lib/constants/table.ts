/**
 * Cấu hình phân trang cho toàn bộ Frontend.
 */
export const PAGING = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  DEFAULT_PAGE: 1,
  MAX_DISPLAY_PAGES: 3,
} as const;

/**
 * Cấu hình hiển thị dữ liệu trên giao diện bảng.
 */
export const DISPLAY_CONFIG = {
  MAX_TABLE_TEXT_LENGTH: 22,
} as const;

/**
 * Chiều sắp xếp dữ liệu (ASC / DESC).
 */
export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

/**
 * Biểu tượng hiển thị trạng thái sắp xếp trên cột bảng dữ liệu.
 */
export const SORT_ICONS = {
  ASC: '▲▽',
  DESC: '△▼',
} as const;

/**
 * Tên các trường sắp xếp danh sách nhân viên (khớp với tham số backend API).
 */
export const SORT_FIELDS = {
  EMPLOYEE_NAME: 'ord_employee_name',
  CERTIFICATION_NAME: 'ord_certification_name',
  END_DATE: 'ord_end_date',
} as const;
