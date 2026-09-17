'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDepartments } from '@/hooks/useDepartments';
import { getEmployees } from '@/lib/api/employee.api';
import { EmployeeItem, SortField, SortDirection, SortOrders } from '@/types/employee';
import { ROUTES, QUERY_PARAMS } from '@/lib/constants/routes';
import { PAGING, SORT_ORDER } from '@/lib/constants/table';
import { HTTP_STATUS } from '@/lib/constants/http';
import { API_ERROR_MESSAGES } from '@/lib/constants/messages';
import { parseSortFromParams, buildQueryString } from '@/lib/utils/employeeSort';
import { setStoredReturnUrl } from '@/lib/constants/storage';

export type { SortField, SortDirection, SortOrders };

/**
 * Custom Hook quản lý nghiệp vụ màn hình danh sách nhân viên (ADM002):
 * URL là Single Source of Truth cho việc tìm kiếm, sắp xếp và phân trang.
 */
export function useAdm002() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const limit = PAGING.DEFAULT_LIMIT;

  // 1. Lấy danh sách phòng ban từ useDepartments
  const { departments, errorMessage: deptError } = useDepartments();

  // 2. Đọc các tham số tìm kiếm và phân trang từ URL
  const searchParamsString = searchParams.toString();
  const paramEmployeeName = searchParams.get(QUERY_PARAMS.EMPLOYEE_NAME) || '';
  const paramDepartmentId = searchParams.get(QUERY_PARAMS.DEPARTMENT_ID) || '';
  const paramOffset = parseInt(searchParams.get(QUERY_PARAMS.OFFSET) || '0', 10);
  const currentOffset =
    !isNaN(paramOffset) && paramOffset >= 0 ? paramOffset : PAGING.DEFAULT_OFFSET;
  const currentPage = Math.floor(currentOffset / limit) + PAGING.DEFAULT_PAGE;

  // 3. Giải mã thứ tự ưu tiên và chiều sắp xếp từ URL
  const { parsedOrders: urlSortOrders, detectedPriority: urlSortPriority } = useMemo(
    () => parseSortFromParams(searchParams),
    [searchParamsString]
  );

  // 4. Khởi tạo các state dữ liệu và form
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [employeeName, setEmployeeName] = useState<string>(paramEmployeeName);
  const [departmentId, setDepartmentId] = useState<string>(paramDepartmentId);

  const [sortOrders, setSortOrders] = useState<SortOrders>(urlSortOrders);
  const [sortPriority, setSortPriority] = useState<SortField[]>(urlSortPriority);

  // 5. Đồng bộ lại form input và sort state khi URL thay đổi
  useEffect(() => {
    setEmployeeName(paramEmployeeName);
    setDepartmentId(paramDepartmentId);
    setSortOrders(urlSortOrders);
    setSortPriority(urlSortPriority);

    // Lưu URL hiện tại vào sessionStorage để các màn hình khác quay lại đúng bộ lọc
    const currentUrl = searchParamsString ? `${pathname}?${searchParamsString}` : pathname;
    setStoredReturnUrl(currentUrl);
  }, [paramEmployeeName, paramDepartmentId, urlSortOrders, urlSortPriority, pathname, searchParamsString]);

  /**
   * Đồng bộ các tham số tìm kiếm, sắp xếp và phân trang lên URL.
   */
  const syncUrlParameters = useCallback(
    (name: string, deptId: string, priority: SortField[], orders: SortOrders, page: number) => {
      // 1. Tạo chuỗi query string từ các tham số
      const query = buildQueryString(name, deptId, priority, orders, page, limit);
      const newUrl = query ? `${pathname}?${query}` : pathname;

      // 2. Cập nhật URL trên trình duyệt mà không reload trang
      router.push(newUrl, { scroll: false });
    },
    [pathname, router, limit]
  );

  /**
   * Gọi API lấy danh sách nhân viên khi URL query params thay đổi.
   */
  useEffect(() => {
    let isMounted = true;

    // 1. Đặt trạng thái đang tải và xóa lỗi cũ
    setIsLoading(true);
    setErrorMessage('');

    // 2. Đóng gói payload sắp xếp theo thứ tự ưu tiên
    const sortPayload: Record<string, string> = {};
    urlSortPriority.forEach((fieldKey) => {
      sortPayload[fieldKey] = urlSortOrders[fieldKey];
    });

    // 3. Gọi API lấy danh sách nhân viên
    getEmployees({
      employee_name: paramEmployeeName.trim() || undefined,
      department_id: paramDepartmentId ? Number(paramDepartmentId) : undefined,
      ...sortPayload,
      offset: currentOffset,
      limit: limit,
    })
      .then((res) => {
        // 3.1 Kiểm tra component còn mounted và API thành công
        if (!isMounted) return;
        if (res && res.code === HTTP_STATUS.OK) {
          setEmployees(res.employees || []);
          setTotalRecords(res.totalRecords || 0);
        } else {
          setErrorMessage(API_ERROR_MESSAGES.GET_EMPLOYEES_FAILED);
        }
      })
      .catch((err) => {
        // 3.2 Xử lý khi có lỗi ngoại lệ
        if (!isMounted) return;
        console.error('Error fetching employees:', err);
        setErrorMessage(API_ERROR_MESSAGES.GET_EMPLOYEES_FAILED);
      })
      .finally(() => {
        // 3.3 Tắt trạng thái tải khi hoàn tất
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    paramEmployeeName,
    paramDepartmentId,
    urlSortPriority,
    urlSortOrders,
    currentOffset,
    limit,
  ]);

  /**
   * Xử lý khi người dùng nhấn nút Tìm kiếm trên Form.
   */
  const handleSearch = (e?: React.FormEvent) => {
    // 1. Ngăn chặn submit form mặc định
    if (e) e.preventDefault();

    // 2. Đồng bộ URL về trang 1 với tiêu chí tìm kiếm mới
    syncUrlParameters(
      employeeName,
      departmentId,
      sortPriority,
      sortOrders,
      PAGING.DEFAULT_PAGE
    );
  };

  /**
   * Xử lý khi click vào tiêu đề cột để sắp xếp đa cột.
   */
  const handleSort = (field: SortField) => {
    // 1. Đảo chiều sắp xếp của cột được click (ASC -> DESC hoặc DESC -> ASC)
    const nextOrder: SortDirection =
      sortOrders[field] === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;

    const updatedOrders: SortOrders = {
      ...sortOrders,
      [field]: nextOrder,
    };

    // 2. Đưa cột được click lên vị trí ưu tiên số 1
    const updatedPriority: SortField[] = [
      field,
      ...sortPriority.filter((f) => f !== field),
    ];

    // 3. Cập nhật state và đồng bộ URL về trang 1
    setSortOrders(updatedOrders);
    setSortPriority(updatedPriority);

    syncUrlParameters(
      employeeName,
      departmentId,
      updatedPriority,
      updatedOrders,
      PAGING.DEFAULT_PAGE
    );
  };

  // Tính tổng số trang dựa trên tổng số bản ghi
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  /**
   * Xử lý khi người dùng chuyển trang trên Pagination.
   */
  const handlePageChange = (page: number) => {
    // 1. Kiểm tra điều kiện số trang đích hợp lệ
    if (page < 1 || page > totalPages || page === currentPage) return;

    // 2. Đồng bộ số trang mới lên URL
    syncUrlParameters(employeeName, departmentId, sortPriority, sortOrders, page);
  };

  /**
   * Xử lý điều hướng sang màn hình thêm mới nhân viên (URL sạch không kèm returnTo).
   */
  const handleAddNew = useCallback(() => {
    // 1. Chuyển hướng sang màn hình ADM004 với mode=add
    router.push(`${ROUTES.EMPLOYEE_ADD}?mode=add`);
  }, [router]);

  return {
    employees,
    departments,
    loading: isLoading,
    errorMessage: errorMessage || deptError || '',
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
    handleAddNew,
  };
}
