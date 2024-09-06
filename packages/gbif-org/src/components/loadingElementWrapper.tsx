import React from 'react';
import { useLoadingElement } from '@/contexts/loadingElement';

type Props = {
  children: React.ReactNode;
  nestingLevel: number;
  id: string;
};

export function LoadingElementWrapper({ children, nestingLevel, id }: Props) {
  const loadingElement = useLoadingElement(nestingLevel, id);

  if (loadingElement) {
    return loadingElement;
  }

  return children;
}
