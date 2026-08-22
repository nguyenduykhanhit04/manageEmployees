/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * useEmployees.ts, 22/8/2026 nguyenduykhanh2
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEmployees } from '@/lib/api/employee';
import { getDepartments } from '@/lib/api/department';
import { EmployeeItem } from '@/types/employee';
import { DepartmentItem } from '@/types/department';
import { PAGING, SORT_ORDER, ERROR_MESSAGES } from '@/lib/constants';

export type SortField = 'ord_employee_name' | 'ord_certification_name' | 'ord_end_date';
export type SortDirection = typeof SORT_ORDER.ASC | typeof SORT_ORDER.DESC;

export interface SortOrders {
  ord_employee_name: SortDirection;
  ord_certification_name: SortDirection;
  ord_end_date: SortDirection;
}

/**
 * Custom Hook quản lý toàn bộ nghiệp vụ lấy danh sách nhân viên, phòng ban,
 * tìm kiếm, sắp xếp đa cột theo thứ tự ưu tiên động và phân trang theo đúng kiến trúc Clean UI và Checklist.
 *
 * @author nguyenduykhanh2
 * @return Các state và hàm handler phục vụ cho màn hình danh sách nhân viên
 */
export function useEmployees() {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // State điều kiện tìm kiếm
  const [employeeName, setEmployeeName] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');

  // State chiều sắp xếp của từng cột
  const [sortOrders, setSortOrders] = useState<SortOrders>({
    ord_employee_name: SORT_ORDER.ASC,
    ord_certification_name: SORT_ORDER.ASC,
    ord_end_date: SORT_ORDER.ASC,
  });

  // Danh sách thứ tự ưu tiên các cột sắp xếp (cột click gần nhất sẽ nằm ở đầu mảng)
  const [sortPriority, setSortPriority] = useState<SortField[]>([
    'ord_employee_name',
    'ord_certification_name',
    'ord_end_date',
  ]);

  // State phân trang
  const [currentPage, setCurrentPage] = useState<number>(PAGING.DEFAULT_PAGE);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const limit = PAGING.DEFAULT_LIMIT;

  // Tải danh sách phòng ban khi khởi tạo component
  useEffect(() => {
    getDepartments()
      .then((res) => {
        // Kiểm tra phản hồi API thành công
        if (res && res.code === 200) {
          setDepartments(res.departments || []);
        } else {
          // Trường hợp API trả về mã lỗi
          setErrorMessage(ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
        }
      })
      .catch((err) => {
        // Ghi log và thông báo lỗi khi kết nối thất bại
        console.error('Error fetching departments:', err);
        setErrorMessage(ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
      });
  }, []);

  /**
   * Gọi API lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp đa cột theo thứ tự ưu tiên và phân trang.
   *
   * @param name tên nhân viên cần tìm kiếm
   * @param deptId mã phòng ban cần tìm kiếm
   * @param priority danh sách các cột sắp xếp theo thứ tự ưu tiên (cột ưu tiên 1 đứng đầu)
   * @param orders chiều sắp xếp của từng cột
   * @param offsetVal vị trí bắt đầu lấy dữ liệu
   */
  const fetchEmployees = useCallback(
    async (
      name: string = employeeName,
      deptId: string = departmentId,
      priority: SortField[] = sortPriority,
      orders: SortOrders = sortOrders,
      offsetVal: number = 0
    ) => {
      setLoading(true);
      setErrorMessage('');
      try {
        // Đóng gói các tham số sort theo đúng thứ tự ưu tiên trong mảng priority
        const sortPayload: Record<string, string> = {};
        priority.forEach((fieldKey) => {
          sortPayload[fieldKey] = orders[fieldKey];
        });

        const res = await getEmployees({
          employee_name: name.trim() || undefined,
          department_id: deptId ? Number(deptId) : undefined,
          ...sortPayload,
          offset: offsetVal,
          limit: limit,
        });

        // Kiểm tra kết quả trả về từ Backend
        if (res && res.code === 200) {
          setEmployees(res.employees || []);
          setTotalRecords(res.totalRecords || 0);
        } else {
          // Gán thông báo lỗi khi API phản hồi thất bại
          setErrorMessage(ERROR_MESSAGES.GET_EMPLOYEES_FAILED);
        }
      } catch (error) {
        // Bắt lỗi ngoại lệ khi gọi API
        console.error('Error fetching employees:', error);
        setErrorMessage(ERROR_MESSAGES.GET_EMPLOYEES_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [employeeName, departmentId, sortPriority, sortOrders, limit]
  );

  // Tải danh sách mặc định ban đầu
  useEffect(() => {
    fetchEmployees('', '', ['ord_employee_name', 'ord_certification_name', 'ord_end_date'], {
      ord_employee_name: SORT_ORDER.ASC,
      ord_certification_name: SORT_ORDER.ASC,
      ord_end_date: SORT_ORDER.ASC,
    }, 0);
  }, []);

  /**
   * Xử lý khi người dùng nhấn nút Tìm kiếm trên Form.
   *
   * @param e sự kiện form submit (tùy chọn)
   */
  const handleSearch = (e?: React.FormEvent) => {
    // Ngăn chặn reload trang mặc định của trình duyệt
    if (e) {
      e.preventDefault();
    }
    // Đưa phân trang về trang 1 khi tìm kiếm mới
    setCurrentPage(1);
    fetchEmployees(employeeName, departmentId, sortPriority, sortOrders, 0);
  };

  /**
   * Xử lý khi người dùng click vào tiêu đề cột để đảo chiều sắp xếp và đẩy cột đó lên ưu tiên số 1.
   *
   * @param field tên trường vừa được click
   */
  const handleSort = (field: SortField) => {
    // Đảo chiều sắp xếp ASC <-> DESC của cột vừa click
    const nextOrder = sortOrders[field] === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    const updatedOrders: SortOrders = {
      ...sortOrders,
      [field]: nextOrder,
    };

    // Đưa cột vừa click lên đầu danh sách ưu tiên (Priority #1)
    const updatedPriority: SortField[] = [
      field,
      ...sortPriority.filter((f) => f !== field),
    ];

    setSortOrders(updatedOrders);
    setSortPriority(updatedPriority);

    // Đưa phân trang về trang 1 khi sắp xếp lại
    setCurrentPage(1);
    fetchEmployees(employeeName, departmentId, updatedPriority, updatedOrders, 0);
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(totalRecords / limit) || 1;

  /**
   * Xử lý khi người dùng click chuyển sang trang khác.
   *
   * @param page số trang muốn chuyển tới
   */
  const handlePageChange = (page: number) => {
    // Kiểm tra tính hợp lệ của số trang chuyển tới
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    setCurrentPage(page);
    fetchEmployees(employeeName, departmentId, sortPriority, sortOrders, (page - 1) * limit);
  };

  return {
    employees,
    departments,
    loading,
    errorMessage,
    employeeName,
    setEmployeeName,
    departmentId,
    setDepartmentId,
    sortOrders,
    sortPriority,
    currentPage,
    totalPages,
    handleSearch,
    handleSort,
    handlePageChange,
  };
}
