/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * employee.ts, 22/8/2026 nguyenduykhanh2
 */

import { z } from 'zod';

// Regex kiểm tra Katakana (toàn bộ là ký tự Katakana full-width)
const KATAKANA_REGEX = /^[ァ-ヶー\s]+$/;

// Regex kiểm tra half-size alphanumeric và dấu gạch dưới
const HALF_SIZE_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Schema validate thông tin nhân viên cho form Thêm / Sửa
 */
export const employeeFormSchema = z.object({
  employeeLoginId: z
    .string()
    .min(1, 'ER001')
    .max(50, 'ER006')
    .regex(HALF_SIZE_REGEX, 'ER019'),
  departmentId: z
    .number({ message: 'ER002' })
    .min(1, 'ER002'),
  employeeName: z
    .string()
    .min(1, 'ER001')
    .max(125, 'ER006'),
  employeeNameKana: z
    .string()
    .min(1, 'ER001')
    .max(125, 'ER006')
    .regex(KATAKANA_REGEX, 'ER009'),
  employeeBirthDate: z
    .string()
    .min(1, 'ER001'),
  employeeEmail: z
    .string()
    .min(1, 'ER001')
    .max(125, 'ER006')
    .email('ER005'),
  employeeTelephone: z
    .string()
    .min(1, 'ER001')
    .max(50, 'ER006')
    .regex(/^[0-9-+()]+$/, 'ER008'),
  employeeLoginPassword: z
    .string()
    .max(50, 'ER006')
    .optional(),
  certificationId: z
    .number()
    .optional(),
  startDate: z
    .string()
    .optional(),
  endDate: z
    .string()
    .optional(),
  score: z
    .number()
    .min(0, 'ER018')
    .optional(),
}).refine(
  (data) => {
    // Nếu có ngày cấp và ngày hết hạn chứng chỉ, kiểm tra endDate > startDate
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'ER012',
    path: ['endDate'],
  }
);

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
