import { EmployeeDetailResponse } from '@/types/employee';
import { EmployeeFormData } from '@/lib/validation/employee';

/**
 * Map dữ liệu chi tiết nhân viên từ API response sang object EmployeeFormData để hiển thị trên form.
 * Xử lý: chuyển đổi ngày yyyy-MM-dd → yyyy/MM/dd, ép kiểu số → chuỗi, lấy chứng chỉ đầu tiên.
 *
 * @param emp dữ liệu chi tiết nhân viên trả về từ API
 * @return object EmployeeFormData phù hợp để reset form hoặc hiển thị trên màn hình xác nhận
 */
export function mapEmployeeDetailToFormData(emp: EmployeeDetailResponse): EmployeeFormData {
  // Lấy chứng chỉ tiếng Nhật đầu tiên (nếu có)
  const cert = emp.certifications && emp.certifications.length > 0
    ? emp.certifications[0]
    : null;

  return {
    employeeLoginId: emp.employeeLoginId || '',
    departmentId: String(emp.departmentId || ''),
    employeeName: emp.employeeName || '',
    employeeNameKana: emp.employeeNameKana || '',
    employeeBirthDate: emp.employeeBirthDate
      ? emp.employeeBirthDate.replaceAll('-', '/')
      : '',
    employeeEmail: emp.employeeEmail || '',
    employeeTelephone: emp.employeeTelephone || '',
    employeeLoginPassword: '',
    employeeLoginPasswordConfirm: '',
    certificationId: cert ? String(cert.certificationId) : '',
    certificationStartDate: cert?.startDate
      ? cert.startDate.replaceAll('-', '/')
      : '',
    certificationEndDate: cert?.endDate
      ? cert.endDate.replaceAll('-', '/')
      : '',
    employeeCertificationScore:
      cert?.score !== null && cert?.score !== undefined
        ? String(cert.score)
        : '',
  };
}

/**
 * Xây dựng phần payload chứng chỉ tiếng Nhật dùng chung cho cả mode add và edit.
 * Chuyển đổi định dạng ngày yyyy/MM/dd → yyyy-MM-dd, ép kiểu chuỗi → số.
 *
 * @param formData dữ liệu form nhân viên
 * @return object payload chứng chỉ phù hợp với Backend API
 */
export function buildCertPayload(formData: EmployeeFormData) {
  const hasCert =
    formData.certificationId &&
    formData.certificationId !== '' &&
    formData.certificationId !== '0';

  return {
    certificationId: hasCert ? Number(formData.certificationId) : null,
    certificationStartDate:
      formData.certificationStartDate && formData.certificationStartDate.trim() !== ''
        ? formData.certificationStartDate.replaceAll('/', '-')
        : null,
    certificationEndDate:
      formData.certificationEndDate && formData.certificationEndDate.trim() !== ''
        ? formData.certificationEndDate.replaceAll('/', '-')
        : null,
    employeeCertificationScore:
      formData.employeeCertificationScore && formData.employeeCertificationScore !== ''
        ? Number(formData.employeeCertificationScore)
        : null,
  };
}

/**
 * Xây dựng payload thông tin cơ bản nhân viên (dùng chung cho cả thêm mới và cập nhật).
 *
 * @param formData dữ liệu form nhân viên
 * @return object payload cơ bản gồm các thông tin chung và chứng chỉ
 */
export function buildBaseEmployeePayload(formData: EmployeeFormData) {
  return {
    departmentId: Number(formData.departmentId),
    employeeName: formData.employeeName,
    employeeNameKana: formData.employeeNameKana,
    employeeBirthDate: formData.employeeBirthDate.replaceAll('/', '-'),
    employeeEmail: formData.employeeEmail,
    employeeTelephone: formData.employeeTelephone,
    ...buildCertPayload(formData),
  };
}

