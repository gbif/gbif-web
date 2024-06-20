import { useEffect, useState } from 'react';

type Props<T extends React.ElementType> = React.ComponentProps<T> & {
  children?: React.ReactNode;
  as?: T;
  onChange?: (visible: boolean) => void;
};

// Don't use this component as a wrapper for components with side effects, as it will run the children components twice.
export function RenderIfChildren<T extends React.ElementType = 'div'>({
  children,
  as,
  onChange, // optional callback function to notify parent of visibility status
  ...props
}: Props<T>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (onChange) onChange(visible);
  }, [visible]);

  if (willRenderToNull(children)) {
    if (visible) setVisible(false);
    return null;
  } else {
    if (!visible) setVisible(true);
  }

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
