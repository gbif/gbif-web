import Properties from '@/components/properties';
import { EventQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { Group } from '@/routes/occurrence/key/About/groups';
import { FormattedMessage } from 'react-intl';

type Humboldt = NonNullable<NonNullable<NonNullable<EventQuery['event']>['humboldt']>[number]>;
type Scope = NonNullable<NonNullable<Humboldt['targetTaxonomicScope']>[number]>;

/**
 * Humboldt-extension section. The Event API returns `humboldt` as a list (one
 * Humboldt record per parent classification target). We iterate and render
 * one block per record; if there's only one we drop the "Record N" header so
 * it doesn't look like unnecessary nesting.
 */
export function HumboldtSection({
  humboldt,
}: {
  humboldt?: ReadonlyArray<Humboldt | null> | null;
}) {
  const records = (humboldt ?? []).filter((h): h is Humboldt => !!h);
  if (records.length === 0) return null;

  return (
    <Group
      id="humboldt"
      label="occurrenceDetails.extensions.humboldtEcologicalInventory.name"
      defaultMessage="Humboldt extension"
      className="g-mb-4 g-scroll-mt-24"
    >
      {records.length === 1 && <HumboldtRecord humboldt={records[0]} />}
      {records.length > 1 && (
        <div className="g-space-y-2">
          <div className="g-text-xs g-text-slate-500">
            <FormattedMessage
              id="humboldt.recordsHeader"
              defaultMessage="{n} Humboldt records — expand to inspect each one."
              values={{ n: records.length }}
            />
          </div>
          {records.map((h, idx) => (
            <details
              key={idx}
              open={idx === 0}
              className="g-border g-border-slate-200 g-rounded g-bg-white"
            >
              <summary className="g-cursor-pointer g-list-none g-px-3 g-py-2 g-text-sm g-font-semibold g-text-slate-700 hover:g-bg-slate-50 g-flex g-items-center g-gap-2">
                <span className="g-text-slate-400 g-text-xs g-w-8">#{idx + 1}</span>
                <span className="g-flex-1 g-truncate">
                  {h.targetTaxonomicScope?.[0]?.usageName ?? (
                    <FormattedMessage id="phrases.record" defaultMessage="Record" />
                  )}
                  {h.targetTaxonomicScope?.[0]?.usageRank && (
                    <span className="g-ms-2 g-text-xs g-uppercase g-text-slate-400">
                      {h.targetTaxonomicScope[0].usageRank}
                    </span>
                  )}
                </span>
              </summary>
              <div className="g-px-4 g-py-4 g-border-t g-border-slate-100">
                <HumboldtRecord humboldt={h} />
              </div>
            </details>
          ))}
        </div>
      )}
    </Group>
  );
}

function HumboldtRecord({ humboldt: h }: { humboldt: Humboldt }) {
  return (
    <div className="g-space-y-5">
      <SamplingEffort h={h} />
      <Protocols h={h} />
      <TargetTaxonomicScope h={h} />
      <ExcludedNonTargetAbsent h={h} />
      <ScopeChips h={h} />
      <VouchersMaterialSamples h={h} />
      <InventoryAbundance h={h} />
      <VerbatimSiteInfo h={h} />
      <ReportingCompleteness h={h} />
    </div>
  );
}

function SubBlock({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="g-text-sm g-font-semibold g-text-slate-700 g-mb-2">{title}</h4>
      {children}
    </div>
  );
}

function humanize(id: string): string {
  const last = id.split('.').pop() ?? id;
  return last
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="g-text-slate-600 g-leading-tight">
        <FormattedMessage id={label} defaultMessage={humanize(label)} />
      </dt>
      <dd className="g-leading-tight g-break-words">{children}</dd>
    </>
  );
}

function nonEmptyList(arr?: ReadonlyArray<string | null> | null): string[] {
  return (arr ?? []).filter((x): x is string => !!x);
}

