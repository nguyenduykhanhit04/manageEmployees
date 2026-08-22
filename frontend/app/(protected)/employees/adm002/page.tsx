'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getEmployees } from '@/lib/api/employee';
import { getDepartments } from '@/lib/api/department';
import { EmployeeItem } from '@/types/employee';
import { DepartmentItem } from '@/types/department';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EmployeeListPage() {
  useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // State tìm kiếm
  const [employeeName, setEmployeeName] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');

  // Cột đang được active sort và chiều sắp xếp của từng cột
  const [sortOrders, setSortOrders] = useState<{
    ord_employee_name: 'ASC' | 'DESC';
    ord_certification_name: 'ASC' | 'DESC';
    ord_end_date: 'ASC' | 'DESC';
  }>({
    ord_employee_name: 'ASC',
    ord_certification_name: 'ASC',
    ord_end_date: 'ASC',
  });

  const [activeSortField, setActiveSortField] = useState<'ord_employee_name' | 'ord_certification_name' | 'ord_end_date'>('ord_employee_name');

  // State phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const limit = 20;

  // Tải danh sách phòng ban khi mở trang
  useEffect(() => {
    getDepartments()
      .then((res) => {
        if (res && res.code === 200) {
          setDepartments(res.departments || []);
        } else {
          setErrorMessage('部門を取得できません');
        }
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        setErrorMessage('部門を取得できません');
      });
  }, []);

  // Hàm tải dữ liệu danh sách nhân viên từ Backend theo điều kiện tìm kiếm và sắp xếp
  const fetchEmployeeList = async (
    name: string = employeeName,
    deptId: string = departmentId,
    field: 'ord_employee_name' | 'ord_certification_name' | 'ord_end_date' = activeSortField,
    orders = sortOrders,
    offsetVal: number = 0
  ) => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Chỉ gửi tham số sort của cột đang được chọn để SQL sort chính xác theo cột đó
      const sortPayload: {
        ord_employee_name?: string;
        ord_certification_name?: string;
        ord_end_date?: string;
      } = {};

      sortPayload[field] = orders[field];

      const res = await getEmployees({
        employee_name: name.trim() || undefined,
        department_id: deptId ? Number(deptId) : undefined,
        ...sortPayload,
        offset: offsetVal,
        limit: limit,
      });

      if (res && res.code === 200) {
        setEmployees(res.employees || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setErrorMessage('従業員を取得できません');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('従業員を取得できません');
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách mặc định khi vào trang lần đầu với ASC
  useEffect(() => {
    fetchEmployeeList('', '', 'ord_employee_name', {
      ord_employee_name: 'ASC',
      ord_certification_name: 'ASC',
      ord_end_date: 'ASC',
    }, 0);
  }, []);

  // Xử lý khi nhấn nút Tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEmployeeList(employeeName, departmentId, activeSortField, sortOrders, 0);
  };

  // Xử lý khi click vào cột sắp xếp (toggle ASC <-> DESC)
  const handleSort = (field: 'ord_employee_name' | 'ord_certification_name' | 'ord_end_date') => {
    const nextOrder = sortOrders[field] === 'ASC' ? 'DESC' : 'ASC';
    const updatedOrders = {
      ...sortOrders,
      [field]: nextOrder,
    };
    setSortOrders(updatedOrders);
    setActiveSortField(field);
    setCurrentPage(1);
    fetchEmployeeList(employeeName, departmentId, field, updatedOrders, 0);
  };

  // Xử lý chuyển trang
  const totalPages = Math.ceil(totalRecords / limit) || 1;
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    fetchEmployeeList(employeeName, departmentId, activeSortField, sortOrders, (page - 1) * limit);
  };

  return (
    <>
      {/* Hiển thị lỗi chung nếu có */}
      {errorMessage && (
        <div className="box-err" style={{ marginBottom: '16px' }}>
          <div className="box-err-content">{errorMessage}</div>
        </div>
      )}

      <div className="search-memb">
        <h1 className="title">会員名称で会員を検索します。検索条件無しの場合は全て表示されます。</h1>
        <form className="c-form" onSubmit={handleSearch}>
          <ul className="d-flex">
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
            <li className="form-group row">
              <div className="btn-group">
                <button type="submit" className="btn btn-primary btn-sm">検索</button>
                <button type="button" onClick={() => router.push('/employees/edit')} className="btn btn-secondary btn-sm">新規追加</button>
              </div>
            </li>
          </ul>
        </form>
      </div>

      <div className="row row-table">
        <div className="css-grid-table box-shadow">
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
          <div className="css-grid-table-body">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                Đang tải dữ liệu ...
              </div>
            ) : employees.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                検索条件に該当するユーザが見つかりません。
              </div>
            ) : (
              employees.map((emp) => (
                <React.Fragment key={emp.employeeId}>
                  <div className="bor-l-none text-center">
                    <Link href={`/employees/detail?id=${emp.employeeId}`}>
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
          {totalPages > 1 && (
            <div className="pagin">
              <button
                type="button"
                className={`btn btn-sm btn-pre btn-falcon-default ${currentPage <= 1 ? 'btn-disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <svg className="svg-inline--fa fa-chevron-left fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`btn btn-sm ${pageNum === currentPage ? 'text-primary font-weight-bold' : 'btn-falcon-default'}`}
                  style={pageNum === currentPage ? { fontWeight: 'bold', textDecoration: 'underline' } : {}}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

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

