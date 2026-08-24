'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';

/**
 * Component màn hình danh sách nhân viên (ADM002).
 * Thực hiện hiển thị danh sách, tìm kiếm theo tên/phòng ban,
 * sắp xếp nhiều cột và phân trang dữ liệu.
 *
 * @author nguyenduykhanh2
 * @return Giao diện màn hình ADM002
 */
export default function EmployeeListPage() {
  // Xác thực quyền đăng nhập của người dùng
  useAuth();
  const router = useRouter();

  // Lấy dữ liệu và các hàm xử lý từ Custom Hook
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
  } = useEmployees();

  return (
    <>
      {/* Hiển thị khung thông báo lỗi nếu có lỗi xảy ra */}
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
                <button type="submit" className="btn btn-primary btn-sm">検索</button>
                <button type="button" onClick={() => router.push('/employees/edit')} className="btn btn-secondary btn-sm">新規追加</button>
              </div>
            </li>
          </ul>
        </form>
      </div>

      {/* Bảng dữ liệu danh sách nhân viên */}
      <div className="row row-table">
        <div className="css-grid-table box-shadow">
          {/* Header bảng dữ liệu hỗ trợ click sắp xếp */}
          <div className="css-grid-table-header">
            <div>ID</div>
            <div
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => handleSort('ord_employee_name')}
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
              onClick={() => handleSort('ord_certification_name')}
              title="日本語能力で並び替え"
            >
              日本語能力 {sortOrders.ord_certification_name === 'ASC' ? '▲▽' : '△▼'}
            </div>
            <div
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => handleSort('ord_end_date')}
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
                Đang tải dữ liệu ...
              </div>
            ) : /* Trường hợp không tìm thấy bản ghi nào */
              employees.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                  検索条件に該当するユーザが見つかりません。
                </div>
              ) : (
                /* Render danh sách từng nhân viên */
                employees.map((emp) => (
                  <React.Fragment key={emp.employeeId}>
                    <div className="bor-l-none text-center">
                      <Link href={`/employees/detail?id=${emp.employeeId}`}>
                        {emp.employeeId}
                      </Link>
                    </div>

                    <div>
                      <Link href={`/employees/detail?id=${emp.employeeId}`}>
                        {emp.employeeName}
                      </Link>
                    </div>
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

          {/* Thanh phân trang: Chỉ hiển thị khi số lượng trang lớn hơn 1 */}
          {totalPages > 1 && (
            <div className="pagin">
              {/* Nút lùi về trang trước */}
              <button
                type="button"
                className={`btn btn-sm btn-pre btn-falcon-default ${currentPage <= 1 ? 'btn-disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <svg className="svg-inline--fa fa-chevron-left fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg>
              </button>

              {/* Danh sách các nút số trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className="btn btn-sm btn-falcon-default"
                  style={
                    pageNum === currentPage
                      ? { textDecoration: 'underline', fontWeight: 'bold' }
                      : {}
                  }
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              {/* Nút tiến sang trang sau */}
              <button
                type="button"
                className={`btn btn-sm btn-next btn-falcon-default ${currentPage >= totalPages ? 'btn-disabled' : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <svg className="svg-inline--fa fa-chevron-right fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
