type Props = {
  children: React.ReactNode;
};

export function ClientSideOnly({ children }: Props) {
  return typeof window === 'undefined' ? null : children;
}
