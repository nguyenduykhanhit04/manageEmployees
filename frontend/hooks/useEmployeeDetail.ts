/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * useEmployeeDetail.ts, 24/8/2026 nguyenduykhanh2
 */
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getEmployeeById } from '@/lib/api/employee';
import { EmployeeDetailApiResponse } from '@/types/employee';
import { ERROR_MESSAGES } from '@/lib/constants/messages';
import axios from 'axios';

/**
 * Custom Hook quản lý dữ liệu và logic hiển thị chi tiết nhân viên (ADM006).
 *
 * @param initialId ID nhân viên (nếu truyền trực tiếp)
 * @return Các state và hàm xử lý chi tiết nhân viên
 */
export function useEmployeeDetail(initialId?: string | number) {
  const router = useRouter();
  let searchParams: URLSearchParams | null = null;
  try {
    searchParams = useSearchParams() as unknown as URLSearchParams;
  } catch {
    // In case useSearchParams is not in Suspense or SSR
  }
  const employeeId = initialId || searchParams?.get?.('id') || null;

  const [employee, setEmployee] = useState<EmployeeDetailApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Gọi API tải dữ liệu chi tiết nhân viên
   */
  const fetchEmployeeDetail = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getEmployeeById(id);
      if (data && data.code === 200) {
        setEmployee(data);
      } else {
        const errCode = data?.message?.code;
        const msg = (errCode && ERROR_MESSAGES[errCode]) ? ERROR_MESSAGES[errCode] : '該当するユーザが存在しません。';
        setErrorMessage(msg);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errData = err.response.data as { message?: { code?: string; params?: string[] } };
        const code = errData?.message?.code;
        if (code === 'ER013' || code === 'ER001') {
          setErrorMessage(ERROR_MESSAGES[code] || '該当するユーザが存在しません。');
        } else if (code && ERROR_MESSAGES[code]) {
          setErrorMessage(ERROR_MESSAGES[code]);
        } else {
          setErrorMessage('システムエラーが発生しました。');
        }
      } else {
        setErrorMessage('システムエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!employeeId) {
      setErrorMessage(ERROR_MESSAGES['ER001'] || 'ＩＤを入力してください。');
      setLoading(false);
      return;
    }

    fetchEmployeeDetail(employeeId);
  }, [employeeId, fetchEmployeeDetail]);

  /**
   * Chuyển hướng quay lại màn hình danh sách ADM002
   */
  const handleBack = useCallback(() => {
    router.push('/employees/adm002');
  }, [router]);

  /**
   * Chuyển hướng sang màn hình chỉnh sửa
   */
  const handleEdit = useCallback(() => {
    if (employeeId) {
      router.push(`/employees/edit?id=${employeeId}`);
    }
  }, [router, employeeId]);

  return {
    employee,
    loading,
    errorMessage,
    employeeId,
    handleBack,
    handleEdit,
    refetch: () => {
      if (employeeId) {
        fetchEmployeeDetail(employeeId);
      }
    },
  };
}
