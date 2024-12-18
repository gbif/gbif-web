import {
    ComponentProps,
    JSXElementConstructor,
    ReactNode,
    useEffect,
    useRef,
    useState
} from 'react';

type ComponentOrElement = JSXElementConstructor<any> | keyof JSX.IntrinsicElements;

type Props<T extends ComponentOrElement> = {
  children?: ReactNode;
  as?: T;
  onChange?: (visible: boolean) => void;
} & Omit<ComponentProps<T>, 'children'>;

export function RenderIfChildren<T extends ComponentOrElement = 'div'>({
  children,
  as,
  onChange,
  ...props
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasChildrenContent, setHasChildrenContent] = useState<boolean | null>(null);

  // Determine if the children renders to nothing
  useEffect(() => {
    if (!containerRef.current) return;
    setHasChildrenContent(containerRef.current.innerHTML.trim().length > 0);
  }, [children]);

  // Notify parent of visibility status
  useEffect(() => {
    if (onChange && hasChildrenContent != null) onChange(hasChildrenContent);
  }, [hasChildrenContent, onChange]);

  const Wrapper = as ?? 'div';

  return (
    <>
      <div ref={containerRef} style={{ display: 'none' }}>
        {children}
      </div>
      {hasChildrenContent && <Wrapper {...(props as any)}>{children}</Wrapper>}
    </>
  );
}
