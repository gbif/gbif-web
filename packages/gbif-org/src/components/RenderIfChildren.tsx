type Props<T extends React.ElementType> = React.ComponentProps<T> & {
  className?: string;
  children?: React.ReactNode;
  as?: T;
};

export function RenderIfChildren<T extends React.ElementType = 'div'>({
  className,
  children,
  as,
  ...props
}: Props<T>) {
  if (children == null) return null;
  const Element = as ?? 'div';
  return (
    <Element className={className} {...props}>
      {children}
    </Element>
  );
}
