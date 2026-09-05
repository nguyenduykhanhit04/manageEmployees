'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdm005 } from '@/hooks/useAdm005';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Component hiển thị nội dung Form xác nhận thông tin nhân viên (ADM005).
 *
 * @author nguyenduykhanh2
 * @return Giao diện xác nhận thông tin nhân viên
 */
function EmployeeConfirmContent() {
  useAuth();

  const {
    formData,
    departmentName,
    certificationName,
    isLoading,
    errorMessage,
    handleOk,
    handleBack,
  } = useAdm005();

  if (isLoading || !formData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        {SYSTEM_MESSAGES.LOADING}
      </div>
    );
  }

  const isCertSelected = Boolean(
    formData.certificationId &&
      formData.certificationId !== '' &&
      formData.certificationId !== '0'
  );

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">
            <p>情報確認</p>
            <p>入力された情報をＯＫボタンクリックでＤＢへ保存してください</p>
          </li>

          {errorMessage && (
            <li className="box-err">
              <div className="box-err-content">{errorMessage}</div>
            </li>
          )}

          {/* 1. アカウント名 (Tên đăng nhập) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">アカウント名</label>
            <div className="col-sm col-sm-10">{formData.employeeLoginId}</div>
          </li>

          {/* 2. グループ (Phòng ban đã map tên) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">グループ</label>
            <div className="col-sm col-sm-10">{departmentName}</div>
          </li>

          {/* 3. 氏名 (Họ và tên) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">氏名</label>
            <div className="col-sm col-sm-10">{formData.employeeName}</div>
          </li>

          {/* 4. カタカナ氏名 (Tên Katakana) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">カタカナ氏名</label>
            <div className="col-sm col-sm-10">{formData.employeeNameKana}</div>
          </li>

          {/* 5. 生年月日 (Ngày sinh) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">生年月日</label>
            <div className="col-sm col-sm-10">{formData.employeeBirthDate}</div>
          </li>

          {/* 6. メールアドレス (Email) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">メールアドレス</label>
            <div className="col-sm col-sm-10">{formData.employeeEmail}</div>
          </li>

          {/* 7. 電話番号 (Số điện thoại) */}
          <li className="form-group row d-flex bor-none">
            <label className="col-form-label col-sm-2">電話番号</label>
            <div className="col-sm col-sm-10">{formData.employeeTelephone}</div>
          </li>

          {/* Khối thông tin chứng chỉ tiếng Nhật (chỉ hiển thị khi có chọn chứng chỉ) */}
          {isCertSelected && (
            <>
              <li className="title mt-12">
                <a href="#!">日本語能力</a>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">資格</label>
                <div className="col-sm col-sm-10">{certificationName}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">資格交付日</label>
                <div className="col-sm col-sm-10">{formData.certificationStartDate}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">失効日</label>
                <div className="col-sm col-sm-10">{formData.certificationEndDate}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">点数</label>
                <div className="col-sm col-sm-10">{formData.employeeCertificationScore}</div>
              </li>
            </>
          )}

          {/* Nút bấm OK và 戻る */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button
                type="button"
                onClick={handleOk}
                className="btn btn-primary btn-sm"
              >
                OK
              </button>
              <button
                type="button"
                onClick={handleBack}
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

export default function EmployeeConfirmPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <EmployeeConfirmContent />
    </Suspense>
  );
}
