// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/create-profile'); // Redirect to /home when visiting the root URL
  }, [router]);

  return null; // This page just redirects
}


