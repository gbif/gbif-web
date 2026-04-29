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
            <span dangerouslySetInnerHTML={{ __html: c.name ?? '' }}></span>
          </DynamicLink>
        </span>
      ))}
    </Classification>
  );
}

export function GeologicalLayers({
  earliestEonOrLowestEonothem,
  earliestEraOrLowestErathem,
  earliestPeriodOrLowestSystem,
  earliestEpochOrLowestSeries,
  earliestAgeOrLowestStage,
  lowestBiostratigraphicZone,
  group,
  formation,
  member,
  bed,
  className,
  ...props
}: {
  earliestEonOrLowestEonothem?: string | null;
  earliestEraOrLowestErathem?: string | null;
  earliestPeriodOrLowestSystem?: string | null;
  earliestEpochOrLowestSeries?: string | null;
  earliestAgeOrLowestStage?: string | null;
  lowestBiostratigraphicZone?: string | null;
  group?: string | null;
  formation?: string | null;
  member?: string | null;
  bed?: string | null;
  className?: string;
}) {
  const chronostratigraphicLayers = [
    earliestEonOrLowestEonothem,
    earliestEraOrLowestErathem,
    earliestPeriodOrLowestSystem,
    earliestEpochOrLowestSeries,
    earliestAgeOrLowestStage,
    lowestBiostratigraphicZone,
  ];
  const lithostratigraphicLayers = [group, formation, member, bed];

  const hasChronostratigraphic = chronostratigraphicLayers;
  const hasLithostratigraphic = lithostratigraphicLayers.some((layer) => !!layer);
  if (!hasChronostratigraphic && !hasLithostratigraphic) return null;
  return (
    <div className={className} {...props}>
      {hasChronostratigraphic && (
        <Classification>
          {chronostratigraphicLayers
            .filter((layer) => !!layer)
            .map((layer, index) => (
              <span key={index}>{layer}</span>
            ))}
        </Classification>
      )}
      {hasLithostratigraphic && (
        <Classification>
          {lithostratigraphicLayers
            .filter((layer) => !!layer)
            .map((layer, index) => (
              <span key={index}>{layer}</span>
            ))}
        </Classification>
      )}
    </div>
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
