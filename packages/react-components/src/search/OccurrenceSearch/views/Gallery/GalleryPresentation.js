
import { jsx, css } from '@emotion/react';
import md5 from 'md5';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDialogState } from "reakit/Dialog";
import { GalleryTiles, GalleryTile, GalleryCaption, DetailsDrawer, GalleryTileSkeleton, Button, IconFeatures } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { ViewHeader } from '../ViewHeader';
import ThemeContext from '../../../../style/themes/ThemeContext';
import env from '../../../../../.env.json';
import * as styles from './gallery.styles';
import { MdOutlineImageSearch } from 'react-icons/md';

export const GalleryPresentation = ({ style, tileWrapperProps, className, next, size, from, data, total, loading, error }) => {
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

  if (error) {
    return <h2>Error</h2>
  }

  return <div {...{ style, className }}>
    <DetailsDrawer href={`${env.GBIF_ORG}/occurrence/${activeItem?.key}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.key} defaultTab='images' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>
    <ViewHeader message="counts.nResultsWithImages" loading={loading} total={total} />
    {total === 0 && <div css={css`text-align: center; margin: 48px; color: var(--color200);`}>
      <MdOutlineImageSearch style={{ fontSize: 100 }} />
      <p><FormattedMessage id="phrases.noResults" /></p>
    </div>}
    {total > 0 && <div css={styles.paper({ theme })} {...tileWrapperProps} className={className}>
      <GalleryTiles>
        {items.map((item, index) => {
          return <GalleryTile height={150} key={item.key}
            minWidth={100}
            src={item.primaryImage.identifier}
            getSrc={({ src, w = '', h = '' }) => {
              // the get source function is used to generate the image url in cases where we want to use something else than standard thumbor
              // in this case we have a special url format for the occurrence images. This is in preparation for the new image service that will disable any unsafe urls
              // see also https://github.com/gbif/gbif-web/issues/303
              try {
                const url = `${env.OCCURRENCE_IMAGE_CACHE}/${w}x${h}/occurrence/${item.key}/media/${md5(item.primaryImage.identifier ?? '')}`;
                return url;
              } catch (err) {
                console.warn(err);
                return '';
              }
            }}
            onSelect={() => { setActive(index); dialog.show(); }}>
            <GalleryCaption>
              <div style={{ marginBottom: 2 }} dangerouslySetInnerHTML={{ __html: item.gbifClassification.usage.formattedName }}></div>
              <IconFeatures css={styles.features({ theme })}
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
          {(from + size < total) && !loading && <Button css={styles.more({ theme })} appearance="outline" onClick={next}>
            <FormattedMessage id="search.loadMore" defaultMessage="Load more" />
          </Button>}
        </div>
      </GalleryTiles>
    </div>}
  </div>
}

/*
.filter('occurrenceImgCache', function(env) {
    return function(identifier, occurrenceKey, params) {
        if (params) {
            return env.customImageCache + params + '/occurrence/' + occurrenceKey + '/media/' + md5(identifier);
        } else {
            return env.customImageCache + 'occurrence/' + occurrenceKey + '/media/' + md5(identifier);
        }
    };
})
*/