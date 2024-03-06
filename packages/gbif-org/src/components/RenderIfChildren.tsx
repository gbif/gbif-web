type Props<T extends React.ElementType> = React.ComponentProps<T> & {
  children?: React.ReactNode;
  as?: T;
};

// Don't use this component as a wrapper for components with side effects, as it will run the children components twice.
export function RenderIfChildren<T extends React.ElementType = 'div'>({
  children,
  as,
  ...props
}: Props<T>) {
  if (willRenderToNull(children)) return null;

  const Element = as ?? 'div';
  return <Element {...props}>{children}</Element>;
}

function willRenderToNull(children?: React.ReactNode): boolean {
  if (!children) return true;

  if (Array.isArray(children)) {
    return children.every(willRenderToNull);
  }

  if (
    typeof children === 'object' &&
    'type' in children &&
    'props' in children &&
    typeof children.type === 'function'
  ) {
    // @ts-ignore
    return willRenderToNull(children.type(children.props));
  }

  return false;
}
