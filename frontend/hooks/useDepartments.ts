/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * useDepartments.ts, 23/8/2026 nguyenduykhanh2
 */
'use client';

import { useState, useEffect } from 'react';
import { getDepartments } from '@/lib/api/department';
import { DepartmentItem } from '@/types/department';

/**
 * Custom Hook lấy danh sách phòng ban phục vụ cho Dropdown.
 *
 * @author nguyenduykhanh2
 * @return danh sách phòng ban, trạng thái loading và lỗi
 */
export function useDepartments() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    getDepartments()
      .then((res) => {
        if (isMounted) {
          if (res && res.code === 200) {
            setDepartments(res.departments || []);
          } else {
            setErrorMessage('システムエラーが発生しました。');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching departments:', err);
          setErrorMessage('システムエラーが発生しました。');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { departments, loading, errorMessage };
}
