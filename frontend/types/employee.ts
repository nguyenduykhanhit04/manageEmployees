/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * employee.ts, 25/8/2026 nguyenduykhanh2
 */
import { SORT_ORDER, SORT_FIELDS } from '@/lib/constants';

/**
 * Kiểu định danh các trường cho phép sắp xếp trong bảng nhân viên.
 */
export type SortField = typeof SORT_FIELDS[keyof typeof SORT_FIELDS];

/**
 * Chiều sắp xếp (ASC hoặc DESC).
 */
export type SortDirection = typeof SORT_ORDER.ASC | typeof SORT_ORDER.DESC;

/**
 * Trạng thái chiều sắp xếp của toàn bộ các cột có thể sắp xếp.
 */
export interface SortOrders {
  /** Chiều sắp xếp theo tên nhân viên */
  ord_employee_name: SortDirection;
  /** Chiều sắp xếp theo tên chứng chỉ tiếng Nhật */
  ord_certification_name: SortDirection;
  /** Chiều sắp xếp theo ngày hết hạn chứng chỉ */
  ord_end_date: SortDirection;
}

/**
 * Thông tin chi tiết một nhân viên được trả về từ API hiển thị lên bảng danh sách (ADM002).
 */
export interface EmployeeItem {
  /** Mã định danh nhân viên */
  employeeId: number;
  /** Tên đầy đủ của nhân viên */
  employeeName: string;
  /** Ngày sinh của nhân viên (định dạng YYYY-MM-DD hoặc null) */
  employeeBirthDate: string | null;
  /** Tên phòng ban / nhóm trực thuộc */
  departmentName: string;
  /** Địa chỉ email của nhân viên */
  employeeEmail: string;
  /** Số điện thoại liên hệ (hoặc null nếu chưa có) */
  employeeTelephone: string | null;
  /** Tên chứng chỉ tiếng Nhật (hoặc null nếu chưa có) */
  certificationName: string | null;
  /** Ngày hết hạn chứng chỉ tiếng Nhật (định dạng YYYY-MM-DD hoặc null) */
  endDate: string | null;
  /** Điểm số chứng chỉ tiếng Nhật (hoặc null nếu không có) */
  score: number | null;
}

/**
 * Cấu trúc dữ liệu phản hồi từ API lấy danh sách nhân viên.
 */
export interface EmployeeListApiResponse {
  /** Mã trạng thái HTTP phản hồi từ backend */
  code: number;
  /** Tổng số lượng bản ghi thỏa mãn điều kiện tìm kiếm */
  totalRecords: number;
  /** Danh sách nhân viên của trang hiện tại */
  employees: EmployeeItem[];
}

/**
 * Tham số tìm kiếm và phân trang gửi lên API lấy danh sách nhân viên.
 */
export interface EmployeeSearchParams {
  /** Từ khóa tìm kiếm theo tên nhân viên */
  employee_name?: string;
  /** Mã phòng ban cần lọc */
  department_id?: number;
  /** Vị trí bản ghi bắt đầu lấy */
  offset?: number;
  /** Số lượng bản ghi tối đa lấy về */
  limit?: number;
  /** Chiều sắp xếp theo tên nhân viên (ASC hoặc DESC) */
  ord_employee_name?: string;
  /** Chiều sắp xếp theo tên chứng chỉ (ASC hoặc DESC) */
  ord_certification_name?: string;
  /** Chiều sắp xếp theo ngày hết hạn chứng chỉ (ASC hoặc DESC) */
  ord_end_date?: string;
  /** Các trường sắp xếp khác nếu có */
  [key: string]: string | number | undefined;
}

/**
 * Cấu trúc dữ liệu gửi lên API tạo mới nhân viên.
 */
export interface EmployeeCreateRequest {
  /** Tên đầy đủ của nhân viên */
  employeeName: string;
  /** Mã phòng ban trực thuộc */
  departmentId: number;
  /** Địa chỉ email của nhân viên */
  employeeEmail: string;
  /** Tên Katakana của nhân viên */
  employeeNameKana?: string;
  /** Ngày sinh của nhân viên (YYYY-MM-DD) */
  employeeBirthDate?: string;
  /** Số điện thoại liên hệ */
  employeeTelephone?: string;
  /** Tên tài khoản đăng nhập */
  employeeLoginId: string;
}

/**
 * Cấu trúc dữ liệu gửi lên API cập nhật nhân viên.
 */
export interface EmployeeUpdateRequest {
  /** Mã định danh nhân viên cần cập nhật */
  employeeId: number;
  /** Tên đầy đủ của nhân viên */
  employeeName: string;
  /** Mã phòng ban trực thuộc */
  departmentId: number;
  /** Địa chỉ email của nhân viên */
  employeeEmail: string;
  /** Tên Katakana của nhân viên */
  employeeNameKana?: string;
  /** Ngày sinh của nhân viên (YYYY-MM-DD) */
  employeeBirthDate?: string;
  /** Số điện thoại liên hệ */
  employeeTelephone?: string;
  /** Tên tài khoản đăng nhập */
  employeeLoginId: string;
}
