import React, { useContext, useEffect } from 'react';
// import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Button, Classification, Image, Skeleton, Tag } from '../../../components';
import { Row, Col } from "../../../components";
import { useQuery } from '../../../dataManagement/api';
import SearchContext from '../../../search/SearchContext';

const IMAGE_QUERY = `
query image($key: String) {
  taxonMedia(key: $key) {
    identifier
    type
    subtypeLiteral
    title
    rights
    Credit
    providerLiteral
    description
    accessURI
    format
    PixelXDimension
    PixelYDimension
  }
}
`;

function TaxaImage({ taxon }) {
  const { data, loading, error, load } = useQuery(IMAGE_QUERY, { lazyLoad: true });
  
  // effect hook to load the taxon image
  useEffect(() => load({
    keepDataWhileLoading: true,
    variables: { key: taxon.replace(/[^ ]*\. /, '') }
  }), [taxon]);

  return (
    <div style={{ position: 'relative', width: 90, height: 90, marginRight: '12px' }}>
      <Skeleton
        style={{
          position: 'absolute',
          width: 90,
          height: 90,
          marginRight: '12px',
          borderRadius: '4px'
        }}
      />
      {data?.taxonMedia?.length > 0 && (
         <Image
          alt={`Image of ${taxon}`}
          style={{ marginRight: '12px', borderRadius: '4px' }}
          src={data.taxonMedia[0].accessURI}
          width={90}
          height={90}
        />
      )}
    </div>
  );
}

export function DistinctTaxa({
  data = {},
  loading,
  error,
  setActiveEvent,
  addToSearch,
  addEventTypeToSearch,
  className,
  ...props
}) {
  const { sidebar } = useContext(SearchContext);
  const { event } = data;

  if (loading || !event) return <h2>Loading event information...</h2>;

  return <Row direction="column" wrap="nowrap">
    <Col style={{ padding: '12px', paddingBottom: '48px', overflow: 'auto' }} grow>
      {event.distinctTaxa.map((taxon) =>
        <div key={taxon.key} style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
          <TaxaImage taxon={taxon.scientificName} />
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <span style={{ margin: '6px 10px 6px 0' }}>{taxon.scientificName}</span>
              <Tag type='light'>{taxon.count} occurrence{taxon.count > 1 && 's'}</Tag>
            </div>
            <Classification>
              {['kingdom', 'phylum', 'class', 'order', 'family'].map((rank) =>
                taxon[rank] && (
                  <span key={rank} style={{ color: 'var(--color500)', fontSize: 13 }}>
                    {taxon[rank]}
                  </span>
                )
              )}
            </Classification>
            <div style={{ paddingTop: '14px' }}>
              <Button
                as="a"
                look="primaryOutline"
                style={{ fontSize: '11px', marginRight: '8px' }}
                href={`https://www.ncbi.nlm.nih.gov/search/all/?term=${encodeURIComponent(taxon.scientificName)}`}
                target="_blank">
                Search GenBank
              </Button>
              {sidebar?.taxonLinks?.map((link) => {
                const { title, href } = link(taxon);
                return title && href && (
                  <Button
                    as="a"
                    look="primaryOutline"
                    style={{ fontSize: '11px', marginRight: '8px' }}
                    href={href}
                    target="_blank">
                    {title}
                  </Button>
                );
              })}
              <Button
                as="a"
                look="text"
                style={{ fontSize: '11px', color: 'var(--color500)' }}
                href="#">
                More images
              </Button>
            </div>
          </div>
        </div>
      )}
    </Col>
  </Row>
};
