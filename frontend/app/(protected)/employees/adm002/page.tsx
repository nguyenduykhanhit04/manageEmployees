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

  // Hàm tải dữ liệu danh sách nhân viên từ Backend theo điều kiện tìm kiếm
  const fetchEmployeeList = async (name: string = employeeName, deptId: string = departmentId) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await getEmployees({
        employee_name: name.trim() || undefined,
        department_id: deptId ? Number(deptId) : undefined,
        offset: 0,
        limit: 20,
      });

      if (res && res.code === 200) {
        setEmployees(res.employees || []);
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

  // Tải danh sách mặc định khi vào trang lần đầu
  useEffect(() => {
    fetchEmployeeList('', '');
  }, []);

  // Xử lý khi nhấn nút Tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployeeList(employeeName, departmentId);
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
            <div>氏名 ▲▽</div>
            <div>生年月日</div>
            <div>グループ</div>
            <div>メールアドレス</div>
            <div>電話番号</div>
            <div>日本語能力 ▲▽</div>
            <div>失効日 ▼△</div>
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
          <div className="pagin">
            <Link className="btn btn-sm btn-pre btn-falcon-default btn-disabled" href="#">
              <svg className="svg-inline--fa fa-chevron-left fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg>
            </Link>
            <Link className="btn btn-sm text-primary btn-falcon-default" href="#">1</Link>
            <Link className="btn btn-sm text-primary btn-falcon-default" href="#">2</Link>
            <Link className="btn btn-sm text-primary btn-falcon-default" href="#">
              <svg className="svg-inline--fa fa-ellipsis-h fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>
            </Link>
            <Link className="btn btn-sm text-primary btn-falcon-default" href="#">15</Link>
            <Link className="btn btn-sm btn-next btn-falcon-default" href="#">
              <svg className="svg-inline--fa fa-chevron-right fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
