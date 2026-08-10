import { EntityLink } from '@/hooks/useTaxonLinks';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { EntityLinkPresentation } from './entityLink';
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
  getTaxonLink,
}: {
  classification: {
    scientificName?: string | null;
    taxonID?: string | null;
    key?: string | null;
    name?: string | null;
  }[];
  className?: string;
  /** Resolves where each rank links. Without it the crumbs link to this site's taxon pages. */
  getTaxonLink?: (key?: string | null) => EntityLink;
}) {
  if (!classification || classification.length === 0) return null;
  // Show the 2 top levels of classification if this is not a synonym. Then ... and then the lowest parent. ... should only show if there is something in between of course. It should be links to the entries
  // the APIs provides classification in multiple formats named differently.
  return (
    <>
      <Classification
        dir="ltr"
        className={cn('g-flex g-flex-wrap g-gap-1 g-items-center', className)}
      >
        {classification.slice(0, 2).map((c) => (
          <TaxonClassificationItem
            key={c.taxonID ?? c.key ?? c.scientificName ?? c.name}
            taxon={c}
            getTaxonLink={getTaxonLink}
          />
        ))}
        {classification.length > 3 && <span>...</span>}
        {classification.length > 2 && (
          <TaxonClassificationItem
            taxon={classification[classification.length - 1]}
            getTaxonLink={getTaxonLink}
          />
        )}
      </Classification>
    </>
  );
}

function TaxonClassificationItem({
  taxon,
  getTaxonLink,
}: {
  taxon: {
    scientificName?: string | null;
    taxonID?: string | null;
    key?: string | null;
    name?: string | null;
  };
  getTaxonLink?: (key?: string | null) => EntityLink;
}) {
  const key = taxon.taxonID ?? taxon.key ?? '';
  const label = taxon.scientificName ?? taxon.name;

  if (getTaxonLink) {
    return (
      <span className="g-flex g-items-center">
        <EntityLinkPresentation
          className="hover:g-underline g-text-inherit"
          link={getTaxonLink(key)}
        >
          {label}
        </EntityLinkPresentation>
      </span>
    );
  }

  return (
    <span className="g-flex g-items-center">
      <DynamicLink
        className="hover:g-underline g-text-inherit"
        pageId="taxonKey"
        variables={{ key }}
      >
        {label}
      </DynamicLink>
    </span>
  );
}
export function TaxonClassification({
  classification,
  majorOnly,
  className,
  datasetKey,
}: {
  classification: { rank?: string | null; name?: string | null; key?: string }[];
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
          {c.key && (
            <DynamicLink
              pageId={datasetKey ? 'datasetKey' : 'taxonKey'}
              variables={{ key: datasetKey ? `${datasetKey}/taxon/${c.key}` : c.key }}
              className="g-text-inherit hover:g-underline"
            >
              <span dangerouslySetInnerHTML={{ __html: c.name ?? '' }}></span>
            </DynamicLink>
          )}
          {!c.key && <span dangerouslySetInnerHTML={{ __html: c.name ?? '' }}></span>}
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
      {lowestBiostratigraphicZone && <span>{lowestBiostratigraphicZone}</span>}
    </div>
  );
}

export function GadmClassification({
  gadm,
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <Classification className={className} {...props} dir="auto">
      {[0, 1, 2, 3, 4].map((n) => {
        const level = gadm[`level${n}` as keyof typeof gadm];
        return level ? <span key={n}>{level.name}</span> : null;
      })}
    </Classification>
  );
}
