'use client';

import { useState, useEffect } from 'react';
import { getDepartments } from '@/lib/api/department';
import { DepartmentItem } from '@/types/department';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Custom Hook quản lý việc lấy và lưu trữ danh sách phòng ban.
 *
 * @author nguyenduykhanh2
 * @return danh sách phòng ban, trạng thái loading và thông báo lỗi
 */
export function useDepartments() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getDepartments()
      .then((res) => {
        if (isMounted) {
          if (res && res.code === HTTP_STATUS.OK) {
            setDepartments(res.departments || []);
          } else {
            setErrorMessage(ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching departments:', err);
          setErrorMessage(ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    departments,
    isLoading,
    errorMessage,
  };
}
