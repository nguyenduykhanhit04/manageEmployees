'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDepartments } from '@/hooks/useDepartments';
import { useCertifications } from '@/hooks/useCertifications';
import { getEmployee, createEmployee, updateEmployee, deleteEmployee } from '@/lib/api/employee.api';
import { ROUTES } from '@/lib/constants/routes';
import { HTTP_STATUS } from '@/lib/constants/http';
import { ERROR_MESSAGES } from '@/lib/constants/messages';
import { EmployeeFormData } from '@/lib/validation/employee';
import { getStoredReturnUrl, STORAGE_KEYS } from '@/lib/constants/storage';
import { extractApiErrorMessage } from '@/lib/utils/apiError';
import {
  mapEmployeeDetailToFormData,
  buildBaseEmployeePayload,
} from '@/lib/utils/employeeMapper';

/**
 * Custom Hook quản lý dữ liệu và nghiệp vụ cho màn hình Xác nhận (ADM005).
 * Hỗ trợ 3 chế độ hoạt động (mode):
 * - `add`: Xác nhận thêm mới nhân viên (dữ liệu truyền qua sessionStorage từ ADM004).
 * - `edit`: Xác nhận chỉnh sửa thông tin nhân viên (dữ liệu truyền qua sessionStorage từ ADM004).
 * - `delete`: Xác nhận xóa nhân viên (lấy thông tin chi tiết qua API getEmployee).
 *
 * @author nguyenduykhanh2
 */
