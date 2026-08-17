'use client'
import './globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeaderFooter = !pathname.includes('/login');
  
  return (
    <html lang="ja">
      <body>
        {showHeaderFooter ? (
          <main>
            <div className="container">
              <Header />
              <div className="content">
                <div className="content-main">
        {children}
                </div>
              </div>
              <Footer />
            </div>
          </main>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
