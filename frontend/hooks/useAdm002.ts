'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getEmployees } from '@/lib/api/employee';
import { getDepartments } from '@/lib/api/department';
import { EmployeeItem, SortField, SortDirection, SortOrders } from '@/types/employee';
import { DepartmentItem } from '@/types/department';
import {
  PAGING,
  SORT_ORDER,
  SORT_FIELDS,
  ROUTES,
  QUERY_PARAMS,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '@/lib/constants';

// Re-export các kiểu dữ liệu sắp xếp
export type { SortField, SortDirection, SortOrders };

/**
 * Trích xuất thứ tự ưu tiên và chiều sắp xếp của các cột từ URLSearchParams.
 *
 * @param params danh sách tham số URL
 * @return bộ giá trị sortOrders và danh sách sortPriority theo thứ tự xuất hiện trên URL
 */
function parseSortFromParams(params: {
  get: (key: string) => string | null;
  forEach?: (callback: (value: string, key: string) => void) => void;
}): {
  parsedOrders: SortOrders;
  detectedPriority: SortField[];
} {
  const allSortFields: SortField[] = [
    SORT_FIELDS.EMPLOYEE_NAME,
    SORT_FIELDS.CERTIFICATION_NAME,
    SORT_FIELDS.END_DATE,
  ];

  const parsedOrders: SortOrders = {
    [SORT_FIELDS.EMPLOYEE_NAME]: SORT_ORDER.ASC,
    [SORT_FIELDS.CERTIFICATION_NAME]: SORT_ORDER.ASC,
    [SORT_FIELDS.END_DATE]: SORT_ORDER.ASC,
  };

  const detectedPriority: SortField[] = [];

  // 1. Quét qua URL params theo thứ tự xuất hiện để xác định thứ tự ưu tiên các cột
  if (typeof params.forEach === 'function') {
    params.forEach((val, key) => {
      if (allSortFields.includes(key as SortField)) {
        const field = key as SortField;
        const upperVal = val ? val.toUpperCase() : '';
        if (upperVal === SORT_ORDER.DESC) {
          parsedOrders[field] = SORT_ORDER.DESC;
        } else {
          parsedOrders[field] = SORT_ORDER.ASC;
        }
        if (!detectedPriority.includes(field)) {
          detectedPriority.push(field);
        }
      }
    });
  }

  // 2. Bổ sung các trường còn lại vào priority list nếu chưa có trên URL
  allSortFields.forEach((field) => {
    if (!detectedPriority.includes(field)) {
      const val = params.get(field);
      if (val) {
        if (val.toUpperCase() === SORT_ORDER.DESC) {
          parsedOrders[field] = SORT_ORDER.DESC;
        } else {
          parsedOrders[field] = SORT_ORDER.ASC;
        }
      }
      detectedPriority.push(field);
    }
  });

  return { parsedOrders, detectedPriority };
}

/**
 * Custom Hook quản lý toàn bộ nghiệp vụ cho màn hình danh sách nhân viên (ADM002):
 * lấy danh sách nhân viên, danh sách phòng ban, tìm kiếm, sắp xếp đa cột ưu tiên,
 * phân trang và điều hướng sang màn hình thêm mới (ADM003).
 *
 * @author nguyenduykhanh2
 * @return Các state và hàm handler phục vụ cho màn hình ADM002
 */
export function useAdm002() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Đọc các giá trị khởi tạo từ URL Search Params
  const paramEmployeeName = searchParams.get(QUERY_PARAMS.EMPLOYEE_NAME) || '';
  const paramDepartmentId = searchParams.get(QUERY_PARAMS.DEPARTMENT_ID) || '';
  const paramOffset = parseInt(searchParams.get(QUERY_PARAMS.OFFSET) || '0', 10);
  const initialOffset = !isNaN(paramOffset) && paramOffset >= 0 ? paramOffset : PAGING.DEFAULT_OFFSET;
  const initialPage = Math.floor(initialOffset / PAGING.DEFAULT_LIMIT) + PAGING.DEFAULT_PAGE;

  const { parsedOrders: initialOrders, detectedPriority: initialPriority } = useMemo(() => {
    return parseSortFromParams(searchParams);
  }, [searchParams]);

  // 2. Khởi tạo state
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // State form tìm kiếm
  const [employeeName, setEmployeeName] = useState<string>(paramEmployeeName);
  const [departmentId, setDepartmentId] = useState<string>(paramDepartmentId);

  // State sắp xếp và thứ tự ưu tiên các cột
  const [sortOrders, setSortOrders] = useState<SortOrders>(initialOrders);
  const [sortPriority, setSortPriority] = useState<SortField[]>(initialPriority);

  // State phân trang
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const limit = PAGING.DEFAULT_LIMIT;

  /**
   * Đồng bộ các tham số tìm kiếm, sắp xếp và phân trang lên URL.
   */
  const syncUrlParameters = useCallback(
    (name: string, deptId: string, priority: SortField[], orders: SortOrders, page: number) => {
      const params = new URLSearchParams();

      if (name.trim()) {
        params.set(QUERY_PARAMS.EMPLOYEE_NAME, name.trim());
      }
      if (deptId) {
        params.set(QUERY_PARAMS.DEPARTMENT_ID, deptId);
      }

      // Đẩy các tham số sắp xếp lên URL theo đúng thứ tự ưu tiên
      priority.forEach((fieldKey) => {
        params.set(fieldKey, orders[fieldKey]);
      });

      const offsetVal = (page - 1) * limit;
      if (offsetVal > 0) {
        params.set(QUERY_PARAMS.OFFSET, offsetVal.toString());
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [pathname, router, limit]
  );

  /**
   * Tải danh sách phòng ban từ API.
   */
  useEffect(() => {
    getDepartments()
      .then((res) => {
        if (res && res.code === HTTP_STATUS.OK) {
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
   * Gọi API lấy danh sách nhân viên theo điều kiện tìm kiếm, sắp xếp đa cột và phân trang.
   */
  const fetchEmployees = useCallback(
    async (
      name: string,
      deptId: string,
      priority: SortField[],
      orders: SortOrders,
      offsetVal: number
    ) => {
      setIsLoading(true);
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

        if (res && res.code === HTTP_STATUS.OK) {
          setEmployees(res.employees || []);
          setTotalRecords(res.totalRecords || 0);
        } else {
          setErrorMessage(ERROR_MESSAGES.GET_EMPLOYEES_FAILED);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrorMessage(ERROR_MESSAGES.GET_EMPLOYEES_FAILED);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  const searchParamsString = searchParams.toString();

  // Tải dữ liệu ban đầu hoặc khi URL params thay đổi
  useEffect(() => {
    const { parsedOrders: activeOrders, detectedPriority: activePriority } = parseSortFromParams(searchParams);

    setEmployeeName(paramEmployeeName);
    setDepartmentId(paramDepartmentId);
    setSortOrders(activeOrders);
    setSortPriority(activePriority);
    setCurrentPage(initialPage);

    fetchEmployees(paramEmployeeName, paramDepartmentId, activePriority, activeOrders, initialOffset);
  }, [
    paramEmployeeName,
    paramDepartmentId,
    searchParamsString,
    initialOffset,
    initialPage,
    fetchEmployees,
  ]);

  /**
   * Xử lý khi người dùng nhấn nút Tìm kiếm trên Form.
   */
  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setCurrentPage(PAGING.DEFAULT_PAGE);
    syncUrlParameters(employeeName, departmentId, sortPriority, sortOrders, PAGING.DEFAULT_PAGE);
    fetchEmployees(employeeName, departmentId, sortPriority, sortOrders, PAGING.DEFAULT_OFFSET);
  };

  /**
   * Xử lý khi người dùng click vào tiêu đề cột để sắp xếp:
   * - Cột được click sẽ trở thành trường ưu tiên số 1 .
   * - Chiều sắp xếp của cột được đảo (ASC -> DESC hoặc DESC -> ASC).
   *
   * @param field tên trường cần sắp xếp
   */
  const handleSort = (field: SortField) => {
    // 1. Đảo chiều sắp xếp cho cột được click
    let nextOrder: SortDirection = SORT_ORDER.ASC;
    if (sortOrders[field] === SORT_ORDER.ASC) {
      nextOrder = SORT_ORDER.DESC;
    } else {
      nextOrder = SORT_ORDER.ASC;
    }

    const updatedOrders: SortOrders = {
      ...sortOrders,
      [field]: nextOrder,
    };

    // 2. Đưa cột được click lên vị trí ưu tiên cao nhất (index 0)
    const updatedPriority: SortField[] = [
      field,
      ...sortPriority.filter((f) => f !== field),
    ];

    setSortOrders(updatedOrders);
    setSortPriority(updatedPriority);
    setCurrentPage(PAGING.DEFAULT_PAGE);

    // 3. Đồng bộ URL và gọi API lấy dữ liệu mới
    syncUrlParameters(employeeName, departmentId, updatedPriority, updatedOrders, PAGING.DEFAULT_PAGE);
    fetchEmployees(employeeName, departmentId, updatedPriority, updatedOrders, PAGING.DEFAULT_OFFSET);
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
    syncUrlParameters(employeeName, departmentId, sortPriority, sortOrders, page);
    fetchEmployees(employeeName, departmentId, sortPriority, sortOrders, offsetVal);
  };

  // Đường dẫn hiện tại kèm đầy đủ query params để truyền returnTo sang các màn hình khác
  const currentReturnUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (employeeName.trim()) {
      params.set(QUERY_PARAMS.EMPLOYEE_NAME, employeeName.trim());
    }
    if (departmentId) {
      params.set(QUERY_PARAMS.DEPARTMENT_ID, departmentId);
    }
    sortPriority.forEach((fieldKey) => {
      params.set(fieldKey, sortOrders[fieldKey]);
    });
    const offsetVal = (currentPage - 1) * limit;
    if (offsetVal > 0) {
      params.set(QUERY_PARAMS.OFFSET, offsetVal.toString());
    }
    const query = params.toString();
    if (query) {
      return `${pathname}?${query}`;
    }
    return pathname;
  }, [employeeName, departmentId, sortPriority, sortOrders, currentPage, limit, pathname]);

  /**
   * Xử lý điều hướng sang màn hình thêm mới nhân viên kèm đường dẫn quay lại.
   */
  const handleAddNew = useCallback(() => {
    const targetUrl = `${ROUTES.EMPLOYEE_ADD}?${QUERY_PARAMS.RETURN_TO}=${encodeURIComponent(currentReturnUrl)}`;
    router.push(targetUrl);
  }, [currentReturnUrl, router]);

  return {
    employees,
    departments,
    loading: isLoading,
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
    handleAddNew,
  };
}
