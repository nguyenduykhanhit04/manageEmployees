'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth/token';
import { ROUTES } from '@/lib/constants/routes';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    removeToken();
    router.push(ROUTES.LOGIN);
  }, [router]);

  return <div>Logging out...</div>;
}

