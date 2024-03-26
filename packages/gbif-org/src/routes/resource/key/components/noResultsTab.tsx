type Props = {
  children: React.ReactNode;
};

export function NoResultsTab({ children }: Props) {
  return (
    <div className="flex justify-center p-36">
      <p className="text-gray-400 font-semibold">{children}</p>
    </div>
  );
}
