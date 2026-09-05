'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDepartments } from '@/hooks/useDepartments';
import { useCertifications } from '@/hooks/useCertifications';
import { ROUTES } from '@/lib/constants';
import { ADM004_STORAGE_KEY } from '@/hooks/useAdm004';

/**
 * Hàm đọc dữ liệu tạm đã lưu từ màn hình ADM004 trong sessionStorage.
 *
 * @return đối tượng dữ liệu form hoặc null nếu không tồn tại
 */
export const getAddStorageSession = () => {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(ADM004_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

/**
 * Custom Hook quản lý hiển thị dữ liệu cho màn hình Xác nhận thông tin nhân viên (ADM005).
 *
 * @author nguyenduykhanh2
 * @return Các state và hàm handler phục vụ hiển thị cho ADM005
 */
export function useAdm005() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 1. Lấy Master Data (Phòng ban & Chứng chỉ tiếng Nhật)
  const { departments, isLoading: isLoadingDept } = useDepartments();
  const { certifications, isLoading: isLoadingCert } = useCertifications();

  // 2. Khởi tạo: Đọc sessionStorage khi màn hình ADM005 được load
  useEffect(() => {
    const data = getAddStorageSession();
    if (!data) {
      // Nếu không có dữ liệu trong storage (truy cập URL trực tiếp), điều hướng về danh sách ADM002
      router.push(ROUTES.EMPLOYEE_LIST);
      return;
    }
    setFormData(data);
  }, [router]);

  // 3. Map ID sang Tên hiển thị (Department Name & Certification Name)
  const departmentName =
    departments.find((d) => String(d.departmentId) === String(formData?.departmentId))
      ?.departmentName || '';

  const certificationName =
    certifications.find((c) => String(c.certificationId) === String(formData?.certificationId))
      ?.certificationName || '';

  // 4. Xử lý khi nhấn nút "OK" (Tạm thời chuyển hướng sang màn hình ADM006)
  const handleOk = useCallback(() => {
    router.push(ROUTES.EMPLOYEE_COMPLETE);
  }, [router]);

  // 5. Xử lý khi nhấn nút "Quay lại" (戻る) -> Quay về ADM004 kèm mode=back để khôi phục form
  const handleBack = useCallback(() => {
    const returnTo = formData?.returnTo || ROUTES.EMPLOYEE_LIST;
    router.push(`${ROUTES.EMPLOYEE_EDIT}?mode=back&returnTo=${encodeURIComponent(returnTo)}`);
  }, [formData, router]);

  return {
    formData,
    departmentName,
    certificationName,
    isLoading: isLoadingDept || isLoadingCert || !formData,
    errorMessage,
    setErrorMessage,
    handleOk,
    handleBack,
  };
}
