'use client';

import { useState, useEffect } from 'react';
import { getCertifications } from '@/lib/api/certification';
import { CertificationItem } from '@/types/certification';
import { HTTP_STATUS } from '@/lib/constants';

/**
 * Custom Hook quản lý việc lấy và lưu trữ danh sách chứng chỉ tiếng Nhật.
 *
 * @author nguyenduykhanh2
 * @return danh sách chứng chỉ tiếng Nhật, trạng thái loading và thông báo lỗi
 */
export function useCertifications() {
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getCertifications()
      .then((res) => {
        if (isMounted) {
          if (res && res.code === HTTP_STATUS.OK) {
            setCertifications(res.certifications || []);
          } else {
            setErrorMessage('資格を取得できません');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching certifications:', err);
          setErrorMessage('資格を取得できません');
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
    certifications,
    isLoading,
    errorMessage,
  };
}
