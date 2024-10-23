import { createContext, useContext } from 'react';
import { GetRedirectUrl } from './createGetRedirectUrl';

const GetRedirectUrlContext = createContext<GetRedirectUrl | undefined>(undefined);

export function useGetRedirectUrl(path: string): string | null {
  const getRedirectUrl = useContext(GetRedirectUrlContext);
  if (!getRedirectUrl) return null;
  return getRedirectUrl(path);
}

type Props = {
  children: React.ReactNode;
  getRedirectUrl: GetRedirectUrl;
};

export function RedirectToGbifProvider({ children, getRedirectUrl }: Props) {
  return (
    <GetRedirectUrlContext.Provider value={getRedirectUrl}>
      {children}
    </GetRedirectUrlContext.Provider>
  );
}
