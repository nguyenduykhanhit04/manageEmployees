import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isTokenExpired } from '@/lib/auth/token';

/**
 * Hook kiểm tra trạng thái xác thực của người dùng cho các trang được bảo vệ.
 * Nếu chưa đăng nhập hoặc token hết hạn thì chuyển hướng về trang đăng nhập.
 *
 * @author nguyenduykhanh2
 */
const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Lấy thông tin token từ storage/cookie
    const token = getToken();

    // 2. Kiểm tra token tồn tại và còn hạn hay không
    // 2.1 Nếu không có token hoặc token đã hết hạn -> Chuyển hướng về trang đăng nhập
    if (!token || isTokenExpired(token?.accessToken)) {
      router.push('/login');
    }
  }, [router]);
};

/**
 * Hook kiểm tra trạng thái khách (guest) cho các trang công khai (như trang Login).
 * Nếu đã đăng nhập và token còn hạn thì chuyển hướng thẳng vào màn hình danh sách ADM002.
 *
 * @author nguyenduykhanh2
 */
const useGuest = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Lấy thông tin token từ storage/cookie
    const token = getToken();

    // 2. Kiểm tra token tồn tại và còn hạn hay không
    // 2.1 Nếu đã có token và token còn hạn -> Chuyển hướng vào màn hình ADM002
    if (token && !isTokenExpired(token?.accessToken)) {
      router.push('/employees/adm002');
    }
  }, [router]);
};

export { useAuth, useGuest };
