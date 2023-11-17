import React from 'react';
import { DoneRenderingEvent, useLoadingElement } from '@/contexts/loadingElement';

type Props = {
  children: React.ReactNode;
  nestingLevel: number;
  lang: string;
  id: string;
};

export function LoadingElementWrapper({ children, nestingLevel, lang, id }: Props) {
  const loadingElement = useLoadingElement(nestingLevel, lang, id);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(new DoneRenderingEvent({ id }));
  }, [loadingElement]);

  if (loadingElement) {
    return loadingElement;
  }

  return children;
}
