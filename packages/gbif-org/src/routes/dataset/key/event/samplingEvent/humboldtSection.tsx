import Properties from '@/components/properties';
import { EventQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { Group } from '@/routes/occurrence/key/About/groups';
import { MdCheck, MdRemove } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

type Humboldt = NonNullable<NonNullable<NonNullable<EventQuery['event']>['humboldt']>[number]>;
type Scope = NonNullable<NonNullable<Humboldt['targetTaxonomicScope']>[number]>;

const HEI = 'occurrenceDetails.extensions.humboldtEcologicalInventory';
const hp = (k: string) => `${HEI}.properties.${k}`;
const hg = (k: string) => `${HEI}.groups.${k}`;

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
              id={`${HEI}.recordsHeader`}
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
                    <FormattedMessage id="eventDetails.record" defaultMessage="Record" />
                  )}
                  {h.targetTaxonomicScope?.[0]?.usageRank && (
                    <span className="g-ms-2 g-text-xs g-uppercase g-text-slate-400">
                      <FormattedMessage
                        id={`enums.taxonRank.${h.targetTaxonomicScope[0].usageRank}`}
                        defaultMessage={h.targetTaxonomicScope[0].usageRank}
                      />
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
      <ProtocolsBlock h={h} />
      <SamplingDesignBlock h={h} />
      <SpatialScopeBlock h={h} />
      <TemporalScopeBlock h={h} />
      <EffortBlock h={h} />
      <TaxonomicOrganismalScopeBlock h={h} />
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

function ScopeName({ scope }: { scope: Scope }) {
  // Strip authorship (everything after the first comma) from usageName so the
  // value cell stays compact — full authorship is rarely useful inline.
  const display = (scope.usageName ?? String(scope.usageKey ?? '')).split(',')[0].trim();
  return scope.usageKey ? (
    <DynamicLink
      pageId="taxonKey"
      variables={{ key: String(scope.usageKey) }}
      className="g-text-inherit g-underline"
    >
      {display}
    </DynamicLink>
  ) : (
    <span>{display}</span>
  );
}

function ScopeEntry({ scope }: { scope: Scope }) {
  const classification = (scope.classification ?? []).filter(
    (c): c is NonNullable<typeof c> => !!c
  );
  return (
    <div>
      <div>
        <ScopeName scope={scope} />
        {scope.usageRank && (
          <span className="g-ms-2 g-text-sm g-text-slate-500 g-uppercase">
            <FormattedMessage
              id={`enums.taxonRank.${scope.usageRank}`}
              defaultMessage={scope.usageRank}
            />
          </span>
        )}
      </div>
      {classification.length > 0 && (
        <div className="g-mt-0.5 g-text-sm g-text-slate-500">
          {classification.map((c, i) => (
            <span key={`${c.key}-${i}`}>
              {c.key ? (
                <DynamicLink
                  pageId="taxonKey"
                  variables={{ key: String(c.key) }}
                  className="g-text-inherit hover:g-underline"
                >
                  {c.name}
                </DynamicLink>
              ) : (
                <span>{c.name}</span>
              )}
              {i < classification.length - 1 && <span className="g-mx-1">/</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function nonEmptyScopes(arr?: ReadonlyArray<Scope | null> | null): Scope[] {
  return (arr ?? []).filter((s): s is Scope => !!s);
}

function ScopeNameList({ scopes }: { scopes: Scope[] }) {
  if (scopes.length === 0) return null;
  return (
    <span>
      {scopes.map((s, i) => (
        <span key={`${s.usageKey}-${i}`}>
          <ScopeName scope={s} />
          {i < scopes.length - 1 && <span className="g-text-slate-400">, </span>}
        </span>
      ))}
    </span>
  );
}

function ReportingPill({ label, value }: { label: React.ReactNode; value: boolean | null | undefined }) {
  if (value == null) return null;
  return (
    <span className="g-inline-flex g-items-center g-text-xs g-rounded g-ps-0.5 g-pe-2 g-py-0.5 g-bg-slate-100 g-text-slate-700 g-border g-border-slate-200">
      <span
        aria-hidden
        className={
          'g-inline-flex g-items-center g-justify-center g-w-4 g-h-4 g-rounded-full g-text-white g-me-1.5 ' +
          (value ? 'g-bg-green-600' : 'g-bg-red-500')
        }
      >
        {value ? <MdCheck size={10} /> : <MdRemove size={10} />}
      </span>
      {label}
    </span>
  );
}

type Pill = { key: string; label: React.ReactNode; value: boolean | null | undefined };

function PillRow({ pills }: { pills: Pill[] }) {
  const filtered = pills.filter((p) => p.value != null);
  if (filtered.length === 0) return null;
  return (
    <div className="g-flex g-flex-wrap g-gap-1.5">
      {filtered.map((p) => (
        <ReportingPill key={p.key} label={p.label} value={p.value} />
      ))}
    </div>
  );
}

function hasAny(values: Array<unknown>) {
  return values.some((v) => {
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  });
}

function ProtocolsBlock({ h }: { h: Humboldt }) {
  const names = nonEmptyList(h.protocolNames);
  const descs = nonEmptyList(h.protocolDescriptions);
  const refs = nonEmptyList(h.protocolReferences);
  const materials = nonEmptyList(h.materialSampleTypes);
  const vouchers = nonEmptyList(h.voucherInstitutions);
  const inv = nonEmptyList(h.inventoryTypes);
  const compTypes = nonEmptyList(h.compilationTypes);
  const compSrc = nonEmptyList(h.compilationSourceTypes);
  const pills: Pill[] = [
    {
      key: 'isAbundanceReported',
      label: <FormattedMessage id={hp('isAbundanceReported')} defaultMessage="Abundance reported" />,
      value: h.isAbundanceReported,
    },
    {
      key: 'isAbundanceCapReported',
      label: (
        <FormattedMessage
          id={hp('isAbundanceCapReported')}
          defaultMessage="Abundance cap reported"
        />
      ),
      value: h.isAbundanceCapReported,
    },
    {
      key: 'isLeastSpecificTargetCategoryQuantityInclusive',
      label: (
        <FormattedMessage
          id={hp('isLeastSpecificTargetCategoryQuantityInclusive')}
          defaultMessage="Least-specific target inclusive"
        />
      ),
      value: h.isLeastSpecificTargetCategoryQuantityInclusive,
    },
    {
      key: 'isVegetationCoverReported',
      label: (
        <FormattedMessage
          id={hp('isVegetationCoverReported')}
          defaultMessage="Vegetation cover reported"
        />
      ),
      value: h.isVegetationCoverReported,
    },
    {
      key: 'hasMaterialSamples',
      label: (
        <FormattedMessage id={hp('hasMaterialSamples')} defaultMessage="Material samples" />
      ),
      value: h.hasMaterialSamples,
    },
    {
      key: 'hasVouchers',
      label: <FormattedMessage id={hp('hasVouchers')} defaultMessage="Vouchers" />,
      value: h.hasVouchers,
    },
  ];
  const show =
    hasAny([names, descs, refs, materials, vouchers, inv, compTypes, compSrc, h.abundanceCap]) ||
    pills.some((p) => p.value != null);
  if (!show) return null;
  return (
    <SubBlock title={<FormattedMessage id={hg('protocols')} defaultMessage="Protocols" />}>
      <div className="g-space-y-3">
        <Properties breakpoint={800} className="[&>dt]:g-w-52">
          {names.length > 0 && <Row label={hp('protocolNames')}>{names.join(', ')}</Row>}
          {descs.length > 0 && (
            <Row label={hp('protocolDescriptions')}>
              {descs.length === 1 ? (
                descs[0]
              ) : (
                <ul className="g-list-disc g-ms-5">
                  {descs.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </Row>
          )}
          {refs.length > 0 && (
            <Row label={hp('protocolReferences')}>
              {refs.length === 1 ? (
                <a
                  href={refs[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="g-text-inherit g-underline g-break-all"
                >
                  {refs[0]}
                </a>
              ) : (
                <ul className="g-list-disc g-ms-5">
                  {refs.map((r, i) => (
                    <li key={i}>
                      <a
                        href={r}
                        target="_blank"
                        rel="noreferrer"
                        className="g-text-inherit g-underline g-break-all"
                      >
                        {r}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Row>
          )}
          {h.abundanceCap != null && <Row label={hp('abundanceCap')}>{h.abundanceCap}</Row>}
          {materials.length > 0 && (
            <Row label={hp('materialSampleTypes')}>{materials.join(', ')}</Row>
          )}
          {vouchers.length > 0 && (
            <Row label={hp('voucherInstitutions')}>{vouchers.join(', ')}</Row>
          )}
          {inv.length > 0 && <Row label={hp('inventoryTypes')}>{inv.join(', ')}</Row>}
          {compTypes.length > 0 && (
            <Row label={hp('compilationTypes')}>{compTypes.join(', ')}</Row>
          )}
          {compSrc.length > 0 && (
            <Row label={hp('compilationSourceTypes')}>{compSrc.join(', ')}</Row>
          )}
        </Properties>
        <PillRow pills={pills} />
      </div>
    </SubBlock>
  );
}

function SamplingDesignBlock({ h }: { h: Humboldt }) {
  const names = nonEmptyList(h.verbatimSiteNames);
  const descs = nonEmptyList(h.verbatimSiteDescriptions);
  if (!hasAny([h.siteCount, names, descs])) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage id={hg('samplingDesign')} defaultMessage="Sampling design" />
      }
    >
      <Properties breakpoint={800} className="[&>dt]:g-w-52">
        {h.siteCount != null && <Row label={hp('siteCount')}>{h.siteCount}</Row>}
        {names.length > 0 && <Row label={hp('verbatimSiteNames')}>{names.join(', ')}</Row>}
        {descs.length > 0 && (
          <Row label={hp('verbatimSiteDescriptions')}>
            {descs.length === 1 ? (
              descs[0]
            ) : (
              <ul className="g-list-disc g-ms-5">
                {descs.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </Row>
        )}
      </Properties>
    </SubBlock>
  );
}

function SpatialScopeBlock({ h }: { h: Humboldt }) {
  const targetHabitat = nonEmptyList(h.targetHabitatScope);
  const excludedHabitat = nonEmptyList(h.excludedHabitatScope);
  const hasArea =
    h.geospatialScopeAreaValue != null ||
    h.geospatialScopeAreaUnit ||
    h.totalAreaSampledValue != null ||
    h.totalAreaSampledUnit;
  if (!hasArea && targetHabitat.length + excludedHabitat.length === 0) return null;
  return (
    <SubBlock
      title={<FormattedMessage id={hg('spatialScope')} defaultMessage="Spatial scope" />}
    >
      <Properties breakpoint={800} className="[&>dt]:g-w-52">
        {(h.geospatialScopeAreaValue != null || h.geospatialScopeAreaUnit) && (
          <Row label={hp('geospatialScopeArea')}>
            {h.geospatialScopeAreaValue} {h.geospatialScopeAreaUnit}
          </Row>
        )}
        {(h.totalAreaSampledValue != null || h.totalAreaSampledUnit) && (
          <Row label={hp('totalAreaSampled')}>
            {h.totalAreaSampledValue} {h.totalAreaSampledUnit}
          </Row>
        )}
        {targetHabitat.length > 0 && (
          <Row label={hp('targetHabitatScope')}>{targetHabitat.join(', ')}</Row>
        )}
        {excludedHabitat.length > 0 && (
          <Row label={hp('excludedHabitatScope')}>{excludedHabitat.join(', ')}</Row>
        )}
      </Properties>
    </SubBlock>
  );
}

function TemporalScopeBlock({ h }: { h: Humboldt }) {
  if (h.eventDurationValue == null && !h.eventDurationUnit) return null;
  return (
    <SubBlock
      title={<FormattedMessage id={hg('temporalScope')} defaultMessage="Temporal scope" />}
    >
      <Properties breakpoint={800} className="[&>dt]:g-w-52">
        <Row label={hp('eventDuration')}>
          {h.eventDurationValue} {h.eventDurationUnit}
        </Row>
      </Properties>
    </SubBlock>
  );
}

function EffortBlock({ h }: { h: Humboldt }) {
  const performedBy = nonEmptyList(h.samplingPerformedBy);
  const hasEffort =
    h.samplingEffortValue != null || h.samplingEffortUnit || performedBy.length > 0;
  const pills: Pill[] = [
    {
      key: 'isSamplingEffortReported',
      label: (
        <FormattedMessage
          id={hp('isSamplingEffortReported')}
          defaultMessage="Sampling effort reported"
        />
      ),
      value: h.isSamplingEffortReported,
    },
  ];
  if (!hasEffort && pills.every((p) => p.value == null)) return null;
  return (
    <SubBlock title={<FormattedMessage id={hg('effort')} defaultMessage="Effort" />}>
      <div className="g-space-y-3">
        {hasEffort && (
          <Properties breakpoint={800} className="[&>dt]:g-w-52">
            {(h.samplingEffortValue != null || h.samplingEffortUnit) && (
              <Row label={hp('samplingEffort')}>
                {h.samplingEffortValue} {h.samplingEffortUnit}
              </Row>
            )}
            {performedBy.length > 0 && (
              <Row label={hp('samplingPerformedBy')}>{performedBy.join(', ')}</Row>
            )}
          </Properties>
        )}
        <PillRow pills={pills} />
      </div>
    </SubBlock>
  );
}

function TaxonomicOrganismalScopeBlock({ h }: { h: Humboldt }) {
  const targets = nonEmptyScopes(h.targetTaxonomicScope);
  const excluded = nonEmptyScopes(h.excludedTaxonomicScope);
  const absent = nonEmptyScopes(h.absentTaxa);
  const nonTarget = nonEmptyScopes(h.nonTargetTaxa);
  const completenessProtocols = nonEmptyList(h.taxonCompletenessProtocols);
  const targetEstablishment = nonEmptyList(h.targetDegreeOfEstablishmentScope);
  const excludedEstablishment = nonEmptyList(h.excludedDegreeOfEstablishmentScope);
  const targetGrowthForm = nonEmptyList(h.targetGrowthFormScope);
  const excludedGrowthForm = nonEmptyList(h.excludedGrowthFormScope);
  const targetLifeStage = nonEmptyList(h.targetLifeStageScope);
  const excludedLifeStage = nonEmptyList(h.excludedLifeStageScope);
  const pills: Pill[] = [
    {
      key: 'isAbsenceReported',
      label: (
        <FormattedMessage id={hp('isAbsenceReported')} defaultMessage="Absence reported" />
      ),
      value: h.isAbsenceReported,
    },
    {
      key: 'isTaxonomicScopeFullyReported',
      label: (
        <FormattedMessage
          id={hp('isTaxonomicScopeFullyReported')}
          defaultMessage="Taxonomic scope fully reported"
        />
      ),
      value: h.isTaxonomicScopeFullyReported,
    },
    {
      key: 'hasNonTargetTaxa',
      label: (
        <FormattedMessage id={hp('hasNonTargetTaxa')} defaultMessage="Non-target taxa" />
      ),
      value: h.hasNonTargetTaxa,
    },
    {
      key: 'areNonTargetTaxaFullyReported',
      label: (
        <FormattedMessage
          id={hp('areNonTargetTaxaFullyReported')}
          defaultMessage="Non-target taxa fully reported"
        />
      ),
      value: h.areNonTargetTaxaFullyReported,
    },
    {
      key: 'hasNonTargetOrganisms',
      label: (
        <FormattedMessage
          id={hp('hasNonTargetOrganisms')}
          defaultMessage="Non-target organisms"
        />
      ),
      value: h.hasNonTargetOrganisms,
    },
    {
      key: 'isDegreeOfEstablishmentScopeFullyReported',
      label: (
        <FormattedMessage
          id={hp('isDegreeOfEstablishmentScopeFullyReported')}
          defaultMessage="Establishment fully reported"
        />
      ),
      value: h.isDegreeOfEstablishmentScopeFullyReported,
    },
    {
      key: 'isGrowthFormScopeFullyReported',
      label: (
        <FormattedMessage
          id={hp('isGrowthFormScopeFullyReported')}
          defaultMessage="Growth form fully reported"
        />
      ),
      value: h.isGrowthFormScopeFullyReported,
    },
    {
      key: 'isLifeStageScopeFullyReported',
      label: (
        <FormattedMessage
          id={hp('isLifeStageScopeFullyReported')}
          defaultMessage="Life stage fully reported"
        />
      ),
      value: h.isLifeStageScopeFullyReported,
    },
  ];
  const show =
    targets.length +
      excluded.length +
      absent.length +
      nonTarget.length +
      completenessProtocols.length +
      targetEstablishment.length +
      excludedEstablishment.length +
      targetGrowthForm.length +
      excludedGrowthForm.length +
      targetLifeStage.length +
      excludedLifeStage.length >
      0 || pills.some((p) => p.value != null);
  if (!show) return null;
  return (
    <SubBlock
      title={
        <FormattedMessage
          id={hg('taxonomicOrganismalScope')}
          defaultMessage="Taxonomic & organismal scope"
        />
      }
    >
      <div className="g-space-y-3">
        <Properties breakpoint={800} className="[&>dt]:g-w-52">
          {targets.length > 0 && (
            <Row label={hp('targetTaxonomicScope')}>
              <div className="g-space-y-2">
                {targets.map((scope, i) => (
                  <ScopeEntry key={`${scope.usageKey}-${i}`} scope={scope} />
                ))}
              </div>
            </Row>
          )}
          {excluded.length > 0 && (
            <Row label={hp('excludedTaxonomicScope')}>
              <ScopeNameList scopes={excluded} />
            </Row>
          )}
          {absent.length > 0 && (
            <Row label={hp('absentTaxa')}>
              <ScopeNameList scopes={absent} />
            </Row>
          )}
          {nonTarget.length > 0 && (
            <Row label={hp('nonTargetTaxa')}>
              <ScopeNameList scopes={nonTarget} />
            </Row>
          )}
          {completenessProtocols.length > 0 && (
            <Row label={hp('taxonCompletenessProtocols')}>
              {completenessProtocols.join(', ')}
            </Row>
          )}
          {targetEstablishment.length > 0 && (
            <Row label={hp('targetDegreeOfEstablishmentScope')}>
              {targetEstablishment.join(', ')}
            </Row>
          )}
          {excludedEstablishment.length > 0 && (
            <Row label={hp('excludedDegreeOfEstablishmentScope')}>
              {excludedEstablishment.join(', ')}
            </Row>
          )}
          {targetGrowthForm.length > 0 && (
            <Row label={hp('targetGrowthFormScope')}>{targetGrowthForm.join(', ')}</Row>
          )}
          {excludedGrowthForm.length > 0 && (
            <Row label={hp('excludedGrowthFormScope')}>{excludedGrowthForm.join(', ')}</Row>
          )}
          {targetLifeStage.length > 0 && (
            <Row label={hp('targetLifeStageScope')}>{targetLifeStage.join(', ')}</Row>
          )}
          {excludedLifeStage.length > 0 && (
            <Row label={hp('excludedLifeStageScope')}>{excludedLifeStage.join(', ')}</Row>
          )}
        </Properties>
        <PillRow pills={pills} />
      </div>
    </SubBlock>
  );
}
