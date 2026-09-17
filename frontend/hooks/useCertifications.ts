'use client';

import { useState, useEffect } from 'react';
import { getCertifications } from '@/lib/api/certification.api';
import { CertificationItem } from '@/types/certification';
import { HTTP_STATUS } from '@/lib/constants/http';
import { API_ERROR_MESSAGES } from '@/lib/constants/messages';

/**
 * Custom Hook quản lý việc lấy và lưu trữ danh sách chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 * @return danh sách chứng chỉ tiếng Nhật, trạng thái loading và thông báo lỗi
 */
export function useCertifications() {
  // 1. Khai báo các state quản lý danh sách chứng chỉ, trạng thái tải và thông báo lỗi
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 2. Kích hoạt gọi API lấy danh sách chứng chỉ khi component được mount
  useEffect(() => {
    let isMounted = true;

    // 2.1 Hàm bất đồng bộ gọi API lấy danh sách chứng chỉ
    const fetchCertifications = async () => {
      setIsLoading(true);
      try {
        const res = await getCertifications();
        if (!isMounted) return;

        if (res && res.code === HTTP_STATUS.OK) {
          setCertifications(res.certifications || []);
          return;
        }
        throw new Error();
      } catch {
        // 2.2 Xử lý khi API lỗi hoặc ném ngoại lệ
        if (isMounted) {
          setErrorMessage(API_ERROR_MESSAGES.GET_CERTIFICATIONS_FAILED);
        }
      } finally {
        // 2.3 Tắt trạng thái đang tải dữ liệu khi hoàn tất
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCertifications();

    // 2.4 Hàm dọn dẹp khi unmount component để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Trả về các state và giá trị cần thiết cho component sử dụng
  return {
    certifications,
    isLoading,
    errorMessage,
  };
}
