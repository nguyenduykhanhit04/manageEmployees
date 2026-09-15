import { baseEmployeeSchema } from '@/lib/validation/employee';
import { formatErrorMessage, FIELD_LABELS } from '@/lib/constants/messages';

describe('Employee Validation Schema - Katakana Field', () => {
  const validBaseEmployee = {
    employeeLoginId: 'user01',
    departmentId: '1',
    employeeName: 'Nguyen Van A',
    employeeNameKana: 'ﾀﾅｶ ﾀﾛｳ', // Half-width Katakana
    employeeBirthDate: '1990/01/01',
    employeeEmail: 'user@example.com',
    employeeTelephone: '0123456789',
  };

  it('should pass when employeeNameKana contains valid half-width Katakana and space', () => {
    const result = baseEmployeeSchema.safeParse(validBaseEmployee);
    expect(result.success).toBe(true);
  });

  it('should fail with ER009 when employeeNameKana contains full-width Katakana (カタカナ)', () => {
    const result = baseEmployeeSchema.safeParse({
      ...validBaseEmployee,
      employeeNameKana: 'カタカナ',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const kanaError = result.error.issues.find((issue) => issue.path.includes('employeeNameKana'));
      expect(kanaError).toBeDefined();
      expect(kanaError?.message).toBe(
        formatErrorMessage('ER009', [FIELD_LABELS.employeeNameKana])
      );
    }
  });

  it('should fail with ER009 when employeeNameKana contains Kanji or Latin characters', () => {
    const result = baseEmployeeSchema.safeParse({
      ...validBaseEmployee,
      employeeNameKana: '田中 太郎',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const kanaError = result.error.issues.find((issue) => issue.path.includes('employeeNameKana'));
      expect(kanaError).toBeDefined();
      expect(kanaError?.message).toBe(
        formatErrorMessage('ER009', [FIELD_LABELS.employeeNameKana])
      );
    }
  });
});

describe('Employee Validation Schema - Email Field', () => {
  const validBaseEmployee = {
    employeeLoginId: 'user01',
    departmentId: '1',
    employeeName: 'Nguyen Van A',
    employeeNameKana: 'ﾀﾅｶ ﾀﾛｳ',
    employeeBirthDate: '1990/01/01',
    employeeEmail: 'user@example.com',
    employeeTelephone: '0123456789',
  };

  it('should pass when employeeEmail is a valid half-size email', () => {
    const result = baseEmployeeSchema.safeParse(validBaseEmployee);
    expect(result.success).toBe(true);
  });

  it('should fail with ER008 when employeeEmail contains full-size characters (ｎｇａ＠ｌｕｖｉｎａ．ｎｅｔ)', () => {
    const result = baseEmployeeSchema.safeParse({
      ...validBaseEmployee,
      employeeEmail: 'ｎｇａ＠ｌｕｖｉｎａ．ｎｅｔ',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((issue) => issue.path.includes('employeeEmail'));
      expect(emailError).toBeDefined();
      expect(emailError?.message).toBe(
        formatErrorMessage('ER008', [FIELD_LABELS.employeeEmail])
      );
    }
  });

  it('should fail with ER005 when employeeEmail is half-size but not valid email format', () => {
    const result = baseEmployeeSchema.safeParse({
      ...validBaseEmployee,
      employeeEmail: 'invalid-email-format',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((issue) => issue.path.includes('employeeEmail'));
      expect(emailError).toBeDefined();
      expect(emailError?.message).toBe(
        formatErrorMessage('ER005', [FIELD_LABELS.employeeEmail, 'email'])
      );
    }
  });
});

