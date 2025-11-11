import React, { useContext, useState } from 'react';
import {
  Button,
  Classification,
  Tag,
  Row,
  Col,
  Menu,
  MenuAction,
  ResourceLink,
} from '../../../components';
import SearchContext from '../../../search/SearchContext';
import { MoreImages } from './MoreImages';
import { TaxaImage } from './TaxaImage';
import { MdMoreHoriz } from 'react-icons/md';
import env from '../../../../.env.json';

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
  const [highlightedTaxon, setHighlightedTaxon] = useState(null);
  const [taxonImages, setTaxonImages] = useState({});
  const { sidebarConfig } = useContext(SearchContext);
  const { event } = data;

  // Update the taxonImages state
  const onImageLoad = (image) =>
    setTaxonImages({
      ...taxonImages,
      ...image,
    });

  if (loading || !event) return <h2>Loading event information...</h2>;

  return (
    <Row direction='column' wrap='nowrap'>
      {highlightedTaxon ? (
        <MoreImages
          data={{
            ...highlightedTaxon,
            images: taxonImages[highlightedTaxon.key],
          }}
          onNavigateBack={() => setHighlightedTaxon(null)}
        />
      ) : (
        <Col
          style={{ padding: '12px', paddingBottom: '48px', overflow: 'auto' }}
          grow
        >
          {
            event.distinctTaxa?.filter(Boolean).map((taxon) => (
            <div
              key={taxon.key}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 12,
              }}
            >
              <TaxaImage taxon={taxon} onImageLoad={onImageLoad} />
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ margin: '6px 10px 6px 0' }}>
                    {taxon.scientificName}
                  </span>
                  <Tag type='light'>
                    {taxon.count} occurrence{taxon.count > 1 && 's'}
                  </Tag>
                </div>
                <Classification>
                  {['kingdom', 'phylum', 'class', 'order', 'family'].map(
                    (rank) =>
                      taxon[rank] && (
                        <span
                          key={rank}
                          style={{ color: 'var(--color500)', fontSize: 13 }}
                        >
                          {taxon[rank]}
                        </span>
                      )
                  )}
                </Classification>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: '8px',
                    alignItems: 'center',
                  }}
                >
                  <ResourceLink
                    style={{ fontSize: '11px', marginRight: '12px' }}
                    target="_blank"
                    type="taxonKey"
                    id={taxon.key}
                  >
                    View taxon details
                  </ResourceLink>
                  <Button
                    disabled={!Boolean(taxonImages[taxon.key])}
                    look="text"
                    style={{
                      fontSize: '11px',
                      color: 'var(--color500)',
                      marginRight: '12px',
                    }}
                    onClick={() => setHighlightedTaxon(taxon)}
                  >
                    More images
                  </Button>
                  <Menu
                    aria-label='Custom menu'
                    trigger={
                      <Button appearance='text'>
                        <MdMoreHoriz style={{ fontSize: 20 }} />
                      </Button>
                    }
                    items={(state) => [
                      <MenuAction
                        onClick={() => {
                          window.open(
                            `https://www.ncbi.nlm.nih.gov/search/all/?term=${encodeURIComponent(
                              taxon.scientificName
                            )}`,
                            '_blank'
                          );
                        }}
                      >
                        Search taxon on GenBank
                      </MenuAction>,
                      ...(sidebarConfig?.taxonLinks || []).map((link) => {
                        const { title, action } = link(taxon, event);
                        return (
                          title &&
                          action && (
                            <MenuAction
                              onClick={() => {
                                action();
                                state.hide();
                              }}
                            >
                              {title}
                            </MenuAction>
                          )
                        );
                      }),
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}
        </Col>
      )}
    </Row>
  );
}
