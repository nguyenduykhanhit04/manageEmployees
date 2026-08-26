/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * department.ts, 25/8/2026 nguyenduykhanh2
 */

/**
 * Thông tin chi tiết một phòng ban.
 */
export interface DepartmentItem {
  /** Mã định danh phòng ban */
  departmentId: number;
  /** Tên phòng ban */
  departmentName: string;
}

/**
 * Cấu trúc phản hồi từ API lấy danh sách phòng ban.
 */
export interface DepartmentListApiResponse {
  /** Mã trạng thái HTTP từ backend */
  code: number;
  /** Danh sách phòng ban */
  departments: DepartmentItem[];
}
