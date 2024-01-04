type Props = {
  children: React.ReactNode;
};

export function ArticlePreTitle({ children }: Props) {
  return <p className="mb-2 text-sm leading-6 font-semibold text-primary">{children}</p>;
}