function SamplingEffort({ h }: { h: Humboldt }) {
  const hasAny =
    h.samplingEffortValue != null ||
    h.samplingEffortUnit ||
    h.eventDurationValue != null ||
    h.eventDurationUnit ||
    h.siteCount != null ||
    h.totalAreaSampledValue != null ||
    h.totalAreaSampledUnit ||
    h.geospatialScopeAreaValue != null ||
    h.geospatialScopeAreaUnit ||
    nonEmptyList(h.samplingPerformedBy).length > 0;
  if (!hasAny) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage
          id="humboldt.samplingEffort"
          defaultMessage="Sampling effort & extent"
        />
      }
    >
      <Properties breakpoint={800} className="[&>dt]:g-w-52 g-text-sm">
        {(h.samplingEffortValue != null || h.samplingEffortUnit) && (
          <Row label="humboldt.samplingEffort">
            {h.samplingEffortValue} {h.samplingEffortUnit}
          </Row>
        )}
        {(h.eventDurationValue != null || h.eventDurationUnit) && (
          <Row label="humboldt.eventDuration">
            {h.eventDurationValue} {h.eventDurationUnit}
          </Row>
        )}
        {h.siteCount != null && <Row label="humboldt.siteCount">{h.siteCount}</Row>}
        {(h.totalAreaSampledValue != null || h.totalAreaSampledUnit) && (
          <Row label="humboldt.totalAreaSampled">
            {h.totalAreaSampledValue} {h.totalAreaSampledUnit}
          </Row>
        )}
        {(h.geospatialScopeAreaValue != null || h.geospatialScopeAreaUnit) && (
          <Row label="humboldt.geospatialScopeArea">
            {h.geospatialScopeAreaValue} {h.geospatialScopeAreaUnit}
          </Row>
        )}
        {nonEmptyList(h.samplingPerformedBy).length > 0 && (
          <Row label="humboldt.samplingPerformedBy">
            {nonEmptyList(h.samplingPerformedBy).join(', ')}
          </Row>
        )}
      </Properties>
    </SubBlock>
  );
}

function Protocols({ h }: { h: Humboldt }) {
  const names = nonEmptyList(h.protocolNames);
  const descs = nonEmptyList(h.protocolDescriptions);
  const refs = nonEmptyList(h.protocolReferences);
  const completeness = nonEmptyList(h.taxonCompletenessProtocols);
  if (names.length + descs.length + refs.length + completeness.length === 0) return null;
  return (
    <SubBlock title={<FormattedMessage id="humboldt.protocols" defaultMessage="Protocols" />}>
      <Properties breakpoint={800} className="[&>dt]:g-w-52 g-text-sm">
        {names.length > 0 && <Row label="humboldt.protocolNames">{names.join(', ')}</Row>}
        {descs.length > 0 && (
          <Row label="humboldt.protocolDescriptions">
            <ul className="g-list-disc g-ms-5">
              {descs.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </Row>
        )}
        {refs.length > 0 && (
          <Row label="humboldt.protocolReferences">
            <ul className="g-list-disc g-ms-5">
              {refs.map((r, i) => (
                <li key={i}>
                  <a
                    href={r}
                    target="_blank"
                    rel="noreferrer"
                    className="g-text-primary g-underline g-break-all"
                  >
                    {r}
                  </a>
                </li>
              ))}
            </ul>
          </Row>
        )}
        {completeness.length > 0 && (
          <Row label="humboldt.taxonCompletenessProtocols">{completeness.join(', ')}</Row>
        )}
      </Properties>
    </SubBlock>
  );
}

function ScopeEntry({ scope }: { scope: Scope }) {
  const classification = (scope.classification ?? []).filter(
    (c): c is NonNullable<typeof c> => !!c
  );
  return (
    <div className="g-text-sm">
      {classification.length > 0 && (
        <ol className="g-flex g-flex-wrap g-gap-1 g-mb-1 g-text-xs g-text-slate-600">
          {classification.map((c, i) => (
            <li key={`${c.key}-${i}`} className="g-inline-flex g-items-center g-gap-1">
              {c.key ? (
                <DynamicLink
                  pageId="taxonKey"
                  variables={{ key: String(c.key) }}
                  className="g-text-primary hover:g-underline"
                >
                  {c.name}
                </DynamicLink>
              ) : (
                <span>{c.name}</span>
              )}
              {i < classification.length - 1 && <span className="g-text-slate-400">/</span>}
            </li>
          ))}
        </ol>
      )}
      <div>
        {scope.usageKey ? (
          <DynamicLink
            pageId="taxonKey"
            variables={{ key: String(scope.usageKey) }}
            className="g-font-semibold g-text-primary hover:g-underline"
          >
            {scope.usageName ?? scope.usageKey}
          </DynamicLink>
        ) : (
          <span className="g-font-semibold">{scope.usageName}</span>
        )}
        {scope.usageRank && (
          <span className="g-ms-2 g-text-xs g-text-slate-500 g-uppercase">{scope.usageRank}</span>
        )}
      </div>
    </div>
  );
}

function ScopeChip({ scope }: { scope: Scope }) {
  const label = scope.usageName ?? String(scope.usageKey ?? '');
  return scope.usageKey ? (
    <DynamicLink
      pageId="taxonKey"
      variables={{ key: String(scope.usageKey) }}
      className="g-inline-flex g-items-center g-bg-slate-100 hover:g-bg-slate-200 g-text-slate-700 g-text-xs g-rounded g-px-2 g-py-0.5"
    >
      {label}
    </DynamicLink>
  ) : (
    <span className="g-inline-flex g-items-center g-bg-slate-100 g-text-slate-700 g-text-xs g-rounded g-px-2 g-py-0.5">
      {label}
    </span>
  );
}

function nonEmptyScopes(arr?: ReadonlyArray<Scope | null> | null): Scope[] {
  return (arr ?? []).filter((s): s is Scope => !!s);
}

function TargetTaxonomicScope({ h }: { h: Humboldt }) {
  const scopes = nonEmptyScopes(h.targetTaxonomicScope);
  if (scopes.length === 0) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage
          id="humboldt.targetTaxonomicScope"
          defaultMessage="Target taxonomic scope"
        />
      }
    >
      <div className="g-space-y-3">
        {scopes.map((scope, i) => (
          <ScopeEntry key={`${scope.usageKey}-${i}`} scope={scope} />
        ))}
      </div>
    </SubBlock>
  );
}

