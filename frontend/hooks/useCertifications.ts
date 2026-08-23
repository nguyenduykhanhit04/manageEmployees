/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * useCertifications.ts, 23/8/2026 nguyenduykhanh2
 */
'use client';

import { useState, useEffect } from 'react';
import { getCertifications } from '@/lib/api/certification';
import { CertificationItem } from '@/types/certification';

/**
 * Custom Hook lấy danh sách chứng chỉ tiếng Nhật phục vụ cho Dropdown.
 *
 * @author nguyenduykhanh2
 * @return danh sách chứng chỉ, trạng thái loading và lỗi
 */
export function useCertifications() {
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    getCertifications()
      .then((res) => {
        if (isMounted) {
          if (res && res.code === 200) {
            setCertifications(res.certifications || []);
          } else {
            setErrorMessage('システムエラーが発生しました。');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching certifications:', err);
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

  return { certifications, loading, errorMessage };
}
