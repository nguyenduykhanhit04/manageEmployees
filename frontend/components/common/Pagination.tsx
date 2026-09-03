'use client';

import React from 'react';
import { PAGING } from '@/lib/constants';

/**
 * Props truyền vào Component thanh phân trang Pagination.
 */
export interface PaginationProps {
  /** Trang hiện tại (bắt đầu từ 1) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Callback xử lý sự kiện khi người dùng chuyển trang */
  onPageChange: (page: number) => void;
  /** Số trang tối đa hiển thị trên thanh phân trang (mặc định là 3) */
  maxDisplayPages?: number;
}

/**
 * Component thanh phân trang tái sử dụng cho các bảng dữ liệu.
 *
 * @author nguyenduykhanh2
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxDisplayPages = PAGING.MAX_DISPLAY_PAGES,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // Tính toán dải số trang hiển thị theo cửa sổ trượt
  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayPages / 2));
  let endPage = startPage + maxDisplayPages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxDisplayPages + 1);
  }

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagin">
      {/* Nút lùi về trang trước */}
      <button
        type="button"
        aria-label="Previous Page"
        className={`btn btn-sm btn-pre btn-falcon-default ${currentPage <= 1 ? 'btn-disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <svg
          className="svg-inline--fa fa-chevron-left fa-w-10"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="chevron-left"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          data-fa-i2svg=""
        >
          <path
            fill="currentColor"
            d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
          />
        </svg>
      </button>

      {/* Danh sách các nút số trang */}
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          className="btn btn-sm btn-falcon-default"
          style={
            pageNum === currentPage
              ? { textDecoration: 'underline', fontWeight: 'bold' }
              : {}
          }
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      {/* Nút tiến sang trang sau */}
      <button
        type="button"
        aria-label="Next Page"
        className={`btn btn-sm btn-next btn-falcon-default ${currentPage >= totalPages ? 'btn-disabled' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <svg
          className="svg-inline--fa fa-chevron-right fa-w-10"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="chevron-right"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          data-fa-i2svg=""
        >
          <path
            fill="currentColor"
            d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
          />
        </svg>
      </button>
    </div>
  );
};
