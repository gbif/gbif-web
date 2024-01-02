type Props = {
  children: React.ReactNode;
};

export function ArticleTitle({ children }: Props) {
  return (
    <h1 className="text-3xl inline-block sm:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
      {children}
    </h1>
  );
}
