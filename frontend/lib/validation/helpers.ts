import { z } from 'zod';
import { formatErrorMessage, FIELD_LABELS } from '@/lib/constants/messages';
import { DATE_FORMATS } from '@/lib/constants/validation';
import { isValidDateString } from '@/lib/utils/date';

/**
 * Tạo Zod rule cho chuỗi bắt buộc nhập (ER001) kèm giới hạn độ dài tối đa (ER006).
 *
 * @param label tên hiển thị của trường
 * @param maxLength độ dài ký tự tối đa cho phép
 */
export const requiredString = (label: string, maxLength: number) =>
  z
    .string()
    .min(1, formatErrorMessage('ER001', [label]))
    .max(maxLength, formatErrorMessage('ER006', [label, maxLength]));

/**
 * Tạo Zod rule cho chuỗi ngày tháng: bắt buộc (ER001), đúng format yyyy/MM/dd (ER005), ngày lịch hợp lệ (ER011).
 *
 * @param label tên hiển thị của trường
 */
export const requiredDateString = (label: string) =>
  z
    .string()
    .min(1, formatErrorMessage('ER001', [label]))
    .refine((val) => !val || val.trim() === '' || DATE_FORMATS.STANDARD_REGEX.test(val), {
      message: formatErrorMessage('ER005', [label, DATE_FORMATS.STANDARD]),
    })
    .refine(isValidDateString, {
      message: formatErrorMessage('ER011', [label]),
    });

/**
 * Kiểm tra tính hợp lệ của trường ngày tháng chứng chỉ trong Refinement Context (ER002, ER005, ER011).
 *
 * @param val giá trị chuỗi ngày
 * @param label tên hiển thị của trường
 * @param fieldPath đường dẫn field trong form
 * @param ctx Zod Refinement Context
 */
export const validateCertDateField = (
  val: string | undefined,
  label: string,
  fieldPath: 'certificationStartDate' | 'certificationEndDate',
  ctx: z.RefinementCtx
) => {
  if (!val || val.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatErrorMessage('ER002', [label]),
      path: [fieldPath],
    });
  } else if (!DATE_FORMATS.STANDARD_REGEX.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatErrorMessage('ER005', [label, DATE_FORMATS.STANDARD]),
      path: [fieldPath],
    });
  } else if (!isValidDateString(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatErrorMessage('ER011', [label]),
      path: [fieldPath],
    });
  }
};

/**
 * Kiểm tra tính hợp lệ tổng thể của các trường chứng chỉ tiếng Nhật khi có chọn chứng chỉ.
 *
 * @param data đối tượng chứa thông tin chứng chỉ
 * @param ctx Zod Refinement Context
 */
export const validateCertificationFields = (
  data: {
    certificationId?: string;
    certificationStartDate?: string;
    certificationEndDate?: string;
    employeeCertificationScore?: string;
  },
  ctx: z.RefinementCtx
) => {
  const isCertSelected = Boolean(
    data.certificationId && data.certificationId !== '' && data.certificationId !== '0'
  );

  if (!isCertSelected) {
    return;
  }

  // 10. 資格交付日: ER002 (bắt buộc), ER005 (định dạng), ER011 (ngày lịch hợp lệ)
  validateCertDateField(
    data.certificationStartDate,
    FIELD_LABELS.startDate,
    'certificationStartDate',
    ctx
  );

  // 11. 失効日: ER002 (bắt buộc), ER005 (định dạng), ER011 (ngày lịch hợp lệ)
  validateCertDateField(
    data.certificationEndDate,
    FIELD_LABELS.endDate,
    'certificationEndDate',
    ctx
  );

  // 12. 点数: ER001 (bắt buộc nhập)
  if (!data.employeeCertificationScore || data.employeeCertificationScore.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatErrorMessage('ER001', [FIELD_LABELS.score]),
      path: ['employeeCertificationScore'],
    });
  }

  // 11. 失効日 > 資格交付日 (ER012: 失効日 phải là ngày trong tương lai so với 資格交付日)
  if (
    data.certificationStartDate &&
    data.certificationEndDate &&
    isValidDateString(data.certificationStartDate) &&
    isValidDateString(data.certificationEndDate) &&
    new Date(data.certificationEndDate) <= new Date(data.certificationStartDate)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatErrorMessage('ER012', [FIELD_LABELS.endDate, FIELD_LABELS.startDate]),
      path: ['certificationEndDate'],
    });
  }
};
