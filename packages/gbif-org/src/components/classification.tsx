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

export function TaxonStubClassification({
  classification,
  className,
}: {
  classification: { scientificName: string | null; taxonID?: string }[];
  className?: string;
}) {
  // Show the 2 top levels of classification if this is not a synonym. Then ... and then the lowest parent. ... should only show if there is something in between of course. It should be links to the entries
  return (
    <>
      <Classification className={cn('g-mt-2 g-flex g-flex-wrap g-gap-1 g-items-center', className)}>
        {classification.slice(0, 2).map((c) => (
          <TaxonClassificationItem key={c.taxonID ?? c.scientificName} taxon={c} />
        ))}
        {classification.length > 3 && <span>...</span>}
        {classification.length > 2 && (
          <TaxonClassificationItem taxon={classification[classification.length - 1]} />
        )}
      </Classification>
    </>
  );
}

function TaxonClassificationItem({
  taxon,
}: {
  taxon: { scientificName: string | null; taxonID?: string };
}) {
  return (
    <span key={taxon.taxonID} className="g-flex g-items-center">
      {taxon.taxonID && (
        <DynamicLink
          className="hover:g-underline"
          pageId="taxonKey"
          variables={{ key: taxon.taxonID.toString() }}
        >
          {taxon.scientificName}
        </DynamicLink>
      )}
      {!taxon.taxonID && <span>{taxon.scientificName}</span>}
    </span>
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
            pageId={datasetKey ? 'datasetKey' : 'taxonKey'}
            variables={{ key: datasetKey ? `${datasetKey}/taxon/${c.key}` : c.key }}
            className="g-text-inherit hover:g-underline"
          >
            <span dangerouslySetInnerHTML={{ __html: c.name ?? '' }}></span>
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
