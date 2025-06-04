import { HyperText } from '@/components/hyperText';
import Properties, { Term, Value } from '@/components/properties';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export function TaxonomicCoverages({ dataset, taxonomicCoverages, ...props }) {
  return (
    <>
      {taxonomicCoverages.map((coverage, idx) => (
        <TaxonomicCoverage coverage={coverage} key={idx} />
      ))}
    </>
  );
}

function TaxonomicCoverage({ coverage }) {
  // I really dislike "show all"-buttons that only show me one more item. Just show the damn item to begin with then. It is such a disappointing experience.
  // So instead we do: if less than 10 items then show them all. If above 10, then show 5 + expand button.
  // then it feels like you are rewarded for your action
  const [threshold, setThreshold] = useState(5);
  const coverages =
    coverage.coverages.length < 10 ? coverage.coverages : coverage.coverages.slice(0, threshold);
  const hasHidden = coverage.coverages.length > coverages.length;

  return (
    <Properties className="g-mb-2 [p]:g-mt-0" useDefaultTermWidths>
      {coverage.description && (
        <>
          <Term>
            <FormattedMessage id="dataset.description" />
          </Term>
          <Value>
            <HyperText className="g-prose" text={coverage.description} />
          </Value>
        </>
      )}

      <Term>
        <FormattedMessage id="dataset.coverage" />
      </Term>
      <Value>
        {coverages.map((c, i) => (
          <CoverageItem key={i} item={c} previousItem={coverage.coverages[i - 1]} />
        ))}
        {hasHidden && (
          <>
            <br />
            <Button onClick={() => setThreshold(500)}>
              <FormattedMessage id="phrases.showAll" />
            </Button>
          </>
        )}
      </Value>
    </Properties>
  );
}

function CoverageItem({ item, previousItem }) {
  return (
    <>
      {/* Assuming that taxa is ordered by rank, then a simple way to add some ordering is to add a line break when rank changes */}
      {previousItem && previousItem?.rank?.interpreted !== item?.rank?.interpreted && <br />}
      <span className="g-m-1 g-p-1 g-px-2 g-border g-border-solid g-inline-block g-bg-slate-50">
        <span>{item.scientificName}</span>
        {item.commonName && <span className="g-text-slate-500 g-ms-2">{item.commonName}</span>}
      </span>
    </>
  );
}
