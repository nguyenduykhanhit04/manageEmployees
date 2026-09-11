'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addEmployeeSchema,
  editEmployeeSchema,
  AddEmployeeFormData,
} from '@/lib/validation/employee';
import { useDepartments } from '@/hooks/useDepartments';
import { useCertifications } from '@/hooks/useCertifications';
import { getEmployee, checkEmployeeExist } from '@/lib/api/employee.api';
import { ROUTES } from '@/lib/constants';
import { ERROR_MESSAGES } from '@/lib/constants/messages';

export const ADM004_STORAGE_KEY = 'ADM004_TEMP_DATA';

/**
 * Lấy chuỗi ngày hiện tại theo định dạng yyyy/MM/dd (dùng cho placeholder).
 */
export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const getDefaultFormValues = (): AddEmployeeFormData => ({
  employeeLoginId: '',
  departmentId: '',
  employeeName: '',
  employeeNameKana: '',
  employeeBirthDate: '', // Giá trị rỗng ban đầu để hiển thị placeholder ngày hiện tại
  employeeEmail: '',
  employeeTelephone: '',
  employeeLoginPassword: '',
  employeeLoginPasswordConfirm: '',
  certificationId: '',
  certificationStartDate: '',
  certificationEndDate: '',
  employeeCertificationScore: '',
});

/**
 * Custom Hook quản lý toàn bộ nghiệp vụ cho màn hình Thêm mới/Chỉnh sửa nhân viên (ADM004).
 *
 * @author nguyenduykhanh2
 * @return Các state, đối tượng form React Hook Form và các hàm handler phục vụ cho ADM004
 */
