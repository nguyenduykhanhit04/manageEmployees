'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdm002 } from '@/hooks/useAdm002';
import { EmployeeSearchForm } from '@/components/employees/EmployeeSearchForm';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

/**
 * Component nội dung màn hình danh sách nhân viên (ADM002).
 *
 * @author nguyenduykhanh2
 * @return Giao diện danh sách nhân viên
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
  } = useAdm002();

  return (
    <>
      {/* 1. Khung thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="box-err" style={{ marginBottom: '16px' }}>
          <div className="box-err-content">{errorMessage}</div>
        </div>
      )}

      {/* 2. Form tìm kiếm thông tin nhân viên & Nút 新規追加 */}
      <EmployeeSearchForm
        employeeName={employeeName}
        onEmployeeNameChange={setEmployeeName}
        departmentId={departmentId}
        onDepartmentIdChange={setDepartmentId}
        departments={departments}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
      />

      {/* 3. Bảng danh sách nhân viên và thanh phân trang */}
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
 * Màn hình danh sách nhân viên (ADM002).
 *
 * @author nguyenduykhanh2
 * @return Giao diện trang ADM002
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
