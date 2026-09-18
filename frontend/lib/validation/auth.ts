import { z } from 'zod';
import { formatErrorMessage, FIELD_LABELS } from '@/lib/constants/messages';

/**
 * Schema xác thực form đăng nhập.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginId])),
  password: z
    .string()
    .min(1, formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginPassword])),
});

export type LoginForm = z.infer<typeof loginSchema>;
