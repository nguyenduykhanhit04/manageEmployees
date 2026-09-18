/**
 * Danh sách đường dẫn các trang (Route URL) trong ứng dụng.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  EMPLOYEE_LIST: '/employees/adm002',
  EMPLOYEE_DETAIL: '/employees/adm003',
  EMPLOYEE_ADD: '/employees/adm004',
  EMPLOYEE_EDIT: '/employees/adm004',
  EMPLOYEE_CONFIRM: '/employees/adm005',
  EMPLOYEE_COMPLETE: '/employees/adm006',
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
} as const;
