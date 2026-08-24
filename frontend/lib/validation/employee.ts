/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * employee.ts, 22/8/2026 nguyenduykhanh2
 */

import { z } from 'zod';

// Regex kiểm tra Katakana (Katakana full-width và half-width)
const KATAKANA_REGEX = /^[\u30A0-\u30FF\uFF66-\uFF9F\s]+$/;

// Regex kiểm tra login id (bắt đầu bằng chữ cái hoặc gạch dưới, chỉ chứa chữ số, gạch dưới)
const LOGIN_ID_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

// Regex kiểm tra ký tự half-width (1-byte)
const HALF_WIDTH_REGEX = /^[\x00-\x7F]+$/;

// Regex kiểm tra định dạng ngày yyyy/MM/dd
const DATE_FORMAT_REGEX = /^\d{4}\/\d{2}\/\d{2}$/;

/**
 * Hàm tạo Schema validate thông tin nhân viên cho form Thêm mới / Chỉnh sửa (ADM003)
 *
 * @param isEditMode cờ xác định chế độ chỉnh sửa (mật khẩu không bắt buộc nếu bỏ trống)
 */
export const getEmployeeFormSchema = (isEditMode: boolean = false) =>
  z.object({
    employeeLoginId: z
      .string()
      .trim()
      .min(1, 'ER001')
      .max(50, 'ER006')
      .regex(LOGIN_ID_REGEX, 'ER019'),
    departmentId: z
      .string()
      .min(1, 'ER002'),
    employeeName: z
      .string()
      .trim()
      .min(1, 'ER001')
      .max(125, 'ER006'),
    employeeNameKana: z
      .string()
      .trim()
      .min(1, 'ER001')
      .max(125, 'ER006')
      .regex(KATAKANA_REGEX, 'ER009'),
    employeeBirthDate: z
      .string()
      .trim()
      .min(1, 'ER001')
      .regex(DATE_FORMAT_REGEX, 'ER005'),
    employeeEmail: z
      .string()
      .trim()
      .min(1, 'ER001')
      .max(125, 'ER006')
      .email('ER005'),
    employeeTelephone: z
      .string()
      .trim()
      .min(1, 'ER001')
      .max(50, 'ER006')
      .regex(HALF_WIDTH_REGEX, 'ER008'),
    employeeLoginPassword: z
      .string()
      .optional()
      .or(z.literal('')),
    passwordConfirmation: z
      .string()
      .optional()
      .or(z.literal('')),
    certificationId: z
      .string()
      .optional()
      .or(z.literal('')),
    certificationStartDate: z
      .string()
      .optional()
      .or(z.literal('')),
    certificationEndDate: z
      .string()
      .optional()
      .or(z.literal('')),
    employeeCertificationScore: z
      .string()
      .optional()
      .or(z.literal('')),
  }).superRefine((data, ctx) => {
    // 1. Kiểm tra mật khẩu
    if (!isEditMode) {
      if (!data.employeeLoginPassword || data.employeeLoginPassword.length < 8 || data.employeeLoginPassword.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ER007',
          path: ['employeeLoginPassword'],
        });
      }
      if (!data.passwordConfirmation || data.passwordConfirmation.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ER001',
          path: ['passwordConfirmation'],
        });
      }
    } else {
      if (data.employeeLoginPassword && data.employeeLoginPassword.trim() !== '') {
        if (data.employeeLoginPassword.length < 8 || data.employeeLoginPassword.length > 50) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'ER007',
            path: ['employeeLoginPassword'],
          });
        }
      }
    }

    if (data.employeeLoginPassword && data.passwordConfirmation && data.employeeLoginPassword !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ER017',
        path: ['passwordConfirmation'],
      });
    }

  // 2. Nếu có chọn chứng chỉ tiếng Nhật (certificationId khác rỗng)
  if (data.certificationId && data.certificationId.trim() !== '') {
    if (!data.certificationStartDate || data.certificationStartDate.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ER001',
        path: ['certificationStartDate'],
      });
    } else if (!DATE_FORMAT_REGEX.test(data.certificationStartDate.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ER005',
        path: ['certificationStartDate'],
      });
    }

    if (!data.certificationEndDate || data.certificationEndDate.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ER001',
        path: ['certificationEndDate'],
      });
    } else if (!DATE_FORMAT_REGEX.test(data.certificationEndDate.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ER005',
        path: ['certificationEndDate'],
      });
    }

    if (!data.employeeCertificationScore || data.employeeCertificationScore.toString().trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ER001',
        path: ['employeeCertificationScore'],
      });
    } else {
      const scoreNum = Number(data.employeeCertificationScore);
      if (isNaN(scoreNum) || scoreNum <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ER018',
          path: ['employeeCertificationScore'],
        });
      }
    }

    // Kiểm tra endDate >= startDate (ER012)
    if (
      data.certificationStartDate &&
      data.certificationEndDate &&
      DATE_FORMAT_REGEX.test(data.certificationStartDate.trim()) &&
      DATE_FORMAT_REGEX.test(data.certificationEndDate.trim())
    ) {
      const start = new Date(data.certificationStartDate.replace(/\//g, '-'));
      const end = new Date(data.certificationEndDate.replace(/\//g, '-'));
      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ER012',
          path: ['certificationEndDate'],
        });
      }
    }
  }
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
