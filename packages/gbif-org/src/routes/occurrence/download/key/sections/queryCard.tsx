import { BulletList } from '@/components/bulletList';
import Properties from '@/components/properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import Base64JsonParam from '@/dataManagement/filterAdapter/useFilterParams';
import { DownloadKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { BasicField } from '@/routes/occurrence/key/properties';
import { useFilters } from '@/routes/occurrence/search/filters';
import { searchConfig } from '@/routes/occurrence/search/searchConfig';
import { ParamQuery } from '@/utils/querystring';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PredicateDisplay } from '../predicate';
import { getPredicateAsFilter } from './getPredicateAsFilter';

export function QueryCard({ download }: { download: DownloadKeyQuery['download'] }) {
  const { filters } = useFilters({ searchConfig });
  const [query, setQuery] = useState<ParamQuery>();
  const parameters = download?.request?.gbifMachineDescription?.parameters;

  useEffect(() => {
    if (!download?.request?.predicate) return;

    const { error, filter } = getPredicateAsFilter({
      predicate: download?.request?.predicate,
      filters,
    });
    if (!error && filter) {
      const { filter: v1Filter, errors: tooComplexError } = filter2v1(filter, searchConfig);
      if (tooComplexError) {
        // if we cannot serialize the filter to version 1 API, then just serialize the json and put it in the filter param
        setQuery({ filter: Base64JsonParam.encode(filter) });
      } else {
        setQuery(v1Filter);
      }
    } else {
      setQuery(undefined);
    }
  }, [download, setQuery]);

  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle className="g-flex g-items-center g-gap-4">
          <span className="g-py-1">
            <FormattedMessage id="downloadKey.query" />
          </span>
          {query && (
            <Button asChild variant="primaryOutline" size="sm">
              <DynamicLink pageId="occurrenceSearch" searchParams={query}>
                <FormattedMessage id="downloadKey.rerunQuery" />
              </DynamicLink>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      {parameters && (
        <CardContent>
          <div>
            <div className="g-mb-8">
              <FormattedMessage id="customSqlDownload.sqlMachineDescriptionIntro" />
            </div>
            <Properties breakpoint={800} className="[&>dt]:g-w-52">
              {parameters?.taxonomy && (
                <BasicField label="customSqlDownload.taxonomicDimension">
                  <FormattedMessage id={`customSqlDownload.taxon.${parameters.taxonomy}`} />
                </BasicField>
              )}
              {parameters?.temporal && (
                <BasicField label="customSqlDownload.temporalDimension">
                  <FormattedMessage id={`customSqlDownload.time.${parameters.temporal}`} />
                </BasicField>
              )}
              {parameters?.spatial && (
                <BasicField label="customSqlDownload.spatialDimension">
                  <FormattedMessage id={`customSqlDownload.grid.${parameters.spatial}`} />
                </BasicField>
              )}
              {parameters?.resolution && (
                <BasicField label="customSqlDownload.spatialResolution">
                  <FormattedMessage
                    id={`customSqlDownload.resolution.${parameters.spatial}.${parameters.resolution}`}
                  />
                </BasicField>
              )}
              {parameters?.randomize && (
                <BasicField label="customSqlDownload.randomPoints">
                  <FormattedMessage id={`customSqlDownload.boolean.${parameters.randomize}`} />
                </BasicField>
              )}
              {parameters?.higherGroups && (
                <BasicField label="customSqlDownload.countHigherTaxonomy">
                  <BulletList>
                    {parameters.higherGroups.map((group) => (
                      <li key={group}>
                        <FormattedMessage id={`customSqlDownload.taxon.${group}`} />
                      </li>
                    ))}
                  </BulletList>
                </BasicField>
              )}
              {parameters?.includeSpatialUncertainty && (
                <BasicField label="customSqlDownload.coordinateUncertainty">
                  <FormattedMessage
                    id={`customSqlDownload.boolean.${parameters.includeSpatialUncertainty}`}
                  />
                </BasicField>
              )}
              {parameters?.randomize && (
                <BasicField label="customSqlDownload.randomPoints">
                  <FormattedMessage id={`customSqlDownload.boolean.${parameters.randomize}`} />
                </BasicField>
              )}
            </Properties>
          </div>
        </CardContent>
      )}
      <CardContent className="g-border-t g-border-gray-200 g-pt-4 md:g-pt-8 g-overflow-auto">
        <DownloadFilterSummary download={download} />
      </CardContent>
    </Card>
  );
}

export function DownloadFilterSummary({ download }: { download: DownloadKeyQuery['download'] }) {
  if (!download?.request) return null;
  return (
    <>
      {download?.request?.gbifMachineDescription?.parameters?.predicate && (
        <div className="gbif-predicates g-min-w-[500px]">
          <PredicateDisplay
            predicate={download?.request?.gbifMachineDescription.parameters.predicate}
          />
        </div>
      )}
      {download?.request?.predicate && (
        <div className="gbif-predicates g-min-w-[500px]">
          <PredicateDisplay predicate={download?.request?.predicate} />
        </div>
      )}
      {!download?.request?.predicate && !download?.request?.sql && (
        <div className="g-text-slate-600">
          <FormattedMessage id="downloadKey.noFiltersApplied" />
        </div>
      )}
      {download?.request?.sql && (
        <div className="g-text-sm">
          <pre
            className="g-max-full g-overflow-auto gbif-sqlInput"
            dangerouslySetInnerHTML={{ __html: download?.request.sql }}
          />
        </div>
      )}
    </>
  );
}
