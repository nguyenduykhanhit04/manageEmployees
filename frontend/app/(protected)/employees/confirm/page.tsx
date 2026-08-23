/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * page.tsx (EmployeeConfirmPage - ADM004), 23/8/2026 nguyenduykhanh2
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEmployeeForm } from '@/hooks/useEmployeeForm';

/**
 * Màn hình Xác nhận thông tin nhân viên (ADM004).
 *
 * @author nguyenduykhanh2
 * @return Giao diện xác nhận thông tin nhân viên
 */
export default function EmployeeConfirmPage() {
  useAuth();
  const router = useRouter();

  const {
    formData,
    generalError,
    submitting,
    handleSave,
  } = useEmployeeForm();

  return (
    <div className="row">
      <form
        className="c-form box-shadow"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <ul className="show-data">
          <li className="title">
            <p>情報確認</p>
            <p>入力された情報をＯＫボタンクリックでＤＢへ保存してください</p>
          </li>

          {/* Hiển thị lỗi nếu có lỗi từ Backend */}
          {generalError && (
            <li className="box-err" style={{ marginBottom: '16px' }}>
              <div className="box-err-content">{generalError}</div>
            </li>
          )}

          {/* 1. Tên tài khoản */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">アカウント名</label>
            <div className="col-sm col-sm-10">{formData.employeeLoginId || '-'}</div>
          </li>

          {/* 2. Nhóm / Phòng ban */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">グループ</label>
            <div className="col-sm col-sm-10">{formData.departmentName || '-'}</div>
          </li>

          {/* 3. Họ và tên */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">氏名</label>
            <div className="col-sm col-sm-10">{formData.employeeName || '-'}</div>
          </li>

          {/* 4. Tên Katakana */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">カタカナ氏名</label>
            <div className="col-sm col-sm-10">{formData.employeeNameKana || '-'}</div>
          </li>

          {/* 5. Ngày sinh */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">生年月日</label>
            <div className="col-sm col-sm-10">{formData.employeeBirthDate || '-'}</div>
          </li>

          {/* 6. Email */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">メールアドレス</label>
            <div className="col-sm col-sm-10">{formData.employeeEmail || '-'}</div>
          </li>

          {/* 7. Số điện thoại */}
          <li className="form-group row d-flex bor-none">
            <label className="col-form-label col-sm-2">電話番号</label>
            <div className="col-sm col-sm-10">{formData.employeeTelephone || '-'}</div>
          </li>

          {/* Section: Trình độ tiếng Nhật (chỉ hiển thị nếu có chọn chứng chỉ) */}
          {formData.certificationId && String(formData.certificationId).trim() !== '' && (
            <>
              <li className="title mt-12">
                <a href="#!">日本語能力</a>
              </li>

              {/* 8. Chứng chỉ */}
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">資格</label>
                <div className="col-sm col-sm-10">{formData.certificationName || '-'}</div>
              </li>

              {/* 9. Ngày cấp */}
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">資格交付日</label>
                <div className="col-sm col-sm-10">{formData.certificationStartDate || '-'}</div>
              </li>

              {/* 10. Ngày hết hạn */}
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">失効日</label>
                <div className="col-sm col-sm-10">{formData.certificationEndDate || '-'}</div>
              </li>

              {/* 11. Điểm */}
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">点数</label>
                <div className="col-sm col-sm-10">{formData.employeeCertificationScore || '-'}</div>
              </li>
            </>
          )}

          {/* Nút OK và Nút 戻る */}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-sm"
              >
                {submitting ? '保存中...' : 'OK'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/employees/edit')}
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
