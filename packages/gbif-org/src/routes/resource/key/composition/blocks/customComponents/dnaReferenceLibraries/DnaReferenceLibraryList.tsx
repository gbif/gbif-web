import { TargetGeneLabel } from '@/components/filters/displayNames';
import { Suggest, SuggestionItem } from '@/components/filters/suggest';
import { Paging } from '@/components/paging';
import { Tag } from '@/components/resultCards';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useIntParam, useParam, useStringParam } from '@/hooks/useParam';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { cn } from '@/utils/shadcn';
import { taxonKeySuggest } from '@/utils/suggestEndpoints';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedNumber } from 'react-intl';
import { useDnaReferenceLibraries } from './useDnaReferenceLibraries';

const PAGE_SIZE = 20;

// Lists are kept in the URL as comma separated values, e.g. targetGene=COI,16S
const listParser = (value?: string) => (value ? value.split(',').filter(Boolean) : []);
const listSerializer = (value?: string[]) => (value ? value.join(',') : undefined);

// An empty list is written as undefined, which removes the param from the url.
const toListValue = (list: string[]) => (list.length > 0 ? list : undefined);

export function DnaReferenceLibraryList({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  // Search params go to the url, so a filtered view can be shared and bookmarked
  // replace: typing in the search box should not add a history entry per keystroke
  const [q, setQ] = useStringParam({ key: 'q', replace: true });
  const [taxonKeysParam, setTaxonKeys] = useParam<string[] | undefined>({
    key: 'taxonKey',
    parse: listParser,
    serialize: listSerializer,
  });
  const [selectedGenesParam, setSelectedGenes] = useParam<string[] | undefined>({
    key: 'targetGene',
    parse: listParser,
    serialize: listSerializer,
  });
  const taxonKeys = taxonKeysParam ?? [];
  const selectedGenes = selectedGenesParam ?? [];
  const [pageParam, setPage] = useIntParam({ key: 'page', defaultValue: 1 });
  // A non-numeric page in the url (e.g. page=abc) would be NaN, so fall back to the first page
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  // Changing a filter starts again from the first page. This runs in an effect, after the filter
  // is in the url, so the two url updates do not overwrite each other. The first render is skipped,
  // so a shared link with page=3 keeps its page.
  const filterKey = JSON.stringify([q ?? '', taxonKeys, selectedGenes]);
  const lastFilterKey = useRef(filterKey);
  useEffect(() => {
    if (lastFilterKey.current === filterKey) return;
    lastFilterKey.current = filterKey;
    if (pageParam !== 1) setPage(1);
  }, [filterKey, pageParam, setPage]);

  // Names of the taxa picked in this session. Taxon keys from the url are shown as keys.
  const [taxonNames, setTaxonNames] = useState<Record<string, string>>({});

  const { loading, error, truncated, targetGenes, datasets: loadedDatasets } =
    useDnaReferenceLibraries({ taxonKeys, targetGenes: selectedGenes });

  // Selected genes stay in the list, with a count of 0, even when the current taxon filter no
  // longer has them. Otherwise the filter could not be unchecked.
  const geneOptions = [
    ...targetGenes,
    ...selectedGenes
      .filter((gene) => !targetGenes.some((option) => option.key === gene))
      .map((gene) => ({ key: gene, count: 0 })),
  ];

  // Free text is filtered in the browser on title, description and publisher
  const datasets = useMemo(() => {
    const term = (q ?? '').trim().toLowerCase();
    return loadedDatasets
      .filter(
        (dataset) =>
          !term ||
          [
            dataset.title,
            // descriptions are HTML, match on the text only
            dataset.description?.replace(/<[^>]*>/g, ' '),
            dataset.excerpt,
            dataset.publishingOrganizationTitle,
          ].some((value) => value?.toLowerCase().includes(term))
      )
      .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
  }, [loadedDatasets, q]);

  const totalPages = Math.max(1, Math.ceil(datasets.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageItems = datasets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleGene(gene: string, checked: boolean) {
    const next = checked
      ? [...selectedGenes, gene]
      : selectedGenes.filter((value) => value !== gene);
    setSelectedGenes(toListValue(next));
  }

  function addTaxon(item: SuggestionItem) {
    const key = String(item.key);
    if (taxonKeys.includes(key)) return;
    setTaxonNames((names) => ({ ...names, [key]: item.title ?? key }));
    setTaxonKeys(toListValue([...taxonKeys, key]));
  }

  function removeTaxon(key: string) {
    setTaxonKeys(toListValue(taxonKeys.filter((value) => value !== key)));
  }

  return (
    <div className={cn('g-max-w-full g-m-auto', className)}>
      {title && <h4 className="g-text-lg g-font-semibold g-mb-4">{title}</h4>}

      <div className="g-flex g-flex-col g-gap-4 g-mb-6">
        <Input
          type="search"
          value={q ?? ''}
          onChange={(event) => setQ(event.target.value || undefined)}
          placeholder="Search by title, description or publisher"
          aria-label="Search by title, description or publisher"
        />

        <div>
          <p className="g-font-semibold g-text-sm g-mb-2">Taxon</p>
          <Suggest
            onSelect={addTaxon}
            getSuggestions={taxonKeySuggest.getSuggestions}
            render={taxonKeySuggest.render}
            getStringValue={(item) => item.title ?? ''}
            selected={taxonKeys}
            placeholder="Search for a taxon"
            clearOnSelect
          />
          {taxonKeys.length > 0 && (
            <div className="g-flex g-flex-wrap g-gap-2 g-mt-2">
              {taxonKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="g-text-sm"
                  onClick={() => removeTaxon(key)}
                  aria-label={`Remove taxon ${taxonNames[key] ?? key}`}
                >
                  <Tag className="g-m-0 hover:g-bg-primary-200">{taxonNames[key] ?? key} ×</Tag>
                </button>
              ))}
            </div>
          )}
        </div>

        {geneOptions.length > 0 && (
          <div>
            <p className="g-font-semibold g-text-sm g-mb-2">Target gene</p>
            <div className="g-flex g-flex-wrap g-gap-x-6 g-gap-y-2">
              {geneOptions.map((gene) => (
                <label
                  key={gene.key}
                  className="g-flex g-items-center g-gap-2 g-text-sm g-cursor-pointer"
                >
                  <Checkbox
                    checked={selectedGenes.includes(gene.key)}
                    onCheckedChange={(checked) => toggleGene(gene.key, checked === true)}
                  />
                  <TargetGeneLabel id={gene.key} />
                  <span className="g-text-slate-500">
                    (<FormattedNumber value={gene.count} />)
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="g-prose">
          <p>Error loading data: {error.message}</p>
        </div>
      )}

      {loading && <CardListSkeleton />}

      {!loading && (
        <>
          {truncated && (
            <div className="g-prose">
              <p>Only the first results are shown, the list may be incomplete.</p>
            </div>
          )}
          <p className="g-text-sm g-text-slate-500 g-mb-4">
            <FormattedNumber value={datasets.length} /> datasets
          </p>

          {pageItems.map((dataset) => (
            <DatasetResult key={dataset.key} dataset={dataset} />
          ))}

          {datasets.length === 0 && !error && (
            <div className="g-prose">
              <p>No DNA reference libraries match these filters.</p>
            </div>
          )}

          {datasets.length > PAGE_SIZE && (
            <div className="g-flex g-p-4">
              <div className="g-flex-auto" />
              <Paging
                next={() => setPage(Math.min(totalPages, currentPage + 1))}
                prev={() => setPage(Math.max(1, currentPage - 1))}
                isFirstPage={currentPage === 1}
                isLastPage={currentPage >= totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
