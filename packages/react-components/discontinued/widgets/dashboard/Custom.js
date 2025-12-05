import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { Card, CardTitle } from './shared';
import { GroupBy, Pagging, useFacets } from './charts/GroupByTable';
import { Classification, DropdownButton, Tooltip } from '../../components';
import { useIntl, FormattedMessage } from 'react-intl';
import ChartClickWrapper from './charts/ChartClickWrapper';

const majorRanks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
function TaxaMain({
  predicate,
  handleRedirect,
  detailsRoute,
  visibilityThreshold,
  interactive,
  ...props
}) {
  const [query, setQuery] = useState(getTaxonQuery('familyKey'));
  const [rank, setRank] = useState('FAMILY');
  const facetResults = useFacets({ predicate, query });
  
  if (facetResults?.data?.search?.facet?.results?.length <= visibilityThreshold) return null;

  return <Card {...props}>
    <CardTitle options={<DropdownButton
      look="primaryOutline"
      menuItems={menuState => majorRanks.map(rank => <DropdownButton.MenuAction onClick={e => { setRank(rank); setQuery(getTaxonQuery(`${rank}Key`)); menuState.hide() }}>
        <FormattedMessage id={`enums.taxonRank.${rank.toUpperCase()}`} defaultMessage={rank} />
      </DropdownButton.MenuAction>)}>
    </DropdownButton>}>
      <FormattedMessage id={`enums.taxonRank.${rank.toUpperCase()}`} defaultMessage={rank} />
    </CardTitle>
    <GroupBy {...{
      facetResults,
      interactive,
      onClick: handleRedirect,
      transform: data => {
        return data?.search?.facet?.results?.map(x => {
          return {
            key: x.key,
            title: x?.entity?.title,
            count: x.count,
            filter: { taxonKey: [x.key] },
            description: <Classification>
              {majorRanks.map(rank => {
                if (!x?.entity?.[rank]) return null;
                return <span key={rank}>{x?.entity?.[rank]}</span>
              })}
            </Classification>
          }
        });
      }
    }} />
    <Pagging facetResults={facetResults} />
  </Card>
};

export function Taxa(props) {
  return <ChartClickWrapper {...props}>
    <TaxaMain />
  </ChartClickWrapper>
}

const getTaxonQuery = rank => `
query summary($predicate: Predicate, $size: Int, $from: Int){
  search: occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: ${rank}
    }
    facet {
      results: ${rank}(size: $size, from: $from) {
        key
        count
        entity: taxon {
          title: scientificName
          kingdom
          phylum
          class
          order
          family
          genus
        }
      }
    }
  }
}
`;

function IucnMain({
  predicate,
  handleRedirect,
  visibilityThreshold,
  detailsRoute,
  interactive,
  ...props
}) {
  const facetResults = useFacets({
    predicate: {
      type: 'and',
      predicates: [
        predicate,
        {
          type: 'in',
          key: 'iucnRedListCategory',
          values: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT']
        }
      ]
    }, query: IUCN_FACETS
  });
  const resultCount = facetResults?.data?.search?.facet?.results?.length;
  if (resultCount <= visibilityThreshold) return null;

  return <Card {...props}>
    <CardTitle>
      <FormattedMessage id={`dashboard.iucnThreatStatus`} />
      <div css={css`font-weight: 400; color: var(--color300); font-size: 0.95em;`}>
        <div><FormattedMessage id={'dashboard.iucnThreatStatusDescription'} /></div>
      </div>
    </CardTitle>
    {resultCount === 0 && <div css={css`text-align: center; color: #aaa;`}>
      <FormattedMessage id="dashboard.noData" defaultMessage="No data" />
    </div>}
    <GroupBy {...{
      facetResults,
      interactive,
      onClick: handleRedirect,
      transform: data => {
        return data?.search?.facet?.results?.map(x => {
          return {
            key: x.key,
            title: <div>
              <IucnCategory code={x?.entity?.iucnRedListCategory?.code} category={x?.entity?.iucnRedListCategory?.category} />
              {x?.entity?.title}</div>,
            count: x.count,
            filter: { taxonKey: [x.key] },
            description: <Classification>
              {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map(rank => {
                if (!x?.entity?.[rank]) return null;
                return <span key={rank}>{x?.entity?.[rank]}</span>
              })}
            </Classification>
          }
        });
      }
    }} />
    <Pagging facetResults={facetResults} />
  </Card>
};
const IUCN_FACETS = `
query summary($predicate: Predicate, $size: Int, $from: Int){
  search: occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      total: speciesKey
    }
    facet {
      results: speciesKey(size: $size, from: $from) {
        key
        count
        entity: taxon {
          title: scientificName
          kingdom
          phylum
          class
          order
          family
          genus
          iucnRedListCategory {
            category
            code
          }
        }
      }
    }
  }
}
`;
export function Iucn(props) {
  return <ChartClickWrapper {...props}>
    <IucnMain />
  </ChartClickWrapper>
}

function IucnCategory({ code, category }) {
  return <Tooltip title={<FormattedMessage id={`enums.threatStatus.${category}`} />}>
    <span css={css`
      background: #7a443a;
      color: white;
      padding: 3px 5px;
      font-size: 10px;
      font-weight: bold;
      border-radius: 3px;
      margin-right: 4px;
    `}>
      {code}
    </span>
  </Tooltip>
}