function ScopeChipRow({ label, scopes }: { label: React.ReactNode; scopes: Scope[] }) {
  if (scopes.length === 0) return null;
  return (
    <div>
      <div className="g-text-sm g-font-semibold g-text-slate-600 g-mb-1">{label}</div>
      <div className="g-flex g-flex-wrap g-gap-1">
        {scopes.map((s, i) => (
          <ScopeChip key={`${s.usageKey}-${i}`} scope={s} />
        ))}
      </div>
    </div>
  );
}

function ExcludedNonTargetAbsent({ h }: { h: Humboldt }) {
  const excluded = nonEmptyScopes(h.excludedTaxonomicScope);
  const nonTarget = nonEmptyScopes(h.nonTargetTaxa);
  const absent = nonEmptyScopes(h.absentTaxa);
  if (excluded.length + nonTarget.length + absent.length === 0) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage
          id="humboldt.taxaCoverage"
          defaultMessage="Excluded / non-target / absent taxa"
        />
      }
    >
      <div className="g-space-y-4">
        <ScopeChipRow
          label={<FormattedMessage id="humboldt.excludedTaxa" defaultMessage="Excluded" />}
          scopes={excluded}
        />
        <ScopeChipRow
          label={<FormattedMessage id="humboldt.nonTargetTaxa" defaultMessage="Non-target" />}
          scopes={nonTarget}
        />
        <ScopeChipRow
          label={<FormattedMessage id="humboldt.absentTaxa" defaultMessage="Absent" />}
          scopes={absent}
        />
      </div>
    </SubBlock>
  );
}

