import useBelow from '@/hooks/useBelow';
import { Setter } from '@/types';
import { interopDefault } from '@/utils/interopDefault';
import _useLocalStorage from 'use-local-storage';
// Used to import commonjs module as es6 module
const useLocalStorage = interopDefault(_useLocalStorage);

export type SetFirstColumnIsLocked = Setter<boolean>;

type Result = {
  firstColumnIsLocked: boolean;
  setFirstColumnIsLocked: SetFirstColumnIsLocked;
  hideFirstColumnLock: boolean;
};

export function useFirstColumLock(localStorageKey: string): Result {
  const [locked, setLocked] = useLocalStorage(localStorageKey, true);
  const isMobile = useBelow(600, true);

  return {
    firstColumnIsLocked: isMobile ? false : locked,
    setFirstColumnIsLocked: setLocked as SetFirstColumnIsLocked,
    hideFirstColumnLock: isMobile,
  };
}
