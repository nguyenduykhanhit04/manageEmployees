'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth/token';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    removeToken();
    router.push('/login');
  }, [router]);

  return <div>Logging out...</div>;
}

