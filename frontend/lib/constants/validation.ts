/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * validation.ts, 16/09/2026 nguyenduykhanh2
 */

/**
 * Giới hạn độ dài và quy chuẩn cho các trường nhập liệu trên form.
 */
export const VALIDATION_LIMITS = {
  LOGIN_ID_MAX: 50,
  EMPLOYEE_NAME_MAX: 125,
  EMPLOYEE_NAME_KANA_MAX: 125,
  EMAIL_MAX: 125,
  TELEPHONE_MAX: 50,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 50,
} as const;

/**
 * Định dạng ngày tháng chuẩn của hệ thống.
 */
export const DATE_FORMATS = {
  STANDARD: 'yyyy/MM/dd',
  STANDARD_REGEX: /^\d{4}\/\d{2}\/\d{2}$/,
} as const;
