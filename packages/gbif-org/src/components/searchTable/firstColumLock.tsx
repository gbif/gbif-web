import useBelow from '@/hooks/useBelow';
import { interopDefault } from '@/utils/interopDefault';
import { createContext, useContext, useMemo } from 'react';
import _useLocalStorage from 'use-local-storage';
// Used to import commonjs module as es6 module
const useLocalStorage = interopDefault(_useLocalStorage);

// TODO: This funcionaly is built into the table library, but for development speed i don't want to refactor it now.

type FirstColumLockContextType = {
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  hideLock: boolean;
};
const FirstColumLockContext = createContext<FirstColumLockContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  lockColumnLocalStoreKey: string;
};

export function FirstColumLockProvider({ children, lockColumnLocalStoreKey }: Props) {
  const [locked, setLocked] = useLocalStorage(lockColumnLocalStoreKey, true);

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
