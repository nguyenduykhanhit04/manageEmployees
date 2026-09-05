import { z } from 'zod';
import { formatErrorMessage, FIELD_LABELS } from '@/lib/constants/messages';

// Regex kiểm tra Katakana (toàn bộ là ký tự Katakana full-width)
const KATAKANA_REGEX = /^[ァ-ヶー\s]+$/;

// Regex kiểm tra half-size alphanumeric và dấu gạch dưới, không bắt đầu bằng số
const HALF_SIZE_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

// Regex kiểm tra số điện thoại (chỉ ký tự 1 byte số, dấu gạch ngang, cộng, ngoặc)
const TELEPHONE_REGEX = /^[0-9-+()]+$/;

// Regex kiểm tra ký tự half-size (1 byte ASCII) cho email
const HALF_SIZE_ASCII_REGEX = /^[\x20-\x7E]+$/;

/**
 * Kiểm tra chuỗi định dạng ngày yyyy/MM/dd có phải ngày hợp lệ trên lịch hay không.
 */
const isValidDateString = (val?: string): boolean => {
  if (!val || val.trim() === '') return true;
  const parts = val.split('/');
  if (parts.length !== 3) return false;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (month < 1 || month > 12) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

/**
 * Schema cơ bản chứa các trường chung của Form nhân viên
 */
export const baseEmployeeSchema = z.object({
  // 1. アカウント名: ER001, ER006, ER019
  employeeLoginId: z
    .string()
    .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginId]))
    .max(50, formatErrorMessage('ER006', [FIELD_LABELS.employeeLoginId, 50]))
    .regex(HALF_SIZE_REGEX, formatErrorMessage('ER019', [FIELD_LABELS.employeeLoginId])),

  // 2. グループ: ER002 (Bắt buộc chọn)
  departmentId: z
    .string()
    .min(1, formatErrorMessage('ER002', [FIELD_LABELS.departmentId]))
    .refine((val) => val !== '' && val !== '0' && Number(val) > 0, {
      message: formatErrorMessage('ER002', [FIELD_LABELS.departmentId]),
    }),

  // 3. 氏名: ER001, ER006
  employeeName: z
    .string()
    .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeName]))
    .max(125, formatErrorMessage('ER006', [FIELD_LABELS.employeeName, 125])),

  // 4. カタカナ氏名: ER001, ER006, ER009
  employeeNameKana: z
    .string()
    .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeNameKana]))
    .max(125, formatErrorMessage('ER006', [FIELD_LABELS.employeeNameKana, 125]))
    .regex(KATAKANA_REGEX, formatErrorMessage('ER009', [FIELD_LABELS.employeeNameKana])),

  // 5. 生年月日: ER001, ER011
  employeeBirthDate: z
    .string()
    .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeBirthDate]))
    .refine(isValidDateString, {
      message: formatErrorMessage('ER011', [FIELD_LABELS.employeeBirthDate]),
    }),

  // 6. メールアドレス: ER001, ER005, ER006, ER008
  employeeEmail: z
    .string()
    .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeEmail]))
    .max(125, formatErrorMessage('ER006', [FIELD_LABELS.employeeEmail, 125]))
    .regex(HALF_SIZE_ASCII_REGEX, formatErrorMessage('ER008', [FIELD_LABELS.employeeEmail]))
    .email(formatErrorMessage('ER005', [FIELD_LABELS.employeeEmail])),

  // 7. 電話番号: ER001, ER006, ER008
  employeeTelephone: z
    .string()
    .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeTelephone]))
    .max(50, formatErrorMessage('ER006', [FIELD_LABELS.employeeTelephone, 50]))
    .regex(TELEPHONE_REGEX, formatErrorMessage('ER008', [FIELD_LABELS.employeeTelephone])),

  certificationId: z.string().optional(),
  certificationStartDate: z.string().optional(),
  certificationEndDate: z.string().optional(),

  // 12. 点数: ER018
  employeeCertificationScore: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0 && Number.isInteger(num);
      },
      { message: formatErrorMessage('ER018', [FIELD_LABELS.score]) }
    ),
});

/**
 * Schema cho chức năng Thêm mới nhân viên (Mode ADD) - Bắt buộc mật khẩu >= 8 ký tự
 */