export function useAdm004() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Lấy mode, employeeId và returnTo trực tiếp từ URL
  const mode = searchParams.get('mode') || 'add';
  const employeeId = searchParams.get('id');
  const returnTo = searchParams.get('returnTo') || ROUTES.EMPLOYEE_LIST;

  // Có employeeId hoặc mode=edit -> là mode Chỉnh sửa
  const isEditMode = mode === 'edit' || Boolean(employeeId);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSystemError, setIsSystemError] = useState<boolean>(false);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState<boolean>(false);

  // 2. Master Data phòng ban và chứng chỉ tiếng Nhật
  const { departments, isLoading: isLoadingDept } = useDepartments();
  const { certifications, isLoading: isLoadingCert } = useCertifications();

  // 3. Khởi tạo form với Schema tương ứng theo mode (edit: không bắt buộc pass, add: bắt buộc pass)
  const currentSchema = isEditMode ? editEmployeeSchema : addEmployeeSchema;
  const form = useForm<AddEmployeeFormData>({
    resolver: zodResolver(currentSchema) as any,
    defaultValues: getDefaultFormValues(),
    mode: 'onChange',
  });

  const { reset, handleSubmit, watch, setValue, clearErrors } = form;

  // Theo dõi trạng thái chọn chứng chỉ tiếng Nhật
  const selectedCertId = watch('certificationId');
  const isCertificationSelected = Boolean(
    selectedCertId && selectedCertId !== '' && selectedCertId !== '0'
  );

  // Tự động clear dữ liệu & lỗi của 3 trường chứng chỉ khi người dùng chọn "Không có chứng chỉ"
  useEffect(() => {
    if (!isCertificationSelected) {
      setValue('certificationStartDate', '');
      setValue('certificationEndDate', '');
      setValue('employeeCertificationScore', '');
      clearErrors([
        'certificationStartDate',
        'certificationEndDate',
        'employeeCertificationScore',
      ]);
    }
  }, [isCertificationSelected, setValue, clearErrors]);

  // 4. Xử lý khởi tạo dữ liệu form theo từng Mode (add, edit, back)
  useEffect(() => {
    let isMounted = true;

    const initFormData = async () => {
      // 4.1. Trường hợp quay lại từ màn hình Xác nhận ADM005 (mode=back)
      if (mode === 'back') {
        const savedData = sessionStorage.getItem(ADM004_STORAGE_KEY);
        // Nếu có dữ liệu tạm trong sessionStorage thì khôi phục lại lên form
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            reset(parsed);
          } catch (error) {
            // Ghi log lỗi nếu chuỗi JSON không đúng định dạng và giữ nguyên dữ liệu mặc định
            console.error('Lỗi khi parse dữ liệu từ sessionStorage:', error);
          }
        }
      }
      // 4.2. Trường hợp Chỉnh sửa thông tin nhân viên (mode=edit hoặc có employeeId)
      else if (isEditMode) {
        // Kiểm tra tính hợp lệ của tham số employeeId
        if (!employeeId) {
          setIsSystemError(true);
          setErrorMessage(ERROR_MESSAGES.ER015);
          return;
        }

        // Bắt đầu gọi API: Bật cờ loading và reset thông báo lỗi
        setIsLoadingEmployee(true);
        setIsSystemError(false);
        setErrorMessage('');

        try {
          // Gọi API lấy chi tiết thông tin nhân viên theo employeeId
          const data = await getEmployee(employeeId);

          // Kiểm tra kết quả phản hồi thành công (HTTP status 200) và component còn mount
          if (data && data.code === 200 && isMounted) {
            // Lấy thông tin chứng chỉ tiếng Nhật đầu tiên nếu nhân viên có sở hữu
            const cert =
              data.certifications && data.certifications.length > 0
                ? data.certifications[0]
                : null;

            // Hàm tiện ích format chuỗi ngày từ YYYY-MM-DD sang YYYY/MM/DD để hiển thị
            const formatDate = (dateStr?: string | null): string => {
              if (!dateStr) return '';
              return dateStr.replaceAll('-', '/');
            };

            // Ánh xạ dữ liệu trả về từ API sang cấu trúc Form dữ liệu React Hook Form
            const editFormData: AddEmployeeFormData = {
              employeeLoginId: data.employeeLoginId || '',
              departmentId: data.departmentId ? String(data.departmentId) : '',
              employeeName: data.employeeName || '',
              employeeNameKana: data.employeeNameKana || '',
              employeeBirthDate: formatDate(data.employeeBirthDate),
              employeeEmail: data.employeeEmail || '',
              employeeTelephone: data.employeeTelephone || '',
              employeeLoginPassword: '', // Mật khẩu không trả về từ API và không bắt buộc nhập khi edit
              employeeLoginPasswordConfirm: '',
              certificationId: cert?.certificationId ? String(cert.certificationId) : '',
              certificationStartDate: formatDate(cert?.startDate),
              certificationEndDate: formatDate(cert?.endDate),
              employeeCertificationScore:
                cert?.score !== null && cert?.score !== undefined ? String(cert.score) : '',
            };

            // Điền toàn bộ dữ liệu đã ánh xạ vào form
            reset(editFormData);
          } else if (isMounted) {
            // Trường hợp API trả về mã lỗi hoặc dữ liệu không hợp lệ
            setIsSystemError(true);
            setErrorMessage(ERROR_MESSAGES.ER015);
          }
        } catch (error: any) {
          // Xử lý ngoại lệ khi gọi API (lỗi mạng, server error 500, không tìm thấy...)
          if (isMounted) {
            setIsSystemError(true);
            setErrorMessage(ERROR_MESSAGES.ER015);
          }
        } finally {
          // Tắt trạng thái loading khi quá trình tải kết thúc
          if (isMounted) {
            setIsLoadingEmployee(false);
          }
        }
      }
      // 4.3. Trường hợp Thêm mới nhân viên (mode=add hoặc mặc định)
      else {
        // Reset form về các giá trị rỗng mặc định
        reset(getDefaultFormValues());
      }
    };

    initFormData();

    // Cleanup function để tránh memory leak khi component unmount
    return () => {
      isMounted = false;
    };
  }, [mode, isEditMode, employeeId, reset]);

  // 5. Xử lý khi nhấn nút "Xác nhận" (確認)
  const handleConfirm = handleSubmit(async (data) => {
    setErrorMessage('');
    const effectiveMode = isEditMode ? 'edit' : 'add';

    // 5.1 Nếu là mode Edit: Kiểm tra xem nhân viên có còn tồn tại trong DB không qua API chuyên biệt
    if (isEditMode && employeeId) {
      try {
        const checkRes = await checkEmployeeExist(employeeId);
        if (!checkRes || checkRes.code !== 200) {
          setIsSystemError(true);
          setErrorMessage(ERROR_MESSAGES.ER015);
          return;
        }
      } catch (error: any) {
        // Nếu nhân viên đã bị xóa khỏi DB -> Báo lỗi hệ thống ngay tại ADM004
        setIsSystemError(true);
        setErrorMessage(ERROR_MESSAGES.ER015);
        return;
      }
    }

    // 5.2 Lưu dữ liệu vào sessionStorage
    sessionStorage.setItem(
      ADM004_STORAGE_KEY,
      JSON.stringify({ ...data, mode: effectiveMode, employeeId, returnTo })
    );

    // 5.3 Chuyển hướng sang màn hình Xác nhận (ADM005) kèm đầy đủ mode và id
    const confirmUrl = `${ROUTES.EMPLOYEE_CONFIRM}?mode=${effectiveMode}${
      employeeId ? `&id=${employeeId}` : ''
    }&returnTo=${encodeURIComponent(returnTo)}`;
    router.push(confirmUrl);
  });

  // 6. Xử lý khi nhấn nút "Quay lại" (戻る)
  const handleBack = useCallback(() => {
    sessionStorage.removeItem(ADM004_STORAGE_KEY);
    router.push(returnTo);
  }, [returnTo, router]);

  // 7. Quản lý Focus & Vòng lặp Tab (Focus Trap / Tab Loop)
  const formRef = useRef<HTMLFormElement>(null);
  const isLoading = isLoadingDept || isLoadingCert || isLoadingEmployee;

  /**
   * Tự động focus vào phần tử input đầu tiên khi load xong form
   */
  useEffect(() => {
    if (!isLoading && !isSystemError && formRef.current) {
      const focusableSelector =
        'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])';
      const firstInput = formRef.current.querySelector<HTMLElement>(focusableSelector);
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [isLoading, isSystemError]);

  /**
   * Xử lý di chuyển Focus bằng phím Tab (Focus Trap / Tab Loop)
   * 1. Chỉ các hạng mục input như textbox, pulldown, checkbox, button... nhận focus.
   * 2. Các hạng mục không cho nhập/chọn như text, label, hạng mục disable không nhận focus.
   * 3. Khi ở hạng mục cuối cùng nhấn Tab -> Quay lại hạng mục input đầu tiên.
   * 4. Khi ở hạng mục đầu tiên nhấn Shift+Tab -> Chuyển đến hạng mục cuối cùng.
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Tab' && formRef.current) {
      const focusableSelector =
        'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])';
      const focusableElements = Array.from(
        formRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((el) => el.offsetParent !== null && !el.hasAttribute('disabled'));

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, []);

  return {
    form,
    formRef,
    mode: isEditMode ? 'edit' : 'add',
    employeeId,
    returnTo,
    departments,
    certifications,
    isCertificationSelected,
    isLoading,
    isSystemError,
    errorMessage,
    setErrorMessage,
    handleConfirm,
    handleBack,
    handleKeyDown,
  };
}
