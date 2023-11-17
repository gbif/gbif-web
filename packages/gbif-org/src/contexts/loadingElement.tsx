import React from 'react';

type ILoadingElementContext = {
  id: string;
  lang: string;
  loadingElement: React.ReactNode;
  nestingLevel: number;
};

const LoadingElementContext = React.createContext<ILoadingElementContext[]>([]);

type Props = {
  children: React.ReactNode;
};

export function LoadingElementProvider({ children }: Props) {
  const [loadingElements, setLoadingElements] = React.useState<ILoadingElementContext[]>([]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleLoadingStart(event: LoadingEvent) {
      const { loadingElement, nestingLevel, id, lang } = event.detail;
      setLoadingElements((prev) => [...prev, { loadingElement, nestingLevel, id, lang }]);
    }

    function handleLoadingEnd(event: LoadingEvent) {
      const { id } = event.detail;
      setLoadingElements((prev) => {
        const lastLoadingElement = prev[prev.length - 1];
        return lastLoadingElement?.id === id ? [] : prev;
      });
    }

    window.addEventListener('start-loading', handleLoadingStart as any);
    window.addEventListener('done-loading', handleLoadingEnd as any);

    return () => {
      window.removeEventListener('start-loading', handleLoadingStart as any);
      window.removeEventListener('done-loading', handleLoadingEnd as any);
    };
  }, [setLoadingElements]);

  return (
    <LoadingElementContext.Provider value={loadingElements}>
      {children}
    </LoadingElementContext.Provider>
  );
}

// Only return the loading element if it's the first one and at the current nesting level and has the same lang
export function useLoadingElement(nestingLevel: number, lang: string): React.ReactNode | undefined {
  const loadingElements = React.useContext(LoadingElementContext);
  const firstLoadingElement = loadingElements[0];
  if (!firstLoadingElement) return;
  if (firstLoadingElement.nestingLevel === nestingLevel && firstLoadingElement.lang === lang) {
    return firstLoadingElement.loadingElement;
  }
}

type LoadingDetail = {
  id: string;
  lang: string;
  loadingElement: React.ReactNode;
  nestingLevel: number;
};

export class LoadingEvent extends CustomEvent<LoadingDetail> {
  constructor(typeArg: 'start-loading' | 'done-loading', detail: LoadingDetail) {
    super(typeArg, { detail });
  }
}
