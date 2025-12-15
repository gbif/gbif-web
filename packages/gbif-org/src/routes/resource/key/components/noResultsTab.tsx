type Props = {
  children: React.ReactNode;
};

export function NoResultsTab({ children }: Props) {
  return (
    <div className="g-flex g-justify-center g-px-8 g-py-36">
      <p className="g-text-gray-400 g-font-semibold g-text-center">{children}</p>
    </div>
  );
}
