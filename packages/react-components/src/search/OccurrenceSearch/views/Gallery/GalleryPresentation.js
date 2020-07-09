import React, { useState, useEffect, useCallback } from 'react';
import { MdLocationOn } from 'react-icons/md';
import { useDialogState } from "reakit/Dialog";
import { FormattedMessage } from 'react-intl';
import { GalleryTiles, GalleryTile, GalleryCaption, DetailsDrawer, GalleryTileSkeleton, Button } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { ViewHeader } from '../ViewHeader';

export const GalleryPresentation = ({ first, prev, next, size, from, data, total, loading, error }) => {
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true });

  const items = data;

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);


  if (total === 0) return <div>
    <h2>No content</h2>
    {error && <p>Backend failure</p>}
  </div>
  const itemsLeft = total ? total - from : 20;
  const loaderCount = Math.min(Math.max(itemsLeft, 0), size);

  // if (loading && !total) {
  //   return Array(size).fill().map((e, i) => <GalleryTileSkeleton key={i} />)
  // }

  if (error && !total) {
    return <h2>Error</h2>
  }

  return <>
    <DetailsDrawer dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.gbifId} defaultTab='images' style={{ width: 700, height: '100%' }} />
    </DetailsDrawer>
    <ViewHeader loading={loading} total={total}/>
    <div style={{background: 'white', border: '1px solid #ddd', borderRadius: 4, padding: 4}}>
      <GalleryTiles>
        {items.map((item, index) => {
          return <GalleryTile height={150} key={item.gbifId}
            src={item.primaryImage.identifier}
            onSelect={() => { setActive(index); dialog.show(); }}>
            <GalleryCaption>
              <div style={{marginBottom: 2}} dangerouslySetInnerHTML={{ __html: item.gbifClassification.acceptedUsage.formattedName }}></div>
              <div style={{fontSize: '11px', color: '#888'}}>
                <MdLocationOn style={{ position: 'relative', top: 2 }} /> <FormattedMessage id={`enums.countryCode.${item.countryCode}`} /> <span style={{ color: '#888' }}>{item.locality}</span>
              </div>
            </GalleryCaption>
          </GalleryTile>
        })}
        {loading ? Array(size).fill().map((e, i) => <GalleryTileSkeleton key={i} />) : null}
        <div>
          {(from + size < total) && !loading && <Button appearance="outline" onClick={next} style={{ height: '100%' }}>Load more</Button>}
        </div>
      </GalleryTiles>
    </div>
  </>
}