import { useLoadingElement } from '@/contexts/loadingElement';

type Props = {
  children: React.ReactNode;
  nestingLevel: number;
  lang: string;
};

export function LoadingElementWrapper({ children, nestingLevel, lang }: Props) {
  const loadingElement = useLoadingElement(nestingLevel, lang);

  if (loadingElement) {
    return loadingElement;
  }

  return children;
}
