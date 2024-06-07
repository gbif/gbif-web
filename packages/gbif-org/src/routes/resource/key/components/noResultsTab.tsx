type Props = {
  children: React.ReactNode;
};

export function NoResultsTab({ children }: Props) {
  return (
    <div className='g-flex g-justify-center g-p-36'>
      <p className='g-text-gray-400 g-font-semibold'>{children}</p>
    </div>
  );
}
