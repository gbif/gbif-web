import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export function ClientSideOnly({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), [setMounted]);
  return mounted ? children : null;
}
