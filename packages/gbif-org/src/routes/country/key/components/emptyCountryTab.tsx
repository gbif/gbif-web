import EmptyTab from '@/components/EmptyTab';

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export function EmptyCountryTab({ title, description }: Props) {
  return (
    <EmptyTab>
      <div className="g-flex g-flex-col g-gap-2 g-items-center g-text-center g-pt-8">
        <h2 className="g-text-xl g-font-bold g-text-gray-500">{title}</h2>
        <p className="g-text-gray-400 g-text-sm">{description}</p>
      </div>
    </EmptyTab>
  );
}
