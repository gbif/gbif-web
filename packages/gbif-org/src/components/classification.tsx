import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import styles from './classification.module.css';
const majorRanks = ['KINGDOM', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS', 'SPECIES'];

export function Classification({
  as: Div = 'div',
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<'div'>) {
  return (
    <Div className={cn(styles.classification, className)} {...props}>
      {children}
    </Div>
  );
}

export function TaxonClassification({
  classification,
  majorOnly,
  className,
  datasetKey,
}: {
  classification: { rank?: string | null; name?: string | null; key: string }[];
  majorOnly?: boolean;
  className?: string;
  datasetKey?: string;
}) {
  const classificationFiltered = majorOnly
    ? classification.filter((c) => c.rank && majorRanks.includes(c.rank) && c.name)
    : classification;
  return (
    <Classification className={className}>
      {classificationFiltered.map((c, i) => (
        <span key={i}>
          <DynamicLink
            pageId={datasetKey ? 'datasetKey' : 'speciesKey'}
            variables={{ key: datasetKey ? `${datasetKey}/species/${c.key}` : c.key }}
            className="g-text-inherit hover:g-underline"
          >
            <span>{c.name}</span>
          </DynamicLink>
        </span>
      ))}
    </Classification>
  );
}

export function GadmClassification({
  gadm,
  className,
  children,
  ...props
}: {
  gadm: {
    level0: { name: string };
    level1: { name: string };
    level2: { name: string };
    level3: { name: string };
    level4: { name: string };
  };
  className?: string;
  children?: React.ReactNode;
}) {
  if (!gadm) return <span>Unknown</span>;

  return (
    <Classification className={className} {...props}>
      {[0, 1, 2, 3, 4].map((n) => {
        const level = gadm[`level${n}` as keyof typeof gadm];
        return level ? <span key={n}>{level.name}</span> : null;
      })}
    </Classification>
  );
}
