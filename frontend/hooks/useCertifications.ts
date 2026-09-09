'use client';

import { useState, useEffect } from 'react';
import { getCertifications } from '@/lib/api/certification.api';
import { CertificationItem } from '@/types/certification';
import { HTTP_STATUS } from '@/lib/constants';

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

    // 2.1 Bắt đầu trạng thái đang tải dữ liệu
    setIsLoading(true);

    // 2.2 Gọi API getCertifications từ tầng lib/api
    getCertifications()
      .then((res) => {
        // 2.2.1 Kiểm tra component còn đang mounted hay không
        if (isMounted) {
          // 2.2.2 Kiểm tra kết quả phản hồi từ API có thành công (mã 200) hay không
          if (res && res.code === HTTP_STATUS.OK) {
            // Lưu danh sách chứng chỉ vào state
            setCertifications(res.certifications || []);
          } else {
            // Lưu thông báo lỗi khi API phản hồi không thành công
            setErrorMessage('資格を取得できません');
          }
        }
      })
      .catch((err) => {
        // 2.2.3 Xử lý khi xảy ra lỗi ngoại lệ gọi API
        if (isMounted) {
          console.error('Error fetching certifications:', err);
          setErrorMessage('資格を取得できません');
        }
      })
      .finally(() => {
        // 2.2.4 Tắt trạng thái đang tải dữ liệu khi hoàn tất
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // 2.3 Hàm dọn dẹp khi unmount component để tránh memory leak
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
