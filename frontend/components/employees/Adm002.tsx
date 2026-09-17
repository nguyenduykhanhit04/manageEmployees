'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdm002 } from '@/hooks/useAdm002';
import { EmployeeSearchForm } from '@/components/employees/EmployeeSearchForm';
import { EmployeeTable } from '@/components/employees/EmployeeTable';

/**
 * Component nội dung màn hình danh sách nhân viên (ADM002).
 */
export function Adm002() {
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
      />
    </>
  );
}

export default Adm002;
