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

  // Event listners are used to communicate between this context and the react router loader functions
  React.useEffect(() => {
    // This context is only used in the browser
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

export function useLoadingElement(nestingLevel: number, lang: string): React.ReactNode | undefined {
  const loadingElements = React.useContext(LoadingElementContext);
  const firstLoadingElement = loadingElements[0];
  if (!firstLoadingElement) return;

  // Only return the loading element if it's the first one and at the current nesting level and has the same lang
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
