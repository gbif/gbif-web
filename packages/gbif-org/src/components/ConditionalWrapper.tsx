type Props = {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
};

export function ConditionalWrapper({ condition, wrapper, children }: Props) {
  return condition ? wrapper(children) : children;
}
