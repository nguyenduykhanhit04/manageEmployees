'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EmployeeListPage() {
  useAuth();
  const router = useRouter();

  return (
    <>
      <div className="search-memb">
        <h1 className="title">会員名称で会員を検索します。検索条件無しの場合は全て表示されます。</h1>
        <form className="c-form">
          <ul className="d-flex">
            <li className="form-group row">
              <label className="col-form-label">氏名:</label>
              <div className="col-sm"><input type="text" /></div>
            </li>
            <li className="form-group row">
              <label className="col-form-label">グループ:</label>
              <div className="col-sm">
                <select>
                  <option>全て</option>
                  <option>Nhóm 1</option>
                  <option>Nhóm 2</option>
                </select>
              </div>
            </li>
            <li className="form-group row">
              <div className="btn-group">
                <button type="button" className="btn btn-primary btn-sm">検索</button>
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
            <div>生年月日 ▲▽</div>
            <div>グループ</div>
            <div>メールアドレス</div>
            <div>電話番号</div>
            <div>日本語能力</div>
            <div>失効日 ▼△</div>
            <div>点数</div>
          </div>
          <div className="css-grid-table-body">
            {/* Sample Data */}
            <div className="bor-l-none text-center">
              <Link href="/employees/detail">1</Link>
            </div>
            <div>Nguyễn Thị Mai Hương</div>
            <div>1983/07/08</div>
            <div>Phòng QAT</div>
            <div>ntmhuong@luvina.net</div>
            <div>0914326386</div>
            <div>Trình độ tiếng nhật cấp 4</div>
            <div>2011/07/08</div>
            <div>290</div>

            <div className="bor-l-none text-center">
              <Link href="/employees/detail">2</Link>
            </div>
            <div>Lê Thị Xoa</div>
            <div>1983/07/08</div>
            <div>Phòng DEV1</div>
            <div>xoalt@luvina.net</div>
            <div>1234567894</div>
            <div>Trình độ tiếng nhật cấp 4</div>
            <div>2011/07/08</div>
            <div>290</div>

            <div className="bor-l-none text-center">
              <Link href="/employees/detail">3</Link>
            </div>
            <div>Đặng Thị Hân</div>
            <div>1983/07/08</div>
            <div>Phòng QAT</div>
            <div>handt@luvina.net</div>
            <div>0914326386</div>
            <div>Trình độ tiếng nhật cấp 4</div>
            <div>2011/07/08</div>
            <div>290</div>

            <div className="bor-l-none text-center">
              <Link href="/employees/detail">4</Link>
            </div>
            <div>Lê Nghiêm Thủy</div>
            <div>1983/07/08</div>
            <div>Phòng DEV1</div>
            <div>thuyln@luvina.net</div>
            <div>1234567894</div>
            <div>Trình độ tiếng nhật cấp 4</div>
            <div>2011/07/08</div>
            <div>290</div>

            <div className="bor-l-none text-center">
              <Link href="/employees/detail">5</Link>
            </div>
            <div>Lê Phương Anh</div>
            <div>1983/07/08</div>
            <div>Phòng DEV1</div>
            <div>anhlp@luvina.net</div>
            <div>1234567894</div>
            <div>Trình độ tiếng nhật cấp 4</div>
            <div>2011/07/08</div>
            <div>290</div>
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

