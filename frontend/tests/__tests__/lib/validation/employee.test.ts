import { baseEmployeeSchema, addEmployeeSchema } from '@/lib/validation/employee';
import { formatErrorMessage, FIELD_LABELS } from '@/lib/constants/messages';

describe('Employee Validation Schema - Katakana Field', () => {
  const validBaseEmployee = {
    employeeLoginId: 'user01',
    departmentId: '1',
    employeeName: 'Nguyen Van A',
    employeeNameKana: 'ﾀﾅｶ ﾀﾛｳ', // Half-width Katakana
    employeeBirthDate: '1990/01/01',
    employeeEmail: 'user@luvina.net',
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
    employeeEmail: 'user@luvina.net',
    employeeTelephone: '0123456789',
  };

  it('should pass when employeeEmail is a valid half-size @luvina.net email', () => {
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

  it('should fail with ER005 when employeeEmail is not @luvina.net domain (e.g. user@gmail.com)', () => {
    const result = baseEmployeeSchema.safeParse({
      ...validBaseEmployee,
      employeeEmail: 'user@gmail.com',
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

describe('Employee Validation Schema - Certification Dates (ER012)', () => {
  const validAddEmployee = {
    employeeLoginId: 'user01',
    departmentId: '1',
    employeeName: 'Nguyen Van A',
    employeeNameKana: 'ﾀﾅｶ ﾀﾛｳ',
    employeeBirthDate: '1990/01/01',
    employeeEmail: 'user@luvina.net',
    employeeTelephone: '0123456789',
    employeeLoginPassword: 'Password123!',
    employeeLoginPasswordConfirm: 'Password123!',
    certificationId: '1',
    certificationStartDate: '2023/01/01',
    certificationEndDate: '2023/01/02',
    employeeCertificationScore: '900',
  };

  it('should pass when certificationEndDate is strictly in the future of certificationStartDate', () => {
    const result = addEmployeeSchema.safeParse(validAddEmployee);
    expect(result.success).toBe(true);
  });

  it('should fail with ER012 when certificationEndDate is equal to certificationStartDate', () => {
    const result = addEmployeeSchema.safeParse({
      ...validAddEmployee,
      certificationStartDate: '2023/01/01',
      certificationEndDate: '2023/01/01',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const dateError = result.error.issues.find((issue) => issue.path.includes('certificationEndDate'));
      expect(dateError).toBeDefined();
      expect(dateError?.message).toBe(
        formatErrorMessage('ER012', [FIELD_LABELS.endDate, FIELD_LABELS.startDate])
      );
    }
  });

  it('should fail with ER012 when certificationEndDate is before certificationStartDate', () => {
    const result = addEmployeeSchema.safeParse({
      ...validAddEmployee,
      certificationStartDate: '2023/01/05',
      certificationEndDate: '2023/01/01',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const dateError = result.error.issues.find((issue) => issue.path.includes('certificationEndDate'));
      expect(dateError).toBeDefined();
      expect(dateError?.message).toBe(
        formatErrorMessage('ER012', [FIELD_LABELS.endDate, FIELD_LABELS.startDate])
      );
    }
  });
});


