'use client';

import Image from 'next/image';
import { useGuest } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  useGuest();

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-pic js-tilt" data-tilt>
            <Image src="/assets/images/img-01.png" alt="IMG" width={400} height={400} />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

