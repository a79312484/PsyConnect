'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('current_user');
    
    if (currentUser) {
      // Redirect to dashboard if logged in
      router.push('/dashboard');
    } else {
      // Redirect to auth if not logged in
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin mb-4">⏳</div>
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    </div>
  );
}
