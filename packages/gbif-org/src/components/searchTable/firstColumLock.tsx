import useBelow from '@/hooks/useBelow';
import { createContext, useContext, useMemo, useState } from 'react';

type FirstColumLockContextType = {
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  hideLock: boolean;
};
const FirstColumLockContext = createContext<FirstColumLockContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function FirstColumLockProvider({ children }: Props) {
  const [locked, setLocked] = useState(true);

  const isMobile = useBelow(600, true);

  const context: FirstColumLockContextType = useMemo(
    () => ({ locked: isMobile || locked, setLocked, hideLock: isMobile }),
    [locked, setLocked, isMobile]
  );

  return (
    <FirstColumLockContext.Provider value={context}>{children}</FirstColumLockContext.Provider>
  );
}

export function useFirstColumLock() {
  const context = useContext(FirstColumLockContext);
  if (context === undefined) {
    throw new Error('useFirstColumLock must be used within a FirstColumLockProvider');
  }
  return context;
}