function ChipGroup({ label, items }: { label: React.ReactNode; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="g-text-xs g-font-semibold g-uppercase g-text-slate-500 g-mb-1">
        {label}
      </div>
      <div className="g-flex g-flex-wrap g-gap-1">
        {items.map((x, i) => (
          <span
            key={i}
            className="g-inline-flex g-items-center g-bg-slate-100 g-text-slate-700 g-text-xs g-rounded g-px-2 g-py-0.5"
          >
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScopeChips({ h }: { h: Humboldt }) {
  const targets = {
    growthForm: nonEmptyList(h.targetGrowthFormScope),
    habitat: nonEmptyList(h.targetHabitatScope),
    lifeStage: nonEmptyList(h.targetLifeStageScope),
    establishment: nonEmptyList(h.targetDegreeOfEstablishmentScope),
  };
  const excluded = {
    growthForm: nonEmptyList(h.excludedGrowthFormScope),
    habitat: nonEmptyList(h.excludedHabitatScope),
    lifeStage: nonEmptyList(h.excludedLifeStageScope),
    establishment: nonEmptyList(h.excludedDegreeOfEstablishmentScope),
  };
  const hasTarget = Object.values(targets).some((a) => a.length > 0);
  const hasExcluded = Object.values(excluded).some((a) => a.length > 0);
  if (!hasTarget && !hasExcluded) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage id="humboldt.scope" defaultMessage="Target / excluded scope" />
      }
    >
      <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
        {hasTarget && (
          <div className="g-space-y-3">
            <div className="g-text-sm g-font-semibold g-text-slate-600">
              <FormattedMessage id="humboldt.target" defaultMessage="Target" />
            </div>
            <ChipGroup
              label={
                <FormattedMessage id="humboldt.growthForm" defaultMessage="Growth form" />
              }
              items={targets.growthForm}
            />
            <ChipGroup
              label={<FormattedMessage id="humboldt.habitat" defaultMessage="Habitat" />}
              items={targets.habitat}
            />
            <ChipGroup
              label={<FormattedMessage id="humboldt.lifeStage" defaultMessage="Life stage" />}
              items={targets.lifeStage}
            />
            <ChipGroup
              label={
                <FormattedMessage
                  id="humboldt.degreeOfEstablishment"
                  defaultMessage="Degree of establishment"
                />
              }
              items={targets.establishment}
            />
          </div>
        )}
        {hasExcluded && (
          <div className="g-space-y-3">
            <div className="g-text-sm g-font-semibold g-text-slate-600">
              <FormattedMessage id="humboldt.excluded" defaultMessage="Excluded" />
            </div>
            <ChipGroup
              label={
                <FormattedMessage id="humboldt.growthForm" defaultMessage="Growth form" />
              }
              items={excluded.growthForm}
            />
            <ChipGroup
              label={<FormattedMessage id="humboldt.habitat" defaultMessage="Habitat" />}
              items={excluded.habitat}
            />
            <ChipGroup
              label={<FormattedMessage id="humboldt.lifeStage" defaultMessage="Life stage" />}
              items={excluded.lifeStage}
            />
            <ChipGroup
              label={
                <FormattedMessage
                  id="humboldt.degreeOfEstablishment"
                  defaultMessage="Degree of establishment"
                />
              }
              items={excluded.establishment}
            />
          </div>
        )}
      </div>
    </SubBlock>
  );
}

function VouchersMaterialSamples({ h }: { h: Humboldt }) {
  const vouchers = nonEmptyList(h.voucherInstitutions);
  const materials = nonEmptyList(h.materialSampleTypes);
  const hasAny =
    h.hasVouchers != null || h.hasMaterialSamples != null || vouchers.length + materials.length > 0;
  if (!hasAny) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage
          id="humboldt.vouchersMaterials"
          defaultMessage="Vouchers & material samples"
        />
      }
    >
      <Properties breakpoint={800} className="[&>dt]:g-w-52 g-text-sm">
        {h.hasVouchers != null && (
          <Row label="humboldt.hasVouchers">{h.hasVouchers ? 'Yes' : 'No'}</Row>
        )}
        {vouchers.length > 0 && (
          <Row label="humboldt.voucherInstitutions">{vouchers.join(', ')}</Row>
        )}
        {h.hasMaterialSamples != null && (
          <Row label="humboldt.hasMaterialSamples">{h.hasMaterialSamples ? 'Yes' : 'No'}</Row>
        )}
        {materials.length > 0 && (
          <Row label="humboldt.materialSampleTypes">{materials.join(', ')}</Row>
        )}
      </Properties>
    </SubBlock>
  );
}

function InventoryAbundance({ h }: { h: Humboldt }) {
  const inv = nonEmptyList(h.inventoryTypes);
  const compTypes = nonEmptyList(h.compilationTypes);
  const compSrc = nonEmptyList(h.compilationSourceTypes);
  const hasAny =
    inv.length + compTypes.length + compSrc.length > 0 ||
    h.abundanceCap != null ||
    h.hasNonTargetOrganisms != null ||
    h.hasNonTargetTaxa != null ||
    h.areNonTargetTaxaFullyReported != null;
  if (!hasAny) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage
          id="humboldt.inventoryAbundance"
          defaultMessage="Inventory & abundance"
        />
      }
    >
      <Properties breakpoint={800} className="[&>dt]:g-w-52 g-text-sm">
        {inv.length > 0 && <Row label="humboldt.inventoryTypes">{inv.join(', ')}</Row>}
        {compTypes.length > 0 && (
          <Row label="humboldt.compilationTypes">{compTypes.join(', ')}</Row>
        )}
        {compSrc.length > 0 && (
          <Row label="humboldt.compilationSourceTypes">{compSrc.join(', ')}</Row>
        )}
        {h.abundanceCap != null && <Row label="humboldt.abundanceCap">{h.abundanceCap}</Row>}
        {h.hasNonTargetOrganisms != null && (
          <Row label="humboldt.hasNonTargetOrganisms">
            {h.hasNonTargetOrganisms ? 'Yes' : 'No'}
          </Row>
        )}
        {h.hasNonTargetTaxa != null && (
          <Row label="humboldt.hasNonTargetTaxa">{h.hasNonTargetTaxa ? 'Yes' : 'No'}</Row>
        )}
        {h.areNonTargetTaxaFullyReported != null && (
          <Row label="humboldt.areNonTargetTaxaFullyReported">
            {h.areNonTargetTaxaFullyReported ? 'Yes' : 'No'}
          </Row>
        )}
      </Properties>
    </SubBlock>
  );
}

