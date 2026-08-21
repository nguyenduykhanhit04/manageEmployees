// types/employee.ts
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

export interface EmployeeSearchParams {
  name?: string;
  departmentId?: number;
  offset?: number;
  limit?: number;
  ordEmployeeName?: string;
  ordCertificationName?: string;
  ordEndDate?: string;
}

export interface EmployeeCreateRequest {
  employeeName: string;
  departmentId: number;
  employeeEmail: string;
  employeeNameKana?: string;
  employeeBirthDate?: string;
  employeeTelephone?: string;
  employeeLoginId: string;
}

export interface EmployeeUpdateRequest {
  employeeId: number;
  employeeName: string;
  departmentId: number;
  employeeEmail: string;
  employeeNameKana?: string;
  employeeBirthDate?: string;
  employeeTelephone?: string;
  employeeLoginId: string;
}
