// AuthLayout.tsx
"use client";

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/actions/user.action';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{
    fullName: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser({
            fullName: currentUser.fullName,
            email: currentUser.email,
            avatar: currentUser.avatar
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
    </div>;
  }

  return (
    <div className="flex">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
