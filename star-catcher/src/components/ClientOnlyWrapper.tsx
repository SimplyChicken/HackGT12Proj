'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnlyWrapper({ children, fallback }: ClientOnlyWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback || null;
  }

  return <>{children}</>;
}
