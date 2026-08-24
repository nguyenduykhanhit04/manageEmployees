/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * useEmployeeForm.ts, 23/8/2026 nguyenduykhanh2
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDepartments } from '@/hooks/useDepartments';
import { useCertifications } from '@/hooks/useCertifications';
import { createEmployee, getEmployeeById } from '@/lib/api/employee';
import { getEmployeeFormSchema } from '@/lib/validation/employee';
import { ERROR_MESSAGES, FIELD_LABELS } from '@/lib/constants/messages';
import { AddEmployeePayload, EmployeeFormState } from '@/types/employee';

const FORM_STORAGE_KEY = 'employee_form_data';

const initialFormValues: EmployeeFormState = {
  employeeLoginId: '',
  departmentId: '',
  departmentName: '',
  employeeName: '',
  employeeNameKana: '',
  employeeBirthDate: '',
  employeeEmail: '',
  employeeTelephone: '',
  employeeLoginPassword: '',
  passwordConfirmation: '',
  certificationId: '',
  certificationName: '',
  certificationStartDate: '',
  certificationEndDate: '',
  employeeCertificationScore: '',
};

/**
 * Format thông báo lỗi dựa trên mã lỗi và tên trường.
 *
 * @param errorCode mã lỗi (ER001, ER002, ...)
 * @param fieldName tên trường
 * @param params danh sách tham số bổ sung nếu có
 * @return chuỗi thông báo lỗi đã được format
 */
export function formatErrorMessage(errorCode: string, fieldName: string, params: string[] = []): string {
  const template = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.ER015;
  const label = FIELD_LABELS[fieldName] || fieldName;

  let message = template.replace('{0}', label);
  params.forEach((param, index) => {
    message = message.replace(`{${index + 1}}`, param);
  });

  return message;
}

/**
 * Custom Hook quản lý nghiệp vụ và form nhập liệu của màn hình ADM003, ADM004 (Confirm), ADM005 (Complete).
 *
 * @author nguyenduykhanh2
 * @return các state và action điều khiển form
 */
