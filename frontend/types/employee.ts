/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * employee.ts, 23/8/2026 nguyenduykhanh2
 */

export interface EmployeeItem {
  employeeId: number;
  employeeName: string;
  employeeBirthDate: string | null;
  departmentName: string;
  employeeEmail: string;
  employeeTelephone: string | null;
  certificationName: string | null;
  endDate: string | null;
  score: number | null;
}

export interface EmployeeListApiResponse {
  code: number;
  totalRecords: number;
  employees: EmployeeItem[];
}

export interface EmployeeCertificationDetail {
  certificationId: number;
  certificationName: string;
  startDate: string;
  endDate: string;
  score: number;
}

export interface EmployeeDetailApiResponse {
  code: number;
  employeeId: number;
  employeeName: string;
  employeeBirthDate: string;
  departmentId: number;
  departmentName: string;
  employeeEmail: string;
  employeeTelephone: string;
  employeeNameKana: string;
  employeeLoginId: string;
  certifications: EmployeeCertificationDetail[];
  message?: {
    code: string;
    params: string[];
  };
}

export interface EmployeeSearchParams {
  name?: string;
  departmentId?: number;
  offset?: number;
  limit?: number;
  ordEmployeeName?: string;
  ordCertificationName?: string;
  ordEndDate?: string;
}

export interface CertificationPayload {
  certificationId: number;
  startDate: string;
  endDate: string;
  score: number;
}

export interface AddEmployeePayload {
  employeeLoginId: string;
  employeeName: string;
  employeeNameKana: string;
  employeeBirthDate: string;
  employeeEmail: string;
  employeeTelephone: string;
  employeeLoginPassword?: string;
  departmentId: number;
  certifications?: CertificationPayload[];
}

export interface AddEmployeeApiResponse {
  code: number;
  employeeId: number;
  message: {
    code: string;
    params: string[];
  };
}

export interface EmployeeFormState {
  employeeLoginId: string;
  departmentId: string | number;
  departmentName?: string;
  employeeName: string;
  employeeNameKana: string;
  employeeBirthDate: string;
  employeeEmail: string;
  employeeTelephone: string;
  employeeLoginPassword?: string;
  passwordConfirmation?: string;
  certificationId?: string | number;
  certificationName?: string;
  certificationStartDate?: string;
  certificationEndDate?: string;
  employeeCertificationScore?: string | number;
}
