/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * index.ts, 25/8/2026 nguyenduykhanh2
 */

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
 * Cấu hình hiển thị dữ liệu trên giao diện.
 */
export const DISPLAY_CONFIG = {
  MAX_TABLE_TEXT_LENGTH: 22,
} as const;

/**
 * Chiều sắp xếp dữ liệu.
 */
export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

/**
 * Biểu tượng hiển thị trạng thái sắp xếp trên bảng dữ liệu.
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

/**
 * Danh sách đường dẫn các trang trong ứng dụng.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EMPLOYEE_LIST: '/employees/adm002',
  EMPLOYEE_ADD: '/employees/edit',
  EMPLOYEE_EDIT: '/employees/edit',
  EMPLOYEE_DETAIL: '/employees/detail',
  EMPLOYEE_CONFIRM: '/employees/confirm',
  EMPLOYEE_COMPLETE: '/employees/complete',
} as const;

/**
 * Tên các tham số Query trên URL.
 */
export const QUERY_PARAMS = {
  EMPLOYEE_NAME: 'employee_name',
  DEPARTMENT_ID: 'department_id',
  OFFSET: 'offset',
  LIMIT: 'limit',
  ID: 'id',
  RETURN_TO: 'returnTo',
} as const;

/**
 * Mã trạng thái phản hồi HTTP.
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Các câu thông báo lỗi nghiệp vụ chuẩn tiếng Nhật.
 */
export const ERROR_MESSAGES = {
  GET_DEPARTMENTS_FAILED: '部門を取得できません',
  GET_EMPLOYEES_FAILED: '従業員を取得できません',
} as const;