function VerbatimSiteInfo({ h }: { h: Humboldt }) {
  const names = nonEmptyList(h.verbatimSiteNames);
  const descs = nonEmptyList(h.verbatimSiteDescriptions);
  if (names.length + descs.length === 0) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage id="humboldt.verbatimSite" defaultMessage="Verbatim site info" />
      }
    >
      <Properties breakpoint={800} className="[&>dt]:g-w-52 g-text-sm">
        {names.length > 0 && <Row label="humboldt.verbatimSiteNames">{names.join(', ')}</Row>}
        {descs.length > 0 && (
          <Row label="humboldt.verbatimSiteDescriptions">
            <ul className="g-list-disc g-ms-5">
              {descs.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </Row>
        )}
      </Properties>
    </SubBlock>
  );
}

function ReportingPill({ label, value }: { label: React.ReactNode; value: boolean | null | undefined }) {
  if (value == null) return null;
  return (
    <span
      className={
        'g-inline-flex g-items-center g-text-xs g-rounded g-px-2 g-py-0.5 ' +
        (value
          ? 'g-bg-green-50 g-text-green-700 g-border g-border-green-200'
          : 'g-bg-slate-100 g-text-slate-600 g-border g-border-slate-200')
      }
    >
      {value ? '✓' : '✗'} <span className="g-ms-1">{label}</span>
    </span>
  );
}

function ReportingCompleteness({ h }: { h: Humboldt }) {
  const pills: Array<{ key: string; label: React.ReactNode; value: boolean | null | undefined }> = [
    {
      key: 'isAbsenceReported',
      label: <FormattedMessage id="humboldt.isAbsenceReported" defaultMessage="Absence" />,
      value: h.isAbsenceReported,
    },
    {
      key: 'isAbundanceReported',
      label: <FormattedMessage id="humboldt.isAbundanceReported" defaultMessage="Abundance" />,
      value: h.isAbundanceReported,
    },
    {
      key: 'isAbundanceCapReported',
      label: (
        <FormattedMessage id="humboldt.isAbundanceCapReported" defaultMessage="Abundance cap" />
      ),
      value: h.isAbundanceCapReported,
    },
    {
      key: 'isSamplingEffortReported',
      label: (
        <FormattedMessage
          id="humboldt.isSamplingEffortReported"
          defaultMessage="Sampling effort"
        />
      ),
      value: h.isSamplingEffortReported,
    },
    {
      key: 'isVegetationCoverReported',
      label: (
        <FormattedMessage
          id="humboldt.isVegetationCoverReported"
          defaultMessage="Vegetation cover"
        />
      ),
      value: h.isVegetationCoverReported,
    },
    {
      key: 'isTaxonomicScopeFullyReported',
      label: (
        <FormattedMessage
          id="humboldt.isTaxonomicScopeFullyReported"
          defaultMessage="Taxonomic scope fully"
        />
      ),
      value: h.isTaxonomicScopeFullyReported,
    },
    {
      key: 'isGrowthFormScopeFullyReported',
      label: (
        <FormattedMessage
          id="humboldt.isGrowthFormScopeFullyReported"
          defaultMessage="Growth form fully"
        />
      ),
      value: h.isGrowthFormScopeFullyReported,
    },
    {
      key: 'isLifeStageScopeFullyReported',
      label: (
        <FormattedMessage
          id="humboldt.isLifeStageScopeFullyReported"
          defaultMessage="Life stage fully"
        />
      ),
      value: h.isLifeStageScopeFullyReported,
    },
    {
      key: 'isDegreeOfEstablishmentScopeFullyReported',
      label: (
        <FormattedMessage
          id="humboldt.isDegreeOfEstablishmentScopeFullyReported"
          defaultMessage="Establishment fully"
        />
      ),
      value: h.isDegreeOfEstablishmentScopeFullyReported,
    },
    {
      key: 'isLeastSpecificTargetCategoryQuantityInclusive',
      label: (
        <FormattedMessage
          id="humboldt.isLeastSpecificTargetCategoryQuantityInclusive"
          defaultMessage="Least-specific target inclusive"
        />
      ),
      value: h.isLeastSpecificTargetCategoryQuantityInclusive,
    },
  ].filter((p) => p.value != null);
  if (pills.length === 0) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage
          id="humboldt.reportingCompleteness"
          defaultMessage="Reporting completeness"
        />
      }
    >
      <div className="g-flex g-flex-wrap g-gap-1.5">
        {pills.map((p) => (
          <ReportingPill key={p.key} label={p.label} value={p.value} />
        ))}
      </div>
    </SubBlock>
  );
}