export function useEmployeeForm() {
  const router = useRouter();
  let searchParams: URLSearchParams | null = null;
  try {
    searchParams = useSearchParams() as unknown as URLSearchParams;
  } catch {
    // SSR / test safe
  }
  const editId = searchParams?.get?.('id');
  const isEditMode = !!editId;

  const { departments, loading: loadingDepartments } = useDepartments();
  const { certifications, loading: loadingCertifications } = useCertifications();

  const [formData, setFormData] = useState<EmployeeFormState>(initialFormValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Tải dữ liệu nhân viên nếu ở chế độ Edit (có param id)
  useEffect(() => {
    if (editId) {
      setLoadingData(true);
      getEmployeeById(editId)
        .then((data) => {
          if (data && data.code === 200) {
            const cert = data.certifications && data.certifications.length > 0 ? data.certifications[0] : null;
            setFormData({
              employeeLoginId: data.employeeLoginId || '',
              departmentId: data.departmentId ? String(data.departmentId) : '',
              departmentName: data.departmentName || '',
              employeeName: data.employeeName || '',
              employeeNameKana: data.employeeNameKana || '',
              employeeBirthDate: data.employeeBirthDate ? data.employeeBirthDate.replaceAll('-', '/') : '',
              employeeEmail: data.employeeEmail || '',
              employeeTelephone: data.employeeTelephone || '',
              employeeLoginPassword: '',
              passwordConfirmation: '',
              certificationId: cert?.certificationId ? String(cert.certificationId) : '',
              certificationName: cert?.certificationName || '',
              certificationStartDate: cert?.startDate ? cert.startDate.replaceAll('-', '/') : '',
              certificationEndDate: cert?.endDate ? cert.endDate.replaceAll('-', '/') : '',
              employeeCertificationScore: cert?.score !== null && cert?.score !== undefined ? String(cert.score) : '',
            });
          }
        })
        .catch((err) => {
          console.error('Error fetching employee for edit:', err);
          setGeneralError('該当するユーザが存在しません。');
        })
        .finally(() => {
          setLoadingData(false);
        });
    } else if (typeof window !== 'undefined') {
      // Tải dữ liệu đã nhập từ sessionStorage (nếu quay lại từ màn hình Confirm)
      const savedData = sessionStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData) as EmployeeFormState;
          setFormData(parsed);
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    }
  }, [editId]);

  /**
   * Thay đổi giá trị từng trường trong form.
   *
   * @param field tên trường cần cập nhật
   * @param value giá trị mới
   */
  const handleFieldChange = (field: keyof EmployeeFormState, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Xóa lỗi của trường đó khi người dùng bắt đầu chỉnh sửa
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /**
   * Xử lý khi nhấn nút Xác nhận (確認) trên màn hình ADM003.
   * Thực hiện validate dữ liệu với Zod Schema và chuyển sang màn hình ADM004 (Confirm).
   */
  const handleConfirm = () => {
    setFormErrors({});
    setGeneralError('');

    const schema = getEmployeeFormSchema(isEditMode);
    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = validationResult.error.issues || [];
      const firstError = issues[0];

      issues.forEach((err) => {
        const fieldKey = err.path[0] as string;
        if (fieldKey && !fieldErrors[fieldKey]) {
          const msg = formatErrorMessage(err.message, fieldKey);
          fieldErrors[fieldKey] = msg;
        }
      });

      setFormErrors(fieldErrors);
      if (firstError) {
        setGeneralError(formatErrorMessage(firstError.message, firstError.path[0] as string));
      }
      return;
    }

    // Tìm tên Department và Certification tương ứng để hiển thị trên màn hình Confirm
    const selectedDept = departments.find((d) => String(d.departmentId) === String(formData.departmentId));
    const selectedCert = certifications.find((c) => String(c.certificationId) === String(formData.certificationId));

    const enrichedData: EmployeeFormState = {
      ...formData,
      departmentName: selectedDept ? selectedDept.departmentName : '',
      certificationName: selectedCert ? selectedCert.certificationName : '',
    };

    // Lưu vào sessionStorage và điều hướng sang ADM004
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(enrichedData));
    router.push('/employees/confirm');
  };

  /**
   * Xử lý khi nhấn nút OK trên màn hình ADM004 (Confirm) để lưu dữ liệu vào Database.
   */
  const handleSave = async () => {
    setSubmitting(true);
    setGeneralError('');

    try {
      const payload: AddEmployeePayload = {
        employeeLoginId: formData.employeeLoginId.trim(),
        departmentId: Number(formData.departmentId),
        employeeName: formData.employeeName.trim(),
        employeeNameKana: formData.employeeNameKana.trim(),
        employeeBirthDate: formData.employeeBirthDate.trim(),
        employeeEmail: formData.employeeEmail.trim(),
        employeeTelephone: formData.employeeTelephone.trim(),
        employeeLoginPassword: formData.employeeLoginPassword,
      };

      if (formData.certificationId && String(formData.certificationId).trim() !== '') {
        payload.certifications = [
          {
            certificationId: Number(formData.certificationId),
            startDate: formData.certificationStartDate || '',
            endDate: formData.certificationEndDate || '',
            score: Number(formData.employeeCertificationScore || 0),
          },
        ];
      }

      const res = await createEmployee(payload);

      if (res && res.code === 200) {
        sessionStorage.removeItem(FORM_STORAGE_KEY);
        router.push('/employees/complete');
      } else {
        const errCode = res?.message?.code || 'ER015';
        setGeneralError(ERROR_MESSAGES[errCode] || ERROR_MESSAGES.ER015);
      }
    } catch (err: unknown) {
      console.error('Error creating employee:', err);
      // Xử lý lỗi trả về từ Backend (BusinessException)
      interface AxiosErrorResponse {
        response?: {
          data?: {
            message?: {
              code?: string;
              params?: string[];
            };
          };
        };
      }
      const axiosErr = err as AxiosErrorResponse;
      const apiErr = axiosErr?.response?.data?.message;
      if (apiErr && apiErr.code) {
        const formatted = formatErrorMessage(apiErr.code, apiErr.params?.[0] || 'employeeLoginId', apiErr.params?.slice(1));
        setGeneralError(formatted);
      } else {
        setGeneralError(ERROR_MESSAGES.ER015);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Quay lại màn hình trước đó.
   *
   * @param targetPath đường dẫn đích (mặc định quay lại ADM002)
   */
  const handleBack = (targetPath: string = '/employees/adm002') => {
    router.push(targetPath);
  };

  return {
    formData,
    setFormData,
    formErrors,
    generalError,
    setGeneralError,
    departments,
    certifications,
    loading: loadingDepartments || loadingCertifications || loadingData,
    isEditMode,
    editId,
    submitting,
    handleFieldChange,
    handleConfirm,
    handleSave,
    handleBack,
  };
}
