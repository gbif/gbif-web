
import { jsx } from '@emotion/react';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDialogState } from "reakit/Dialog";
import { GalleryTiles, GalleryTile, GalleryCaption, DetailsDrawer, GalleryTileSkeleton, Button, IconFeatures } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { ViewHeader } from '../ViewHeader';
import ThemeContext from '../../../../style/themes/ThemeContext';
import * as css from './gallery.styles';

export const GalleryPresentation = ({ first, prev, next, size, from, data, total, loading, error }) => {
  const theme = useContext(ThemeContext);
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });

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
    <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeItem?.key}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.key} defaultTab='images' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>
    <ViewHeader message="counts.nResultsWithImages" loading={loading} total={total} />
    <div css={css.paper({ theme })}>
      <GalleryTiles>
        {items.map((item, index) => {
          return <GalleryTile height={150} key={item.key}
            minWidth={100}
            src={item.primaryImage.identifier}
            onSelect={() => { setActive(index); dialog.show(); }}>
            <GalleryCaption>
              <div style={{ marginBottom: 2 }} dangerouslySetInnerHTML={{ __html: item.gbifClassification.usage.formattedName }}></div>
              <IconFeatures css={css.features({ theme })}
                typeStatus={item.typeStatus}
                basisOfRecord={item.basisOfRecord}
                eventDate={item.eventDate}
                isSequenced={item.volatile.features.isSequenced}
                isTreament={item.volatile.features.isTreament}
                isClustered={item.volatile.features.isClustered}
                isSamplingEvent={item.volatile.features.isSamplingEvent}
                // formattedCoordinates={item.formattedCoordinates} 
                countryCode={item.countryCode}
              // locality={item.locality}
              />
            </GalleryCaption>
          </GalleryTile>
        })}
        {loading ? Array(size).fill().map((e, i) => <GalleryTileSkeleton key={i} />) : null}
        <div>
          {(from + size < total) && !loading && <Button css={css.more({ theme })} appearance="outline" onClick={next}>
            <FormattedMessage id="search.loadMore" defaultMessage="Load more" />
          </Button>}
        </div>
      </GalleryTiles>
    </div>
  </>
}