export function useAdm005() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Đọc các tham số truy vấn (query params) từ URL
  const mode = (searchParams.get('mode') || 'add').toLowerCase();
  const employeeId = searchParams.get('id') || searchParams.get('employeeId');

  // 2. Khai báo các state quản lý giao diện và dữ liệu
  const [formData, setFormData] = useState<EmployeeFormData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSystemError, setIsSystemError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(mode === 'delete');

  // 3. Lấy Master Data (Danh sách phòng ban & Danh sách chứng chỉ tiếng Nhật)
  const { departments, isLoading: isLoadingDept } = useDepartments();
  const { certifications, isLoading: isLoadingCert } = useCertifications();

  // 4. Khởi tạo: Nạp dữ liệu form hiển thị dựa theo từng mode
  useEffect(() => {
    // 4.1 Xử lý khi mode là XÓA (mode = delete) -> Lấy dữ liệu từ Backend API
    if (mode === 'delete') {
      // 4.1.1 Kiểm tra tính hợp lệ của employeeId; nếu không có thì báo lỗi hệ thống
      if (!employeeId) {
        setIsSystemError(true);
        setIsLoadingDetail(false);
        return;
      }

      // 4.1.2 Bật trạng thái loading và gọi API lấy chi tiết nhân viên
      const fetchEmployeeDetail = async () => {
        setIsLoadingDetail(true);
        setIsSystemError(false);
        try {
          const res = await getEmployee(employeeId);
          // 4.1.3 Khi API trả về thành công: Map dữ liệu nhân viên & chứng chỉ vào formData
          if (res && res.code === HTTP_STATUS.OK) {
            setFormData(mapEmployeeDetailToFormData(res));
            return;
          }
          throw new Error();
        } catch {
          // 4.1.4 Bắt lỗi khi không thể kết nối hoặc API ném ngoại lệ
          setIsSystemError(true);
        } finally {
          // 4.1.5 Tắt trạng thái loading khi hoàn tất gọi API
          setIsLoadingDetail(false);
        }
      };

      fetchEmployeeDetail();
      return;
    }

    // 4.2 Xử lý khi mode là THÊM MỚI (add) hoặc CHỈNH SỬA (edit) -> Đọc từ sessionStorage
    // 4.2.1 Đọc dữ liệu tạm đã nhập ở màn hình ADM004
    const storedDataStr = sessionStorage.getItem(STORAGE_KEYS.ADM004_TEMP_DATA);
    if (!storedDataStr) {
      // 4.2.2 Nếu không tìm thấy dữ liệu (F5 hoặc truy cập trực tiếp), điều hướng về danh sách ADM002
      router.push(ROUTES.EMPLOYEE_LIST);
      return;
    }
    try {
      // 4.2.3 Parse chuỗi JSON thành object EmployeeFormData và cập nhật vào state
      setFormData(JSON.parse(storedDataStr));
    } catch {
      // Nếu dữ liệu JSON bị hỏng, điều hướng về danh sách nhân viên
      router.push(ROUTES.EMPLOYEE_LIST);
    }
  }, [mode, employeeId, router]);

  // 5. Map ID sang Tên hiển thị (Department Name & Certification Name)
  const departmentName =
    departments.find((d) => String(d.departmentId) === String(formData?.departmentId))
      ?.departmentName || '';

  const certificationName =
    certifications.find(
      (c) => String(c.certificationId) === String(formData?.certificationId)
    )?.certificationName || '';

  /**
   * 6. Xử lý khi người dùng nhấn nút "OK":
   * Thực hiện gọi API tương ứng theo từng mode (Thêm mới / Chỉnh sửa / Xóa).
   */
  const handleOk = useCallback(async () => {
    if (!formData || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // 6.1 Xử lý khi xác nhận XÓA nhân viên (mode = delete)
      if (mode === 'delete' && employeeId) {
        // 6.1.1 Gọi API xóa nhân viên theo ID
        const deleteResponse = await deleteEmployee(employeeId);
        // 6.1.2 Khi xóa thành công: Điều hướng sang màn hình hoàn thành ADM006 kèm mode=delete
        if (deleteResponse && deleteResponse.code === HTTP_STATUS.OK) {
          router.push(`${ROUTES.EMPLOYEE_COMPLETE}?mode=delete`);
        }
        return;
      }

      // 6.2 Xử lý khi xác nhận CHỈNH SỬA thông tin nhân viên (mode = edit)
      if (mode === 'edit' && employeeId) {
        // 6.2.1 Chuẩn bị payload cập nhật nhân viên
        const payload = {
          ...buildBaseEmployeePayload(formData),
          employeeId: Number(employeeId),
          employeeLoginPassword: formData.employeeLoginPassword || undefined,
        };

        // 6.2.2 Gọi API cập nhật thông tin nhân viên
        const response = await updateEmployee(employeeId, payload);

        // 6.2.3 Xóa dữ liệu tạm trong sessionStorage và điều hướng sang màn hình hoàn thành ADM006
        if (response && response.code === HTTP_STATUS.OK) {
          sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
          router.push(`${ROUTES.EMPLOYEE_COMPLETE}?mode=edit`);
        }
        return;
      }

      // 6.3 Xử lý khi xác nhận THÊM MỚI nhân viên (mode = add)
      // 6.3.1 Chuẩn bị payload thêm mới nhân viên
      const payload = {
        ...buildBaseEmployeePayload(formData),
        employeeLoginId: formData.employeeLoginId,
        employeeLoginPassword: formData.employeeLoginPassword,
      };

      // 6.3.2 Gọi API thêm mới nhân viên vào hệ thống
      const response = await createEmployee(payload);

      // 6.3.3 Xóa dữ liệu tạm trong sessionStorage và điều hướng sang màn hình hoàn thành ADM006
      if (response && response.code === HTTP_STATUS.OK) {
        sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
        router.push(`${ROUTES.EMPLOYEE_COMPLETE}?mode=add`);
      }
    } catch (error) {
      // 6.4 Xử lý ngoại lệ khi gọi API (trích xuất mã lỗi Parametric Error hoặc chuỗi thông báo)
      const msg = extractApiErrorMessage(error);

      // 6.4.1 Nếu là Mode Add hoặc Edit: Lưu thông báo lỗi vào sessionStorage và điều hướng về ADM004 (mode=back)
      if (mode === 'add' || mode === 'edit') {
        sessionStorage.setItem(STORAGE_KEYS.ADM004_ERROR_MESSAGE, msg);
        const backUrl =
          mode === 'edit' && employeeId
            ? `${ROUTES.EMPLOYEE_EDIT}?mode=back&id=${employeeId}`
            : `${ROUTES.EMPLOYEE_EDIT}?mode=back`;
        router.push(backUrl);
        return;
      }

      // 6.4.2 Nếu là Mode Delete: Hiển thị lỗi hệ thống trực tiếp tại màn hình ADM005
      setIsSystemError(true);
      setErrorMessage(ERROR_MESSAGES.ER015);
    } finally {
      // 6.5 Tắt trạng thái đang gửi yêu cầu khi quá trình kết thúc
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, mode, employeeId, router]);

  /**
   * 7.1 Xử lý khi nhấn nút "OK" trên màn hình System Error:
   * Xóa dữ liệu tạm thời và điều hướng về màn hình trước đó (được lưu trong sessionStorage).
   */
  const handleSystemErrorOk = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
    router.push(getStoredReturnUrl());
  }, [router]);

  /**
   * 7.2 Xử lý khi người dùng nhấn nút "Quay lại" (戻る):
   */
  const handleBack = useCallback(() => {
    // 7.2.1 Nếu đang ở mode delete: Quay lại màn hình chi tiết nhân viên ADM003
    if (mode === 'delete' && employeeId) {
      router.push(`${ROUTES.EMPLOYEE_DETAIL}?id=${employeeId}`);
      return;
    }

    // 7.2.2 Nếu đang ở mode edit: Quay lại màn hình chỉnh sửa ADM004 kèm mode=back và ID nhân viên
    if (mode === 'edit') {
      router.push(
        `${ROUTES.EMPLOYEE_EDIT}?mode=back${employeeId ? `&id=${employeeId}` : ''}`
      );
      return;
    }

    // 7.2.3 Nếu đang ở mode add: Quay lại màn hình thêm mới ADM004 kèm mode=back
    router.push(`${ROUTES.EMPLOYEE_EDIT}?mode=back`);
  }, [mode, employeeId, router]);

  // 8. Trả về state và các hàm xử lý cho component ADM005
  return {
    mode,
    formData,
    departmentName,
    certificationName,
    isLoading:
      isLoadingDept || isLoadingCert || isLoadingDetail || (!isSystemError && !formData),
    isSubmitting,
    isSystemError,
    errorMessage,
    setErrorMessage,
    handleOk,
    handleBack,
    handleSystemErrorOk,
  };
}
