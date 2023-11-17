import { useNextLoadingElement } from '@/hooks/useNextLoadingElement';

type Props = {
  children?: React.ReactNode;
};

export function NextLoadingElementWrapper({ children }: Props): React.ReactNode {
  const nextLoadingElement = useNextLoadingElement();
  if (nextLoadingElement) return nextLoadingElement;

  return children;
}
