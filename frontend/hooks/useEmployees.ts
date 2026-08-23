/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * useEmployees.ts, 24/8/2026 nguyenduykhanh2
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
 * tìm kiếm, sắp xếp đa cột theo thứ tự ưu tiên động, phân trang và đồng bộ 2 chiều với URL.
 *
 * @author nguyenduykhanh2
 * @return Các state và hàm handler phục vụ cho màn hình danh sách nhân viên
 */
export function useEmployees() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Đọc các giá trị từ URL Search Params
  const paramEmployeeName = searchParams.get('employee_name') || '';
  const paramDepartmentId = searchParams.get('department_id') || '';
  const paramOffset = parseInt(searchParams.get('offset') || '0', 10);
  const initialOffset = !isNaN(paramOffset) && paramOffset >= 0 ? paramOffset : 0;
  const initialPage = Math.floor(initialOffset / PAGING.DEFAULT_LIMIT) + 1;

  const paramOrdName = (searchParams.get('ord_employee_name') || '').toUpperCase();
  const paramOrdCert = (searchParams.get('ord_certification_name') || '').toUpperCase();
  const paramOrdEndDate = (searchParams.get('ord_end_date') || '').toUpperCase();

  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // State input điều kiện tìm kiếm (trên form)
  const [employeeName, setEmployeeName] = useState<string>(paramEmployeeName);
  const [departmentId, setDepartmentId] = useState<string>(paramDepartmentId);

  // State chiều sắp xếp của từng cột
  const [sortOrders, setSortOrders] = useState<SortOrders>({
    ord_employee_name: paramOrdName === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
    ord_certification_name: paramOrdCert === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
    ord_end_date: paramOrdEndDate === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
  });

  // Danh sách thứ tự ưu tiên các cột sắp xếp
  const [sortPriority, setSortPriority] = useState<SortField[]>([
    'ord_employee_name',
    'ord_certification_name',
    'ord_end_date',
  ]);

  // State phân trang
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const limit = PAGING.DEFAULT_LIMIT;

  // Đồng bộ URL mỗi khi điều kiện tìm kiếm / sort / phân trang thay đổi
  const syncUrl = useCallback(
    (name: string, deptId: string, priority: SortField[], orders: SortOrders, page: number) => {
      const params = new URLSearchParams();
      if (name.trim()) {
        params.set('employee_name', name.trim());
      }
      if (deptId) {
        params.set('department_id', deptId);
      }

      // Gắn các trường sắp xếp theo thứ tự ưu tiên
      priority.forEach((fieldKey) => {
        params.set(fieldKey, orders[fieldKey]);
      });

      const offsetVal = (page - 1) * limit;
      if (offsetVal > 0) {
        params.set('offset', offsetVal.toString());
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [pathname, router, limit]
  );

  // Tải danh sách phòng ban khi khởi tạo hook
  useEffect(() => {
    getDepartments()
      .then((res) => {
        if (res && res.code === 200) {
          setDepartments(res.departments || []);
        } else {
          setErrorMessage(ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
        }
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        setErrorMessage(ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
      });
  }, []);

  /**
   * Gọi API lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp và phân trang.
   */
  const fetchEmployees = useCallback(
    async (
      name: string,
      deptId: string,
      priority: SortField[],
      orders: SortOrders,
      offsetVal: number
    ) => {
      setLoading(true);
      setErrorMessage('');
      try {
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

        if (res && res.code === 200) {
          setEmployees(res.employees || []);
          setTotalRecords(res.totalRecords || 0);
        } else {
          setErrorMessage(ERROR_MESSAGES.GET_EMPLOYEES_FAILED);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrorMessage(ERROR_MESSAGES.GET_EMPLOYEES_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Tải dữ liệu ban đầu theo searchParams trên URL
  useEffect(() => {
    const activeOrders: SortOrders = {
      ord_employee_name: paramOrdName === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
      ord_certification_name: paramOrdCert === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
      ord_end_date: paramOrdEndDate === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
    };

    setEmployeeName(paramEmployeeName);
    setDepartmentId(paramDepartmentId);
    setSortOrders(activeOrders);
    setCurrentPage(initialPage);

    fetchEmployees(paramEmployeeName, paramDepartmentId, sortPriority, activeOrders, initialOffset);
  }, [
    paramEmployeeName,
    paramDepartmentId,
    paramOrdName,
    paramOrdCert,
    paramOrdEndDate,
    initialOffset,
    initialPage,
  ]);

  /**
   * Xử lý khi người dùng nhấn nút Tìm kiếm trên Form.
   */
  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setCurrentPage(1);
    syncUrl(employeeName, departmentId, sortPriority, sortOrders, 1);
    fetchEmployees(employeeName, departmentId, sortPriority, sortOrders, 0);
  };

  /**
   * Xử lý khi người dùng click vào tiêu đề cột để sắp xếp.
   */
  const handleSort = (field: SortField) => {
    const nextOrder = sortOrders[field] === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    const updatedOrders: SortOrders = {
      ...sortOrders,
      [field]: nextOrder,
    };

    const updatedPriority: SortField[] = [
      field,
      ...sortPriority.filter((f) => f !== field),
    ];

    setSortOrders(updatedOrders);
    setSortPriority(updatedPriority);
    setCurrentPage(1);

    syncUrl(employeeName, departmentId, updatedPriority, updatedOrders, 1);
    fetchEmployees(employeeName, departmentId, updatedPriority, updatedOrders, 0);
  };

  // Tính toán tổng số trang
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  /**
   * Xử lý khi chuyển trang.
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    setCurrentPage(page);
    const offsetVal = (page - 1) * limit;
    syncUrl(employeeName, departmentId, sortPriority, sortOrders, page);
    fetchEmployees(employeeName, departmentId, sortPriority, sortOrders, offsetVal);
  };

  // Đường dẫn hiện tại kèm đầy đủ query params để truyền returnTo sang các màn hình khác
  const currentReturnUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (employeeName.trim()) {
      params.set('employee_name', employeeName.trim());
    }
    if (departmentId) {
      params.set('department_id', departmentId);
    }
    sortPriority.forEach((fieldKey) => {
      params.set(fieldKey, sortOrders[fieldKey]);
    });
    const offsetVal = (currentPage - 1) * limit;
    if (offsetVal > 0) {
      params.set('offset', offsetVal.toString());
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [employeeName, departmentId, sortPriority, sortOrders, currentPage, limit, pathname]);

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
    currentReturnUrl,
    handleSearch,
    handleSort,
    handlePageChange,
  };
}
