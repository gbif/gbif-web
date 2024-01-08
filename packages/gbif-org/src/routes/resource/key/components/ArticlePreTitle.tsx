type Props = {
  children: React.ReactNode;
  secondary?: React.ReactNode;
};

export function ArticlePreTitle({ secondary, children }: Props) {
  return <p className="mb-2 text-sm leading-6 font-semibold text-primary-500 dark:text-primary-400">{children} {secondary && <span className="text-slate-500 font-normal ml-2">{secondary}</span>}</p>;
}
