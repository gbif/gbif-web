import React from 'react';
import { DoneLoadingEvent, useLoadingElement } from '@/contexts/loadingElement';

type Props = {
  children: React.ReactNode;
  nestingLevel: number;
  id: string;
};

export function LoadingElementWrapper({ children, nestingLevel, id }: Props) {
  const loadingElement = useLoadingElement(nestingLevel, id);

  // Dispatch the done rendering event when the component has mounted.
  // This will let the loading element context know that the new route has mounted and the loading element can be removed.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new DoneLoadingEvent({ id }));
  }, [loadingElement]);

  if (loadingElement) {
    return loadingElement;
  }

  return children;
}
