'use client';

import { useState, useEffect } from 'react';
import { getDepartments } from '@/lib/api/department.api';
import { DepartmentItem } from '@/types/department';
import { HTTP_STATUS } from '@/lib/constants/http';
import { API_ERROR_MESSAGES } from '@/lib/constants/messages';

/**
 * Custom Hook quản lý việc lấy và lưu trữ danh sách phòng ban.
 *
 * @author nguyenduykhanh2
 * @return danh sách phòng ban, trạng thái loading và thông báo lỗi
 */
export function useDepartments() {
  // 1. Khai báo các state quản lý danh sách phòng ban, trạng thái tải và thông báo lỗi
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 2. Kích hoạt gọi API lấy danh sách phòng ban khi component được mount
  useEffect(() => {
    let isMounted = true;

    // 2.1 Hàm bất đồng bộ gọi API lấy danh sách phòng ban
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const res = await getDepartments();
        if (!isMounted) return;

        if (res && res.code === HTTP_STATUS.OK) {
          setDepartments(res.departments || []);
          return;
        }
        throw new Error();
      } catch {
        // 2.2 Xử lý khi API lỗi hoặc ném ngoại lệ
        if (isMounted) {
          setErrorMessage(API_ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
        }
      } finally {
        // 2.3 Tắt trạng thái đang tải dữ liệu khi hoàn tất
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDepartments();

    // 2.4 Hàm dọn dẹp khi unmount component để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Trả về các state và giá trị cần thiết cho component sử dụng
  return {
    departments,
    isLoading,
    errorMessage,
  };
}
