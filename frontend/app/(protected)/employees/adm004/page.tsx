'use client';

import React, { Suspense, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdm004, getTodayString } from '@/hooks/useAdm004';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Component hiển thị nội dung Form thêm mới / chỉnh sửa nhân viên (ADM004).
 */
function EmployeeEditContent() {
  useAuth();

  const {
    form,
    mode,
    departments,
    certifications,
    isLoading,
    isSystemError,
    errorMessage,
    handleConfirm,
    handleBack,
  } = useAdm004();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  // Tham chiếu đến các component DatePicker để hỗ trợ focus khi click icon lịch
  const birthDateRef = useRef<DatePicker>(null);
  const certificationStartDateRef = useRef<DatePicker>(null);
  const certificationEndDateRef = useRef<DatePicker>(null);

  // Chuỗi ngày hiện tại dùng làm placeholder mặc định
  const todayStr = getTodayString();

  // Theo dõi xem người dùng có chọn chứng chỉ không để enable/disable các input chứng chỉ
  const selectedCertId = watch('certificationId');
  const isCertificationSelected = Boolean(
    selectedCertId && selectedCertId !== '' && selectedCertId !== '0'
  );

  /**
   * Chuyển đổi đối tượng Date sang chuỗi định dạng yyyy/MM/dd.
   *
   * @param date đối tượng ngày cần format
   * @return chuỗi định dạng yyyy/MM/dd hoặc rỗng nếu date null
   */
  const formatDateToString = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  /**
   * Parse chuỗi ngày yyyy/MM/dd hoặc ISO sang đối tượng Date cho DatePicker.
   *
   * @param dateStr chuỗi ngày đầu vào
   * @return đối tượng Date hợp lệ hoặc null nếu không thể parse
   */
  const parseStringToDate = (dateStr?: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // 1. Trạng thái đang tải dữ liệu
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        {SYSTEM_MESSAGES.LOADING}
      </div>
    );
  }

  // 2. Trạng thái lỗi hệ thống
  if (isSystemError) {
    return (
      <div className="box-shadow">
        <div className="notification-box">
          <h1 className="msg-title">システムエラーが発生しました。</h1>
          <div className="notification-box-btn">
            <button type="button" onClick={handleBack} className="btn btn-primary btn-sm">
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <form className="c-form box-shadow" onSubmit={handleConfirm}>
        <ul>
          <li className="title">{mode === 'edit' ? '会員情報編集' : '会員情報追加'}</li>

          {errorMessage && (
            <li className="box-err">
              <div className="box-err-content">{errorMessage}</div>
            </li>
          )}

          {/* 1. アカウント名 (Tên đăng nhập) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                アカウント名:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeLoginId ? 'is-invalid' : ''}`}
                {...register('employeeLoginId')}
              />
              {errors.employeeLoginId && (
                <div className="invalid-feedback d-block">{errors.employeeLoginId.message}</div>
              )}
            </div>
          </li>

          {/* 2. グループ (Phòng ban) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                グループ:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <select
                className={`form-control ${errors.departmentId ? 'is-invalid' : ''}`}
                {...register('departmentId')}
              >
                <option value="">選択してください</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={String(dept.departmentId)}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <div className="invalid-feedback d-block">{errors.departmentId.message}</div>
              )}
            </div>
          </li>

          {/* 3. 氏名 (Họ tên) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                氏名:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
                {...register('employeeName')}
              />
              {errors.employeeName && (
                <div className="invalid-feedback d-block">{errors.employeeName.message}</div>
              )}
            </div>
          </li>

          {/* 4. カタカナ氏名 (Họ tên Katakana) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                カタカナ氏名:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeNameKana ? 'is-invalid' : ''}`}
                {...register('employeeNameKana')}
              />
              {errors.employeeNameKana && (
                <div className="invalid-feedback d-block">{errors.employeeNameKana.message}</div>
              )}
            </div>
          </li>

          {/* 5. 生年月日 (Ngày sinh) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                生年月日:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <Controller
                  control={control}
                  name="employeeBirthDate"
                  render={({ field }) => (
                    <DatePicker
                      ref={birthDateRef}
                      placeholderText={todayStr}
                      selected={parseStringToDate(field.value)}
                      onChange={(date: Date | null) => field.onChange(formatDateToString(date))}
                      dateFormat="yyyy/MM/dd"
                      onKeyDown={(e) => e.preventDefault()}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      scrollableYearDropdown
                      yearDropdownItemNumber={70}
                      maxDate={new Date()}
                      className={`form-control ${errors.employeeBirthDate ? 'is-invalid' : ''}`}
                    />
                  )}
                />
                <span
                  className="glyphicon glyphicon-calendar"
                  onClick={() => birthDateRef.current?.setFocus()}
                ></span>
              </div>
              {errors.employeeBirthDate && (
                <div className="invalid-feedback d-block">{errors.employeeBirthDate.message}</div>
              )}
            </div>
          </li>

          {/* 6. メールアドレス (Email) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                メールアドレス:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeEmail ? 'is-invalid' : ''}`}
                {...register('employeeEmail')}
              />
              {errors.employeeEmail && (
                <div className="invalid-feedback d-block">{errors.employeeEmail.message}</div>
              )}
            </div>
          </li>

          {/* 7. 電話番号 (Số điện thoại) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                電話番号:<span className="note-red">*</span>
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeTelephone ? 'is-invalid' : ''}`}
                {...register('employeeTelephone')}
              />
              {errors.employeeTelephone && (
                <div className="invalid-feedback d-block">{errors.employeeTelephone.message}</div>
              )}
            </div>
          </li>

          {/* 8. パスワード (Mật khẩu) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                パスワード:{mode === 'add' && <span className="note-red">*</span>}
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="password"
                className={`form-control ${errors.employeeLoginPassword ? 'is-invalid' : ''}`}
                {...register('employeeLoginPassword')}
              />
              {errors.employeeLoginPassword && (
                <div className="invalid-feedback d-block">{errors.employeeLoginPassword.message}</div>
              )}
            </div>
          </li>

          {/* 9. パスワード（確認）(Xác nhận mật khẩu) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                パスワード（確認）:{mode === 'add' && <span className="note-red">*</span>}
              </i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="password"
                className={`form-control ${errors.employeeLoginPasswordConfirm ? 'is-invalid' : ''}`}
                {...register('employeeLoginPasswordConfirm')}
              />
              {errors.employeeLoginPasswordConfirm && (
                <div className="invalid-feedback d-block">{errors.employeeLoginPasswordConfirm.message}</div>
              )}
            </div>
          </li>

          {/* Section: 日本語能力 (Trình độ tiếng Nhật) */}
          <li className="title mt-12">
            <a href="#!">日本語能力</a>
          </li>

          {/* 10. 資格 (Chứng chỉ) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">資格:</i>
            </label>
            <div className="col-sm col-sm-10">
              <select className="form-control" {...register('certificationId')}>
                <option value="">選択してください</option>
                {certifications.map((cert) => (
                  <option key={cert.certificationId} value={String(cert.certificationId)}>
                    {cert.certificationName}
                  </option>
                ))}
              </select>
            </div>
          </li>

          {/* 11. 資格交付日 (Ngày cấp) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                資格交付日:{isCertificationSelected && <span className="note-red">*</span>}
              </i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <Controller
                  control={control}
                  name="certificationStartDate"
                  render={({ field }) => (
                    <DatePicker
                      ref={certificationStartDateRef}
                      placeholderText={todayStr}
                      selected={parseStringToDate(field.value)}
                      onChange={(date: Date | null) => field.onChange(formatDateToString(date))}
                      dateFormat="yyyy/MM/dd"
                      disabled={!isCertificationSelected}
                      onKeyDown={(e) => e.preventDefault()}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      scrollableYearDropdown
                      yearDropdownItemNumber={30}
                      className="form-control"
                    />
                  )}
                />
                <span
                  className="glyphicon glyphicon-calendar"
                  onClick={() => {
                    if (isCertificationSelected) {
                      certificationStartDateRef.current?.setFocus();
                    }
                  }}
                ></span>
              </div>
              {errors.certificationStartDate && (
                <div className="invalid-feedback d-block">{errors.certificationStartDate.message}</div>
              )}
            </div>
          </li>

          {/* 12. 失効日 (Ngày hết hạn) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">
                失効日:{isCertificationSelected && <span className="note-red">*</span>}
              </i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <Controller
                  control={control}
                  name="certificationEndDate"
                  render={({ field }) => (
                    <DatePicker
                      ref={certificationEndDateRef}
                      placeholderText={todayStr}
                      selected={parseStringToDate(field.value)}
                      onChange={(date: Date | null) => field.onChange(formatDateToString(date))}
                      dateFormat="yyyy/MM/dd"
                      disabled={!isCertificationSelected}
                      onKeyDown={(e) => e.preventDefault()}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      scrollableYearDropdown
                      yearDropdownItemNumber={30}
                      className={`form-control ${errors.certificationEndDate ? 'is-invalid' : ''}`}
                    />
                  )}
                />
                <span
                  className="glyphicon glyphicon-calendar"
                  onClick={() => {
                    if (isCertificationSelected) {
                      certificationEndDateRef.current?.setFocus();
                    }
                  }}
                ></span>
              </div>
              {errors.certificationEndDate && (
                <div className="invalid-feedback d-block">{errors.certificationEndDate.message}</div>
              )}
            </div>
          </li>

          {/* 13. 点数 (Điểm số) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">点数:</i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeCertificationScore ? 'is-invalid' : ''}`}
                disabled={!isCertificationSelected}
                {...register('employeeCertificationScore')}
              />
              {errors.employeeCertificationScore && (
                <div className="invalid-feedback d-block">
                  {errors.employeeCertificationScore.message}
                </div>
              )}
            </div>
          </li>

          {/* Nút bấm 確認 và 戻る */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="submit" className="btn btn-primary btn-sm">
                確認
              </button>
              <button type="button" onClick={handleBack} className="btn btn-secondary btn-sm">
                戻る
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default function EmployeeEditPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <EmployeeEditContent />
    </Suspense>
  );
}
