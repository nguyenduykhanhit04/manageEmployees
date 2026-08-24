/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * page.tsx (EmployeeEditPage - ADM003), 23/8/2026 nguyenduykhanh2
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEmployeeForm } from '@/hooks/useEmployeeForm';

/**
 * Format đối tượng Date thành chuỗi yyyy/MM/dd
 */
function formatDateToString(date: Date | null): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

/**
 * Parse chuỗi yyyy/MM/dd thành đối tượng Date
 */
function parseStringToDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
}

/**
 * Màn hình Thêm mới nhân viên (ADM003).
 *
 * @author nguyenduykhanh2
 * @return Giao diện form nhập liệu thông tin nhân viên
 */
export default function EmployeeEditPage() {
  useAuth();

  const {
    formData,
    formErrors,
    generalError,
    departments,
    certifications,
    isEditMode,
    handleFieldChange,
    handleConfirm,
    handleBack,
  } = useEmployeeForm();

  const birthDateRef = useRef<DatePicker>(null);
  const certStartDateRef = useRef<DatePicker>(null);
  const certEndDateRef = useRef<DatePicker>(null);

  const parsedBirthDate = parseStringToDate(formData.employeeBirthDate);
  const parsedStartDate = parseStringToDate(formData.certificationStartDate || '');
  const parsedEndDate = parseStringToDate(formData.certificationEndDate || '');

  return (
    <div className="row">
      <form
        className="c-form box-shadow"
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirm();
        }}
      >
        <ul>
          <li className="title">{isEditMode ? '会員情報編集' : '会員情報入力'}</li>

          {/* Hiển thị lỗi chung */}
          {generalError && (
            <li className="box-err">
              <div className="box-err-content">{generalError}</div>
            </li>
          )}

          {/* 1. Tên tài khoản (employeeLoginId) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                アカウント名:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                disabled={isEditMode}
                className={`form-control ${formErrors.employeeLoginId ? 'is-invalid' : ''}`}
                value={formData.employeeLoginId}
                maxLength={50}
                onChange={(e) => handleFieldChange('employeeLoginId', e.target.value)}
              />
              {formErrors.employeeLoginId && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.employeeLoginId}
                </div>
              )}
            </div>
          </li>

          {/* 2. Nhóm / Phòng ban (departmentId) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                グループ:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <select
                className={`form-control ${formErrors.departmentId ? 'is-invalid' : ''}`}
                value={formData.departmentId}
                onChange={(e) => handleFieldChange('departmentId', e.target.value)}
              >
                <option value="">選択してください</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {formErrors.departmentId && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.departmentId}
                </div>
              )}
            </div>
          </li>

          {/* 3. Họ và tên (employeeName) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                氏名:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${formErrors.employeeName ? 'is-invalid' : ''}`}
                value={formData.employeeName}
                maxLength={125}
                onChange={(e) => handleFieldChange('employeeName', e.target.value)}
              />
              {formErrors.employeeName && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.employeeName}
                </div>
              )}
            </div>
          </li>

          {/* 4. Tên Katakana (employeeNameKana) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                カタカナ氏名:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${formErrors.employeeNameKana ? 'is-invalid' : ''}`}
                value={formData.employeeNameKana}
                maxLength={125}
                onChange={(e) => handleFieldChange('employeeNameKana', e.target.value)}
              />
              {formErrors.employeeNameKana && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.employeeNameKana}
                </div>
              )}
            </div>
          </li>

          {/* 5. Ngày sinh (employeeBirthDate) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                生年月日:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10 d-flex">
              <div className="datepicker-wrapper">
                <DatePicker
                  ref={birthDateRef}
                  placeholderText="yyyy/MM/dd"
                  selected={parsedBirthDate}
                  onChange={(date: Date | null) => handleFieldChange('employeeBirthDate', formatDateToString(date))}
                  dateFormat="yyyy/MM/dd"
                  className={formErrors.employeeBirthDate ? 'is-invalid' : ''}
                />
                <span
                  className="glyphicon glyphicon-calendar"
                  onClick={() => birthDateRef.current?.setFocus()}
                ></span>
              </div>
            </div>
            {formErrors.employeeBirthDate && (
              <div className="col-sm-10 offset-sm-2 invalid-feedback text-danger" style={{ display: 'block' }}>
                {formErrors.employeeBirthDate}
              </div>
            )}
          </li>

          {/* 6. Email (employeeEmail) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                メールアドレス:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${formErrors.employeeEmail ? 'is-invalid' : ''}`}
                value={formData.employeeEmail}
                maxLength={125}
                onChange={(e) => handleFieldChange('employeeEmail', e.target.value)}
              />
              {formErrors.employeeEmail && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.employeeEmail}
                </div>
              )}
            </div>
          </li>

          {/* 7. Số điện thoại (employeeTelephone) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                電話番号:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${formErrors.employeeTelephone ? 'is-invalid' : ''}`}
                value={formData.employeeTelephone}
                maxLength={50}
                onChange={(e) => handleFieldChange('employeeTelephone', e.target.value)}
              />
              {formErrors.employeeTelephone && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.employeeTelephone}
                </div>
              )}
            </div>
          </li>

          {/* 8. Mật khẩu (employeeLoginPassword) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                パスワード:{!isEditMode && <span className="note-red">*</span>}
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="password"
                className={`form-control ${formErrors.employeeLoginPassword ? 'is-invalid' : ''}`}
                value={formData.employeeLoginPassword || ''}
                maxLength={50}
                onChange={(e) => handleFieldChange('employeeLoginPassword', e.target.value)}
              />
              {formErrors.employeeLoginPassword && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.employeeLoginPassword}
                </div>
              )}
            </div>
          </li>

          {/* 9. Xác nhận mật khẩu (passwordConfirmation) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                パスワード（確認）:{!isEditMode && <span className="note-red">*</span>}
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="password"
                className={`form-control ${formErrors.passwordConfirmation ? 'is-invalid' : ''}`}
                value={formData.passwordConfirmation || ''}
                maxLength={50}
                onChange={(e) => handleFieldChange('passwordConfirmation', e.target.value)}
              />
              {formErrors.passwordConfirmation && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.passwordConfirmation}
                </div>
              )}
            </div>
          </li>

          {/* Section: Trình độ tiếng Nhật */}
          <li className="title mt-12">
            <a href="#!">日本語能力</a>
          </li>

          {/* 10. Chứng chỉ tiếng Nhật (certificationId) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">資格:</i>
            </label>
            <div className="col-sm col-sm-10">
              <select
                className={`form-control ${formErrors.certificationId ? 'is-invalid' : ''}`}
                value={formData.certificationId || ''}
                onChange={(e) => handleFieldChange('certificationId', e.target.value)}
              >
                <option value="">選択してください</option>
                {certifications.map((cert) => (
                  <option key={cert.certificationId} value={cert.certificationId}>
                    {cert.certificationName}
                  </option>
                ))}
              </select>
              {formErrors.certificationId && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.certificationId}
                </div>
              )}
            </div>
          </li>

          {/* 11. Ngày cấp chứng chỉ (certificationStartDate) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                資格交付日:{formData.certificationId ? <span className="note-red">*</span> : null}
              </i>
            </label>
            <div className="col-sm col-sm-10 d-flex">
              <div className="datepicker-wrapper">
                <DatePicker
                  ref={certStartDateRef}
                  placeholderText="yyyy/MM/dd"
                  selected={parsedStartDate}
                  onChange={(date: Date | null) =>
                    handleFieldChange('certificationStartDate', formatDateToString(date))
                  }
                  dateFormat="yyyy/MM/dd"
                  className={formErrors.certificationStartDate ? 'is-invalid' : ''}
                />
                <span
                  className="glyphicon glyphicon-calendar"
                  onClick={() => certStartDateRef.current?.setFocus()}
                ></span>
              </div>
            </div>
            {formErrors.certificationStartDate && (
              <div className="col-sm-10 offset-sm-2 invalid-feedback text-danger" style={{ display: 'block' }}>
                {formErrors.certificationStartDate}
              </div>
            )}
          </li>

          {/* 12. Ngày hết hạn chứng chỉ (certificationEndDate) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                失効日:{formData.certificationId ? <span className="note-red">*</span> : null}
              </i>
            </label>
            <div className="col-sm col-sm-10 d-flex">
              <div className="datepicker-wrapper">
                <DatePicker
                  ref={certEndDateRef}
                  placeholderText="yyyy/MM/dd"
                  selected={parsedEndDate}
                  onChange={(date: Date | null) =>
                    handleFieldChange('certificationEndDate', formatDateToString(date))
                  }
                  dateFormat="yyyy/MM/dd"
                  className={formErrors.certificationEndDate ? 'is-invalid' : ''}
                />
                <span
                  className="glyphicon glyphicon-calendar"
                  onClick={() => certEndDateRef.current?.setFocus()}
                ></span>
              </div>
            </div>
            {formErrors.certificationEndDate && (
              <div className="col-sm-10 offset-sm-2 invalid-feedback text-danger" style={{ display: 'block' }}>
                {formErrors.certificationEndDate}
              </div>
            )}
          </li>

          {/* 13. Điểm số (employeeCertificationScore) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                点数:{formData.certificationId ? <span className="note-red">*</span> : null}
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${formErrors.employeeCertificationScore ? 'is-invalid' : ''}`}
                value={formData.employeeCertificationScore || ''}
                maxLength={5}
                onChange={(e) => handleFieldChange('employeeCertificationScore', e.target.value)}
              />
              {formErrors.employeeCertificationScore && (
                <div className="invalid-feedback text-danger" style={{ display: 'block' }}>
                  {formErrors.employeeCertificationScore}
                </div>
              )}
            </div>
          </li>

          {/* Button Group: 確認 (Confirm) & 戻る (Back) */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="submit" className="btn btn-primary btn-sm">
                確認
              </button>
              <button
                type="button"
                onClick={() => handleBack('/employees/adm002')}
                className="btn btn-secondary btn-sm"
              >
                戻る
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
