// types/department.ts
export interface DepartmentItem {
  departmentId: number;
  departmentName: string;
}

export interface DepartmentListApiResponse {
  code: number;
  departments: DepartmentItem[];
}
