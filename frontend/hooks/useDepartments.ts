'use client';

import { useState, useEffect } from 'react';
import { getDepartments } from '@/lib/api/department.api';
import { DepartmentItem } from '@/types/department';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants';

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

    // 2.1 Bắt đầu trạng thái đang tải dữ liệu
    setIsLoading(true);

    // 2.2 Gọi API getDepartments từ tầng lib/api
    getDepartments()
      .then((res) => {
        // 2.2.1 Kiểm tra component còn đang mounted hay không
        if (isMounted) {
          // 2.2.2 Kiểm tra kết quả phản hồi từ API có thành công (mã 200) hay không
          if (res && res.code === HTTP_STATUS.OK) {
            // Lưu danh sách phòng ban vào state
            setDepartments(res.departments || []);
          } else {
            // Lưu thông báo lỗi khi API phản hồi không thành công
            setErrorMessage(ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
          }
        }
      })
      .catch((err) => {
        // 2.2.3 Xử lý khi xảy ra lỗi ngoại lệ gọi API
        if (isMounted) {
          console.error('Error fetching departments:', err);
          setErrorMessage(ERROR_MESSAGES.GET_DEPARTMENTS_FAILED);
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
    departments,
    isLoading,
    errorMessage,
  };
}
