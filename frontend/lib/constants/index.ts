/**
 * Hằng số cấu hình phân trang cho toàn bộ Frontend.
 */
export const PAGING = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  DEFAULT_PAGE: 1,
} as const;

/**
 * Hằng số định nghĩa chiều sắp xếp dữ liệu.
 */
export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

/**
 * Hằng số định nghĩa các câu thông báo lỗi nghiệp vụ chuẩn tiếng Nhật.
 */
export const ERROR_MESSAGES = {
  GET_DEPARTMENTS_FAILED: '部門を取得できません',
  GET_EMPLOYEES_FAILED: '従業員を取得できません',
} as const;
