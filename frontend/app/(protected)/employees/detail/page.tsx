/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * page.tsx (EmployeeDetailPage - ADM006), 24/8/2026 nguyenduykhanh2
 */
'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEmployeeDetail } from '@/hooks/useEmployeeDetail';

/**
 * Màn hình xem chi tiết thông tin nhân viên (ADM006).
 *
 * @author nguyenduykhanh2
 * @return Giao diện chi tiết nhân viên
 */
export default function EmployeeDetailPage() {
  useAuth();
  const { employee, loading, errorMessage, handleBack, handleEdit } = useEmployeeDetail();

  return (
    <div className="row">
      <form className="c-form box-shadow" onSubmit={(e) => e.preventDefault()}>
        {/* Khung hiển thị thông báo lỗi */}
        {errorMessage && (
          <div className="box-err" style={{ margin: '16px' }}>
            <div className="box-err-content">{errorMessage}</div>
          </div>
        )}

        {/* Trạng thái đang tải dữ liệu */}
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center' }}>
            Đang tải thông tin nhân viên...
          </div>
        ) : employee ? (
          <ul className="show-data">
            <li className="title">情報確認</li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">アカウント名</label>
              <div className="col-sm col-sm-10">{employee.employeeLoginId}</div>
            </li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">グループ</label>
              <div className="col-sm col-sm-10">{employee.departmentName}</div>
            </li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">氏名</label>
              <div className="col-sm col-sm-10">{employee.employeeName}</div>
            </li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">カタカナ氏名</label>
              <div className="col-sm col-sm-10">{employee.employeeNameKana}</div>
            </li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">生年月日</label>
              <div className="col-sm col-sm-10">
                {employee.employeeBirthDate ? employee.employeeBirthDate.replaceAll('-', '/') : ''}
              </div>
            </li>
            <li className="form-group row d-flex">
              <label className="col-form-label col-sm-2">メールアドレス</label>
              <div className="col-sm col-sm-10">{employee.employeeEmail}</div>
            </li>
            <li className="form-group row d-flex bor-none">
              <label className="col-form-label col-sm-2">電話番号</label>
              <div className="col-sm col-sm-10">{employee.employeeTelephone}</div>
            </li>

            {/* Thông tin chứng chỉ tiếng Nhật (nếu có) */}
            {employee.certifications && employee.certifications.length > 0 && (
              <>
                <li className="title mt-12">
                  <a href="#!">日本語能力</a>
                </li>
                {employee.certifications.map((cert, index) => (
                  <React.Fragment key={cert.certificationId || index}>
                    <li className="form-group row d-flex">
                      <label className="col-form-label col-sm-2">資格</label>
                      <div className="col-sm col-sm-10">{cert.certificationName}</div>
                    </li>
                    <li className="form-group row d-flex">
                      <label className="col-form-label col-sm-2">資格交付日</label>
                      <div className="col-sm col-sm-10">
                        {cert.startDate ? cert.startDate.replaceAll('-', '/') : ''}
                      </div>
                    </li>
                    <li className="form-group row d-flex">
                      <label className="col-form-label col-sm-2">失効日</label>
                      <div className="col-sm col-sm-10">
                        {cert.endDate ? cert.endDate.replaceAll('-', '/') : ''}
                      </div>
                    </li>
                    <li className="form-group row d-flex">
                      <label className="col-form-label col-sm-2">点数</label>
                      <div className="col-sm col-sm-10">
                        {cert.score !== null && cert.score !== undefined ? `${cert.score}点` : ''}
                      </div>
                    </li>
                  </React.Fragment>
                ))}
              </>
            )}

            {/* Nhóm các nút bấm chức năng */}
            <li className="form-group row d-flex">
              <div className="btn-group col-sm col-sm-10 ml">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="btn btn-primary btn-sm"
                >
                  編集
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                >
                  削除
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
        ) : (
          /* Khi có lỗi hoặc không có dữ liệu */
          <div style={{ padding: '20px' }}>
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary btn-sm"
            >
              戻る
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
