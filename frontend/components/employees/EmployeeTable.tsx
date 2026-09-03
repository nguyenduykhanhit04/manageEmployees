'use client';

import React from 'react';
import Link from 'next/link';
import { EmployeeItem, SortOrders, SortField } from '@/types/employee';
import { Pagination } from '@/components/common/Pagination';
import {
  SORT_ORDER,
  SORT_ICONS,
  SORT_FIELDS,
  ROUTES,
  QUERY_PARAMS,
} from '@/lib/constants';
import { SYSTEM_MESSAGES } from '@/lib/constants/messages';
import { truncateText } from '@/lib/utils/format';

/**
 * Props truyền vào Component EmployeeTable.
 */
export interface EmployeeTableProps {
  /** Danh sách nhân viên cần hiển thị */
  employees: EmployeeItem[];
  /** Trạng thái đang tải dữ liệu */
  loading: boolean;
  /** Trạng thái chiều sắp xếp của từng cột */
  sortOrders: SortOrders;
  /** Callback xử lý khi click vào tiêu đề cột để sắp xếp */
  onSort: (field: SortField) => void;
  /** Trang hiện tại */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Callback xử lý khi người dùng chọn trang khác */
  onPageChange: (page: number) => void;
  /** URL quay lại kèm đầy đủ query params để truyền sang màn hình chi tiết */
  returnUrl?: string;
}

/**
 * Component bảng danh sách nhân viên hiển thị 9 cột dữ liệu,
 * hỗ trợ sắp xếp các cột, thanh phân trang và tự động cắt ngắn chuỗi nếu quá 22 ký tự.
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
  /**
   * Tạo đường dẫn chi tiết kèm tham số returnTo.
   */
  const getDetailLink = (employeeId: number) => {
    if (returnUrl) {
      return `${ROUTES.EMPLOYEE_DETAIL}?${QUERY_PARAMS.ID}=${employeeId}&${QUERY_PARAMS.RETURN_TO}=${encodeURIComponent(returnUrl)}`;
    }
    return `${ROUTES.EMPLOYEE_DETAIL}?${QUERY_PARAMS.ID}=${employeeId}`;
  };

  /**
   * Lấy icon sắp xếp cho từng cột theo chiều ASC/DESC.
   */
  const getSortIcon = (field: SortField) => {
    if (sortOrders[field] === SORT_ORDER.ASC) {
      return SORT_ICONS.ASC;
    }
    return SORT_ICONS.DESC;
  };

  return (
    <div className="row row-table">
      <div className="css-grid-table box-shadow">
        {/* Header bảng dữ liệu hỗ trợ click sắp xếp */}
        <div className="css-grid-table-header">
          <div>ID</div>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSort(SORT_FIELDS.EMPLOYEE_NAME)}
            title="氏名で並び替え"
          >
            氏名 {getSortIcon(SORT_FIELDS.EMPLOYEE_NAME)}
          </div>
          <div>生年月日</div>
          <div>グループ</div>
          <div>メールアドレス</div>
          <div>電話番号</div>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSort(SORT_FIELDS.CERTIFICATION_NAME)}
            title="日本語能力で並び替え"
          >
            日本語能力 {getSortIcon(SORT_FIELDS.CERTIFICATION_NAME)}
          </div>
          <div
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => onSort(SORT_FIELDS.END_DATE)}
            title="失効日で並び替え"
          >
            失効日 {getSortIcon(SORT_FIELDS.END_DATE)}
          </div>
          <div>点数</div>
        </div>

        {/* Body bảng dữ liệu */}
        <div className="css-grid-table-body">
          {/* 1. Trường hợp đang tải dữ liệu */}
          {loading && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              {SYSTEM_MESSAGES.LOADING}
            </div>
          )}

          {/* 2. Trường hợp không có dữ liệu */}
          {!loading && employees.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              {SYSTEM_MESSAGES.MSG005}
            </div>
          )}

          {/* 3. Render danh sách từng nhân viên */}
          {!loading &&
            employees.map((emp) => (
              <React.Fragment key={emp.employeeId}>
                <div className="bor-l-none text-center">
                  <Link href={getDetailLink(emp.employeeId)}>
                    {emp.employeeId}
                  </Link>
                </div>
                <div title={emp.employeeName}>
                  {truncateText(emp.employeeName)}
                </div>
                <div>
                  {emp.employeeBirthDate ? emp.employeeBirthDate.replaceAll('-', '/') : ''}
                </div>
                <div title={emp.departmentName || ''}>
                  {truncateText(emp.departmentName)}
                </div>
                <div title={emp.employeeEmail || ''}>
                  {truncateText(emp.employeeEmail)}
                </div>
                <div title={emp.employeeTelephone || ''}>
                  {truncateText(emp.employeeTelephone)}
                </div>
                <div title={emp.certificationName || ''}>
                  {truncateText(emp.certificationName)}
                </div>
                <div>
                  {emp.endDate ? emp.endDate.replaceAll('-', '/') : ''}
                </div>
                <div>
                  {emp.score !== null && emp.score !== undefined ? emp.score : ''}
                </div>
              </React.Fragment>
            ))}
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
