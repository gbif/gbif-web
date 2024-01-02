type Props = {
  children: React.ReactNode;
};

export function ArticleContainer({ children }: Props) {
  return <article className="p-8 pt-16">{children}</article>;
}
