import { useEffect, useState } from 'react';

type Props = {
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export function ClientSideOnly({ children, fallback = null }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), [setMounted]);
  return mounted ? children : fallback;
}
