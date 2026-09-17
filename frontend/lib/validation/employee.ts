import { z } from 'zod';
import { formatErrorMessage, FIELD_LABELS } from '@/lib/constants/messages';
import { VALIDATION_LIMITS } from '@/lib/constants/validation';
import {
  KATAKANA_REGEX,
  HALF_SIZE_REGEX,
  TELEPHONE_REGEX,
  HALF_SIZE_ASCII_REGEX,
  LUVINA_EMAIL_REGEX,
} from '@/lib/constants/regex';
import {
  requiredString,
  requiredDateString,
  validateCertificationFields,
} from './helpers';

/**
 * Schema cơ bản chứa các trường chung của Form nhân viên
 */
export const baseEmployeeSchema = z.object({
  // 1. アカウント名: ER001, ER006, ER019
  employeeLoginId: requiredString(
    FIELD_LABELS.employeeLoginId,
    VALIDATION_LIMITS.LOGIN_ID_MAX
  ).regex(
    HALF_SIZE_REGEX,
    formatErrorMessage('ER019', [FIELD_LABELS.employeeLoginId])
  ),

  // 2. グループ: ER002 (Bắt buộc chọn)
  departmentId: z
    .string()
    .min(1, formatErrorMessage('ER002', [FIELD_LABELS.departmentId]))
    .refine((val) => val !== '' && val !== '0' && Number(val) > 0, {
      message: formatErrorMessage('ER002', [FIELD_LABELS.departmentId]),
    }),

  // 3. 氏名: ER001, ER006
  employeeName: requiredString(
    FIELD_LABELS.employeeName,
    VALIDATION_LIMITS.EMPLOYEE_NAME_MAX
  ),

  // 4. カタカナ氏名: ER001, ER006, ER009
  employeeNameKana: requiredString(
    FIELD_LABELS.employeeNameKana,
    VALIDATION_LIMITS.EMPLOYEE_NAME_KANA_MAX
  ).regex(
    KATAKANA_REGEX,
    formatErrorMessage('ER009', [FIELD_LABELS.employeeNameKana])
  ),

  // 5. 生年月日: ER001, ER005, ER011
  employeeBirthDate: requiredDateString(FIELD_LABELS.employeeBirthDate),

  // 6. メールアドレス: ER001, ER008, ER006, ER005 (@luvina.net)
  employeeEmail: requiredString(
    FIELD_LABELS.employeeEmail,
    VALIDATION_LIMITS.EMAIL_MAX
  )
    .regex(
      HALF_SIZE_ASCII_REGEX,
      formatErrorMessage('ER008', [FIELD_LABELS.employeeEmail])
    )
    .regex(
      LUVINA_EMAIL_REGEX,
      formatErrorMessage('ER005', [FIELD_LABELS.employeeEmail, 'email'])
    ),

  // 7. 電話番号: ER001, ER006, ER008
  employeeTelephone: requiredString(
    FIELD_LABELS.employeeTelephone,
    VALIDATION_LIMITS.TELEPHONE_MAX
  ).regex(
    TELEPHONE_REGEX,
    formatErrorMessage('ER008', [FIELD_LABELS.employeeTelephone])
  ),

  // 8. Thông tin chứng chỉ tiếng Nhật (Tùy chọn)
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
 * Schema cho chức năng Thêm mới nhân viên (Mode ADD) - Mật khẩu bắt buộc (8-50 ký tự)
 */
export const addEmployeeSchema = baseEmployeeSchema
  .extend({
    // 8. パスワード: ER001, ER007
    employeeLoginPassword: z
      .string()
      .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginPassword]))
      .min(
        VALIDATION_LIMITS.PASSWORD_MIN,
        formatErrorMessage('ER007', [
          FIELD_LABELS.employeeLoginPassword,
          VALIDATION_LIMITS.PASSWORD_MIN,
          VALIDATION_LIMITS.PASSWORD_MAX,
        ])
      )
      .max(
        VALIDATION_LIMITS.PASSWORD_MAX,
        formatErrorMessage('ER007', [
          FIELD_LABELS.employeeLoginPassword,
          VALIDATION_LIMITS.PASSWORD_MIN,
          VALIDATION_LIMITS.PASSWORD_MAX,
        ])
      ),

    // 9. パスワード（確認）: ER001
    employeeLoginPasswordConfirm: z
      .string()
      .min(
        1,
        formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginPasswordConfirm])
      ),
  })
  .superRefine((data, ctx) => {
    // 1. Kiểm tra khớp mật khẩu xác nhận (ER017)
    if (data.employeeLoginPassword && data.employeeLoginPasswordConfirm) {
      if (data.employeeLoginPassword !== data.employeeLoginPasswordConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER017'),
          path: ['employeeLoginPasswordConfirm'],
        });
      }
    }

    // 2. Kiểm tra chứng chỉ tiếng Nhật nếu có chọn
    validateCertificationFields(data, ctx);
  });

/**
 * Schema cho chức năng Chỉnh sửa nhân viên (Mode EDIT) - Mật khẩu tùy chọn
 */
export const editEmployeeSchema = baseEmployeeSchema
  .extend({
    employeeLoginPassword: z
      .string()
      .max(
        VALIDATION_LIMITS.PASSWORD_MAX,
        formatErrorMessage('ER006', [
          FIELD_LABELS.employeeLoginPassword,
          VALIDATION_LIMITS.PASSWORD_MAX,
        ])
      )
      .optional(),
    employeeLoginPasswordConfirm: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasPassword = Boolean(
      data.employeeLoginPassword && data.employeeLoginPassword.length > 0
    );
    const hasConfirmPassword = Boolean(
      data.employeeLoginPasswordConfirm &&
      data.employeeLoginPasswordConfirm.length > 0
    );

    // 1. Kiểm tra mật khẩu nếu người dùng có nhập thay đổi
    if (hasPassword || hasConfirmPassword) {
      if (!hasPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER001', [
            FIELD_LABELS.employeeLoginPassword,
          ]),
          path: ['employeeLoginPassword'],
        });
      } else if (
        data.employeeLoginPassword!.length < VALIDATION_LIMITS.PASSWORD_MIN ||
        data.employeeLoginPassword!.length > VALIDATION_LIMITS.PASSWORD_MAX
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER007', [
            FIELD_LABELS.employeeLoginPassword,
            VALIDATION_LIMITS.PASSWORD_MIN,
            VALIDATION_LIMITS.PASSWORD_MAX,
          ]),
          path: ['employeeLoginPassword'],
        });
      }

      if (!hasConfirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER001', [
            FIELD_LABELS.employeeLoginPasswordConfirm,
          ]),
          path: ['employeeLoginPasswordConfirm'],
        });
      } else if (
        data.employeeLoginPassword !== data.employeeLoginPasswordConfirm
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: formatErrorMessage('ER017'),
          path: ['employeeLoginPasswordConfirm'],
        });
      }
    }

    // 2. Kiểm tra chứng chỉ tiếng Nhật nếu có chọn
    validateCertificationFields(data, ctx);
  });

export const employeeFormSchema = addEmployeeSchema;
export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;
export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
