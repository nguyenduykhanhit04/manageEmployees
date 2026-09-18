import { loginSchema } from '@/lib/validation/auth';
import { formatErrorMessage, FIELD_LABELS } from '@/lib/constants/messages';

describe('Login Validation Schema', () => {
  it('should pass with valid data', () => {
    const result = loginSchema.safeParse({
      username: 'testuser',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should fail if username is empty', () => {
    const result = loginSchema.safeParse({
      username: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginId])
      );
    }
  });

  it('should fail if password is empty', () => {
    const result = loginSchema.safeParse({
      username: 'testuser',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginPassword])
      );
    }
  });

  it('should fail if both fields are empty', () => {
    const result = loginSchema.safeParse({
      username: '',
      password: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginId])
      );
    }
  });
});
