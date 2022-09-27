import { jsx, css } from '@emotion/react';
import React, { useEffect } from 'react';
import { useQuery } from '../../../../dataManagement/api';
import { ProgressItem } from "../../../../components";
import { FormattedMessage } from 'react-intl';

export function TopCountries({
  predicate,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });

  useEffect(() => {
    load({
      variables: {
        predicate
      }
    });
  }, [predicate]);

  const total = data?.occurrenceSearch?.documents?.total;

  return <>
    <h4 css={css`margin: 0 0 24px 0; font-size: 14px;`}>Top 10 countries</h4>
    <div>
      <ul css={css`padding: 0; margin: 0; list-style: none;`}>
        {data?.occurrenceSearch?.facet?.countryCode.map((x, i) => {
          return <li>
            <ProgressItem style={{ marginBottom: 12 }} fraction={x.count / total} title={<FormattedMessage id={`enums.countryCode.${x.key}`} />} subtleText />
          </li>
        })}
      </ul>
    </div>
  </>
};

const OCCURRENCE_STATS = `
query topCountries($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    facet {
      countryCode(size: 10) {
        count
        key
      }
    }
  }
}
`;

