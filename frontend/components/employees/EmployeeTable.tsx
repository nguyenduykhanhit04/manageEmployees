/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * EmployeeTable.tsx, 24/8/2026 nguyenduykhanh2
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { EmployeeItem } from '@/types/employee';
import { SortOrders, SortField } from '@/hooks/useEmployees';
import { Pagination } from '@/components/common/Pagination';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';

export interface EmployeeTableProps {
  employees: EmployeeItem[];
  loading: boolean;
  sortOrders: SortOrders;
  onSort: (field: SortField) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  returnUrl?: string;
}

/**
 * Component bảng danh sách nhân viên hiển thị 9 cột dữ liệu,
 * hỗ trợ sắp xếp các cột và thanh phân trang.
 *
 * @author nguyenduykhanh2
 */
export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  loading,
  sortOrders,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  returnUrl,
}) => {
  // Tạo query string returnTo cho link chuyển trang chi tiết
  const getDetailLink = (employeeId: number) => {
    if (returnUrl) {
      return `/employees/detail?id=${employeeId}&returnTo=${encodeURIComponent(returnUrl)}`;
    }
    return `/employees/detail?id=${employeeId}`;
  };

  return (
    <div className="row row-table">
      <div className="css-grid-table box-shadow">
        {/* Header bảng dữ liệu hỗ trợ click sắp xếp */}
        <div className="css-grid-table-header">
          <div>ID</div>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSort('ord_employee_name')}
            title="氏名で並び替え"
          >
            氏名 {sortOrders.ord_employee_name === 'ASC' ? '▲▽' : '△▼'}
          </div>
          <div>生年月日</div>
          <div>グループ</div>
          <div>メールアドレス</div>
          <div>電話番号</div>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSort('ord_certification_name')}
            title="日本語能力で並び替え"
          >
            日本語能力 {sortOrders.ord_certification_name === 'ASC' ? '▲▽' : '△▼'}
          </div>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSort('ord_end_date')}
            title="失効日で並び替え"
          >
            失効日 {sortOrders.ord_end_date === 'ASC' ? '▲▽' : '△▼'}
          </div>
          <div>点数</div>
        </div>

        {/* Body bảng dữ liệu */}
        <div className="css-grid-table-body">
          {/* Trường hợp đang tải dữ liệu */}
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              {SYSTEM_MESSAGES.LOADING}
            </div>
          ) : /* Trường hợp không tìm thấy bản ghi nào */
          employees.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              {SYSTEM_MESSAGES.MSG005}
            </div>
          ) : (
            /* Render danh sách từng nhân viên */
            employees.map((emp) => (
              <React.Fragment key={emp.employeeId}>
                <div className="bor-l-none text-center">
                  <Link href={getDetailLink(emp.employeeId)}>
                    {emp.employeeId}
                  </Link>
                </div>

                <div>{emp.employeeName}</div>
                <div>{emp.employeeBirthDate ? emp.employeeBirthDate.replaceAll('-', '/') : ''}</div>
                <div>{emp.departmentName || ''}</div>
                <div>{emp.employeeEmail || ''}</div>
                <div>{emp.employeeTelephone || ''}</div>
                <div>{emp.certificationName || ''}</div>
                <div>{emp.endDate ? emp.endDate.replaceAll('-', '/') : ''}</div>
                <div>{emp.score !== null && emp.score !== undefined ? emp.score : ''}</div>
              </React.Fragment>
            ))
          )}
        </div>

        {/* Thanh phân trang */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
