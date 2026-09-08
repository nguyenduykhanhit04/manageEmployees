'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdm003 } from '@/hooks/useAdm003';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Component hiển thị nội dung chi tiết của một nhân viên (ADM003).
 *
 * @author nguyenduykhanh2
 * @return Giao diện chi tiết nhân viên
 */
function EmployeeDetailContent() {
  useAuth();

  const {
    employee,
    loading,
    errorMessage,
    isSystemError,
    handleBack,
    handleEdit,
    handleDelete,
  } = useAdm003();

  // 1. Trạng thái đang tải dữ liệu
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        {SYSTEM_MESSAGES.LOADING}
      </div>
    );
  }

  // 2. Trạng thái lỗi hệ thống (Không có id trên URL, ID không tồn tại trong DB, hoặc lỗi API)
  if (isSystemError || errorMessage) {
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

  // Lấy thông tin chứng chỉ tiếng Nhật đầu tiên nếu có
  const cert = employee?.certifications && employee.certifications.length > 0
    ? employee.certifications[0]
    : null;

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">情報確認</li>

          {/* 1. アカウント名 (Tên đăng nhập) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">アカウント名</label>
            <div className="col-sm col-sm-10">{employee?.employeeLoginId}</div>
          </li>

          {/* 2. グループ (Tên phòng ban) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">グループ</label>
            <div className="col-sm col-sm-10">{employee?.departmentName}</div>
          </li>

          {/* 3. 氏名 (Họ tên) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">氏名</label>
            <div className="col-sm col-sm-10">{employee?.employeeName}</div>
          </li>

          {/* 4. カタカナ氏名 (Tên Katakana) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">カタカナ氏名</label>
            <div className="col-sm col-sm-10">{employee?.employeeNameKana || ''}</div>
          </li>

          {/* 5. 生年月日 (Ngày sinh) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">生年月日</label>
            <div className="col-sm col-sm-10">
              {employee?.employeeBirthDate ? employee.employeeBirthDate.replaceAll('-', '/') : ''}
            </div>
          </li>

          {/* 6. メールアドレス (Email) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">メールアドレス</label>
            <div className="col-sm col-sm-10">{employee?.employeeEmail}</div>
          </li>

          {/* 7. 電話番号 (Số điện thoại) */}
          <li className="form-group row d-flex bor-none">
            <label className="col-form-label col-sm-2">電話番号</label>
            <div className="col-sm col-sm-10">{employee?.employeeTelephone || ''}</div>
          </li>

          {/* 8. Khối thông tin chứng chỉ tiếng Nhật (luôn hiển thị, nếu không có thì để trống) */}
          <li className="title mt-12">
            <a href="#!">日本語能力</a>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">資格</label>
            <div className="col-sm col-sm-10">{cert?.certificationName || ''}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">資格交付日</label>
            <div className="col-sm col-sm-10">
              {cert?.startDate ? cert.startDate.replaceAll('-', '/') : ''}
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">失効日</label>
            <div className="col-sm col-sm-10">
              {cert?.endDate ? cert.endDate.replaceAll('-', '/') : ''}
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">点数</label>
            <div className="col-sm col-sm-10">
              {cert?.score !== null && cert?.score !== undefined ? cert.score : ''}
            </div>
          </li>

          {/* 9. Nhóm nút thao tác: 編集 (Chỉnh sửa), 削除 (Xóa), 戻る (Quay lại) */}

          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="button" onClick={handleEdit} className="btn btn-primary btn-sm">
                編集
              </button>
              <button type="button" onClick={handleDelete} className="btn btn-secondary btn-sm">
                削除
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

/**
 * Màn hình Chi tiết nhân viên (ADM003).
 *
 * @author nguyenduykhanh2
 * @return Giao diện trang ADM003
 */
export default function EmployeeDetailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <EmployeeDetailContent />
    </Suspense>
  );
}
