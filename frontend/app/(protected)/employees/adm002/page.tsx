/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * page.tsx (ADM002), 25/8/2026 nguyenduykhanh2
 */
'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Component nội dung chính của màn hình danh sách nhân viên (ADM002).
 *
 * @author nguyenduykhanh2
 * @return Giao diện nội dung danh sách nhân viên
 */
function EmployeeListContent() {
  useAuth();

  const {
    employees,
    departments,
    loading,
    errorMessage,
    employeeName,
    setEmployeeName,
    departmentId,
    setDepartmentId,
    sortOrders,
    currentPage,
    totalPages,
    currentReturnUrl,
    handleSearch,
    handleSort,
    handlePageChange,
    handleAddNew,
  } = useEmployees();

  return (
    <>
      {/* Khung thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="box-err" style={{ marginBottom: '16px' }}>
          <div className="box-err-content">{errorMessage}</div>
        </div>
      )}

      {/* Form tìm kiếm thông tin nhân viên */}
      <div className="search-memb">
        <h1 className="title">会員名称で会員を検索します。検索条件無しの場合は全て表示されます。</h1>
        <form className="c-form" onSubmit={handleSearch}>
          <ul className="d-flex">
            {/* Trường tìm kiếm: Tên nhân viên */}
            <li className="form-group row">
              <label className="col-form-label">氏名:</label>
              <div className="col-sm">
                <input
                  type="text"
                  maxLength={125}
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
            </li>

            {/* Trường tìm kiếm: Phòng ban */}
            <li className="form-group row">
              <label className="col-form-label">グループ:</label>
              <div className="col-sm">
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                >
                  <option value="">全て</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>
            </li>

            {/* Nhóm nút bấm: Tìm kiếm và Thêm mới */}
            <li className="form-group row">
              <div className="btn-group">
                <button type="submit" className="btn btn-primary btn-sm">
                  検索
                </button>
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="btn btn-secondary btn-sm"
                >
                  新規追加
                </button>
              </div>
            </li>
          </ul>
        </form>
      </div>

      {/* Bảng danh sách nhân viên và thanh phân trang */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        sortOrders={sortOrders}
        onSort={handleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        returnUrl={currentReturnUrl}
      />
    </>
  );
}

/**
 * Component màn hình danh sách nhân viên (ADM002) được bọc Suspense boundary
 * theo đúng quy chuẩn Next.js App Router khi sử dụng useSearchParams.
 *
 * @author nguyenduykhanh2
 * @return Giao diện màn hình ADM002
 */
export default function EmployeeListPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {SYSTEM_MESSAGES.LOADING}
        </div>
      }
    >
      <EmployeeListContent />
    </Suspense>
  );
}
