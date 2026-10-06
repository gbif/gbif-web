import { createContext, useContext } from 'react';
import { useI18n } from '../i18n';
import { GetRedirectUrl } from './createGetRedirectUrl';

const GetRedirectUrlContext = createContext<GetRedirectUrl | undefined>(undefined);

export function useGetRedirectUrl(path: string): string | null {
  const getRedirectUrl = useContext(GetRedirectUrlContext);
  const { locale } = useI18n();
  if (!getRedirectUrl) return null;
  return getRedirectUrl(path, locale);
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