export const addEmployeeSchema = baseEmployeeSchema
  .extend({
    // 8. パスワード: ER001, ER007
    employeeLoginPassword: z
      .string()
      .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginPassword]))
      .min(8, formatErrorMessage('ER007', [FIELD_LABELS.employeeLoginPassword, 8, 50]))
      .max(50, formatErrorMessage('ER007', [FIELD_LABELS.employeeLoginPassword, 8, 50])),

    // 9. パスワード（確認）: ER001, ER017
    employeeLoginPasswordConfirm: z
      .string()
      .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginPasswordConfirm])),
  })
  .superRefine((data, ctx) => {
    // 1. Kiểm tra xác nhận mật khẩu (ER017)
    if (data.employeeLoginPassword && data.employeeLoginPasswordConfirm) {
      if (data.employeeLoginPassword !== data.employeeLoginPasswordConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER017'),
          path: ['employeeLoginPasswordConfirm'],
        });
      }
    }

    // 2. Nếu có chọn chứng chỉ tiếng Nhật:
    const isCertSelected = Boolean(
      data.certificationId && data.certificationId !== '' && data.certificationId !== '0'
    );
    if (isCertSelected) {
      // 10. 資格交付日: ER002 (bắt buộc chọn), ER011 (ngày hợp lệ)
      if (!data.certificationStartDate || data.certificationStartDate.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER002', [FIELD_LABELS.startDate]),
          path: ['certificationStartDate'],
        });
      } else if (!isValidDateString(data.certificationStartDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER011', [FIELD_LABELS.startDate]),
          path: ['certificationStartDate'],
        });
      }

      // 11. 失効日: ER002 (bắt buộc chọn), ER011 (ngày hợp lệ)
      if (!data.certificationEndDate || data.certificationEndDate.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER002', [FIELD_LABELS.endDate]),
          path: ['certificationEndDate'],
        });
      } else if (!isValidDateString(data.certificationEndDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER011', [FIELD_LABELS.endDate]),
          path: ['certificationEndDate'],
        });
      }

      // 12. 点数: ER001 (bắt buộc nhập)
      if (!data.employeeCertificationScore || data.employeeCertificationScore.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER001', [FIELD_LABELS.score]),
          path: ['employeeCertificationScore'],
        });
      }

      // 11. 失効日 >= 資格交付日 (ER012)
      if (
        data.certificationStartDate &&
        data.certificationEndDate &&
        isValidDateString(data.certificationStartDate) &&
        isValidDateString(data.certificationEndDate)
      ) {
        if (new Date(data.certificationEndDate) < new Date(data.certificationStartDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: formatErrorMessage('ER012', [FIELD_LABELS.endDate, FIELD_LABELS.startDate]),
            path: ['certificationEndDate'],
          });
        }
      }
    }
  });

/**
 * Schema cho chức năng Chỉnh sửa nhân viên (Mode EDIT) - Mật khẩu tùy chọn
 */
export const editEmployeeSchema = baseEmployeeSchema
  .extend({
    employeeLoginPassword: z
      .string()
      .max(50, formatErrorMessage('ER006', [FIELD_LABELS.employeeLoginPassword, 50]))
      .optional(),
    employeeLoginPasswordConfirm: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // 1. Kiểm tra mật khẩu nếu người dùng nhập thay đổi
    if (data.employeeLoginPassword && data.employeeLoginPassword.length > 0) {
      if (data.employeeLoginPassword.length < 8 || data.employeeLoginPassword.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER007', [FIELD_LABELS.employeeLoginPassword, 8, 50]),
          path: ['employeeLoginPassword'],
        });
      }
      if (data.employeeLoginPassword !== data.employeeLoginPasswordConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER017'),
          path: ['employeeLoginPasswordConfirm'],
        });
      }
    }

    // 2. Nếu có chọn chứng chỉ tiếng Nhật:
    const isCertSelected = Boolean(
      data.certificationId && data.certificationId !== '' && data.certificationId !== '0'
    );
    if (isCertSelected) {
      // 10. 資格交付日: ER002 (bắt buộc chọn), ER011 (ngày hợp lệ)
      if (!data.certificationStartDate || data.certificationStartDate.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER002', [FIELD_LABELS.startDate]),
          path: ['certificationStartDate'],
        });
      } else if (!isValidDateString(data.certificationStartDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER011', [FIELD_LABELS.startDate]),
          path: ['certificationStartDate'],
        });
      }

      // 11. 失効日: ER002 (bắt buộc chọn), ER011 (ngày hợp lệ)
      if (!data.certificationEndDate || data.certificationEndDate.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER002', [FIELD_LABELS.endDate]),
          path: ['certificationEndDate'],
        });
      } else if (!isValidDateString(data.certificationEndDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER011', [FIELD_LABELS.endDate]),
          path: ['certificationEndDate'],
        });
      }

      // 12. 点数: ER001 (bắt buộc nhập)
      if (!data.employeeCertificationScore || data.employeeCertificationScore.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER001', [FIELD_LABELS.score]),
          path: ['employeeCertificationScore'],
        });
      }

      // 11. 失効日 >= 資格交付日 (ER012)
      if (
        data.certificationStartDate &&
        data.certificationEndDate &&
        isValidDateString(data.certificationStartDate) &&
        isValidDateString(data.certificationEndDate)
      ) {
        if (new Date(data.certificationEndDate) < new Date(data.certificationStartDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: formatErrorMessage('ER012', [FIELD_LABELS.endDate, FIELD_LABELS.startDate]),
            path: ['certificationEndDate'],
          });
        }
      }
    }
  });

export const employeeFormSchema = addEmployeeSchema;
export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;
export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
