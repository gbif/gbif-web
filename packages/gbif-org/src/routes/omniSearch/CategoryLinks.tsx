import { FaDatabase, FaKiwiBird } from 'react-icons/fa';
import { MdBusiness, MdChevronRight, MdFileCopy, MdMap } from 'react-icons/md';
import { CategoryCount } from './search';

const categories: CategoryCount[] = [
  { type: 'species', count: 0, label: 'Species', icon: 'Bird' },
  { type: 'occurrence', count: 0, label: 'Occurrences', icon: 'Map' },
  { type: 'dataset', count: 0, label: 'Datasets', icon: 'Database' },
  { type: 'publisher', count: 0, label: 'Publishers', icon: 'Building2' },
  { type: 'resource', count: 0, label: 'Articles', icon: 'FileText' },
];

const iconMap = {
  Bird: FaKiwiBird,
  Map: MdMap,
  Database: FaDatabase,
  Building2: MdBusiness,
  FileText: MdFileCopy,
};

interface CategoryLinksProps {
  counts: Record<string, number>;
  query: string;
}

export function CategoryLinks({ counts, query }: CategoryLinksProps) {
  return (
    <div className="g-overflow-x-auto g-pb-2 g--mx-4 g-px-4">
      <div className="g-flex g-gap-3 md:g-grid md:g-grid-cols-2 lg:g-grid-cols-5 g-min-w-max md:g-min-w-0">
        {categories.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap];
          const count = counts[category.type] || 0;

          return (
            <a
              key={category.type}
              href={`/${category.type}/search?q=${encodeURIComponent(query)}`}
              className="g-flex g-items-center g-bg-white g-rounded-lg g-border g-border-gray-100 hover:g-border-primary-500 hover:g-shadow-md g-transition-all g-group g-whitespace-nowrap"
            >
              <div className="g-flex g-items-center g-gap-3 g-p-3 md:g-p-4">
                <div className="g-p-2 g-rounded-lg g-bg-primary-50 g-text-primary-600">
                  <Icon className="g-h-5 g-w-5" />
                </div>
                <div>
                  <h3 className="g-font-medium g-text-gray-900">{category.label}</h3>
                  <p className="g-text-sm g-text-gray-500">{count.toLocaleString()}</p>
                </div>
              </div>
              <div className="g-border-l g-border-gray-100 g-p-3 g-flex g-items-center">
                <MdChevronRight className="g-h-5 g-w-5 g-text-gray-400 group-hover:g-text-primary-500 g-transition-colors" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
