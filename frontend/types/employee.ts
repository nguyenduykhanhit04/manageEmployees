// types/employee.ts

// 1. Một nhân viên trong response GET /employee
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

// 2. Response của GET /employee
export interface EmployeeListApiResponse {
  code: number;
  totalRecords: number;
  employees: EmployeeItem[];
}

// 3. Search parameters
export interface EmployeeSearchParams {
  name?: string;
  departmentId?: number;
  offset?: number;
  limit?: number;
  ordEmployeeName?: string;
  ordCertificationName?: string;
  ordEndDate?: string;
}

// 4. Request tạo nhân viên
export interface EmployeeCreateRequest {
  employeeName: string;
  departmentId: number;
  employeeEmail: string;
  employeeNameKana?: string;
  employeeBirthDate?: string;
  employeeTelephone?: string;
  employeeLoginId: string;
}

// 5. Request cập nhật nhân viên
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


// // Backend/Database representation
// export interface EmployeeDB {
//   employee_id: number;
//   department_id: number;
//   employee_name: string; // Required
//   employee_name_kana?: string;
//   employee_birth_date?: string; // DATE format
//   employee_email: string; // Required
//   employee_telephone?: string;
//   employee_login_id: string; // Required, links to login users
//   employee_login_password?: string; // Not managed by frontend
// }

// // 1. Cấu trúc 1 nhân viên trong danh sách
// export interface Employee {
//   id: string; // Maps to employee_id
//   name: string; // Maps to employee_name (Required)
//   nameKana?: string; // Maps to employee_name_kana
//   dateOfBirth?: string; // Maps to employee_birth_date (YYYY-MM-DD)
//   group?: string; // Derived from department_id via department lookup
//   email: string; // Maps to employee_email (Required)
//   phone?: string; // Maps to employee_telephone
//   japaneseProficiency?: string; // Derived from certifications
//   expirationDate?: string; // Derived from employees_certifications.end_date (YYYY-MM-DD)
//   score?: number; // Derived from employees_certifications.score
// }

// // API request/response types
// export interface EmployeeCreateRequest {
//   employee_name: string; // Required
//   department_id: number; // Required
//   employee_email: string; // Required
//   employee_name_kana?: string;
//   employee_birth_date?: string; // DATE format
//   employee_telephone?: string;
//   employee_login_id: string; // Required
//   // Note: employee_login_password not included (managed separately)
// }

// export interface EmployeeUpdateRequest {
//   employee_id: number; // Required for PUT /employee (ID in request body, not path)
//   employee_name: string; // Required
//   department_id: number; // Required
//   employee_email: string; // Required
//   employee_name_kana?: string;
//   employee_birth_date?: string;
//   employee_telephone?: string;
//   employee_login_id: string; // Required
// }

// // 2. Cấu trúc Response từ API GET /employee
// export interface EmployeeListResponse {
//   employees: Employee[]; // Frontend display format
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export interface EmployeeSearchParams {
//   name?: string; // Searches employee_name
//   group?: string; // Filters by department_id (via department lookup)
//   page?: number;
//   limit?: number;
// }

// // types/department.ts
// export interface Department {
//   department_id: number;
//   department_name: string;
// }

// // types/certification.ts
// export interface Certification {
//   certification_id: number;
//   certification_name: string;
//   certification_level: number;
// }

// export interface EmployeeCertification {
//   employee_certification_id: number;
//   employee_id: number;
//   certification_id: number;
//   start_date: string; // DATE format
//   end_date: string; // DATE format
//   score: number; // DECIMAL
// }
