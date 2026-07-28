import { DataPackageExplore } from './explore';
import { DataPackageValidation } from './validation';

export type DataPackageGroup = 'explore' | 'validation';

type Props = {
  group: DataPackageGroup;
};

export default function DataPackageSections({ group }: Props) {
  switch (group) {
    case 'validation':
      return <DataPackageValidation />;
    case 'explore':
    default:
      return <DataPackageExplore />;
  }
}
