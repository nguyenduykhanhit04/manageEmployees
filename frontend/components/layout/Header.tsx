import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <nav className="nav-bar">
      <div className="content-main">
        <div className="d-flex">
          <a className="navbar-brand">
            <Image src="/assets/images/Logo-Luvina.svg" title="Logo" alt="logo" width={100} height={50} />
          </a>
          <h5 className="title-brand mr-auto">Luvina Software</h5>
          <ul className="navbar-nav flex-row d-flex">
            <li className="nav-item">
              <Link href="/employees/list">トップ</Link>
            </li>
            <li className="nav-item">
              <Link href="/logout">ログアウト</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;

