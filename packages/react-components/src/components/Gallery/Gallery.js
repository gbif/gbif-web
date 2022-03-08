
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useState, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDialogState, Dialog } from "reakit/Dialog";
// import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { Button } from '../Button/Button';
import { Image } from '../Image/Image';
import * as styles from './styles';
import { GalleryDetails } from './GalleryDetails';

export const GalleryTileSkeleton = ({ height = 150, ...props }) => {
  return <div css={styles.skeletonTile({ height })} {...props}></div>
};

export const GalleryTile = ({ src, onSelect, height = 150, minWidth, children, style, ...props }) => {
  const theme = useContext(ThemeContext);
  const [ratio, setRatio] = useState(1);
  const [isValid, setValid] = useState(false);
  
  const onLoad = useCallback((event) => {
    setValid(true);
    const ratio = event.target.naturalWidth / event.target.naturalHeight;
    setRatio(ratio);
  }, []);

  const sizeStyle = {
    width: ratio * height,
  };
  const imageStyle = {
    backgroundImage: `url('${Image.getImageSrc({ src, h: height })}')`
  }
  if (ratio > 3) sizeStyle.width = height * 3;
  if (ratio < .3) sizeStyle.width = height * .3;
  if (minWidth) sizeStyle.width = Math.max(minWidth, sizeStyle.width);

  return <div css={styles.galleryTile({ theme, height })} style={{...sizeStyle, ...style}}>
    <Button appearance="text"
      css={styles.galleryTileImage({ theme, height })}
      style={imageStyle}
      onClick={onSelect} {...props}
      title="View details"
    >
      {src && <Image src={src}
        width={height}
        h={height}
        onLoad={onLoad}
        alt="Occurrence evidence"
      />}
    </Button>
    {children}
  </div>
}

export const GalleryCaption = props => {
  const theme = useContext(ThemeContext);
  return <div css={styles.caption({ theme })} {...props} />
};

export const Gallery = ({
  onSelect,
  caption,
  title,
  subtitle,
  details,
  items = [],
  loading,
  loadMore,
  imageSrc,
  size = 20,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const dialog = useDialogState({ animated: true, modal: false });
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const next = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const prev = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);

  return <>
    {!onSelect && <Dialog {...dialog} tabIndex={0} aria-label="Welcome">
      {activeItem && <GalleryDetails
        closeRequest={() => dialog.hide()}
        item={activeItem}
        title={title ? title(activeItem) : 'Unknown'}
        subtitle={title ? subtitle(activeItem) : null}
        details={details}
        imageSrc={imageSrc}
        next={next}
        previous={prev}
      />}
    </Dialog>}
    <GalleryTiles {...props}>
      {items.map((e, i) => {
        return <GalleryTile height={150} key={i}
          src={imageSrc(e)}
          onSelect={onSelect ? () => onSelect({ item: e }) : () => { setActive(i); dialog.show() }}>
          {caption && caption({ item: e, index: i })}
        </GalleryTile>
      })}
      {loading ? Array(size).fill().map((e, i) => <GalleryTileSkeleton key={i} />) : null}
      <div css={styles.more({ theme, height: 150 })}>
        {loadMore && !loading && <Button appearance="outline" onClick={loadMore}>
         <FormattedMessage id="search.loadMore" defaultMessage="Load more"/>
        </Button>}
      </div>
    </GalleryTiles>
  </>
};

export const GalleryTiles = ({children, ...props}) => {
  const theme = useContext(ThemeContext);
  return <div css={styles.gallery({ theme })} {...props}>
    {children}
    <div css={styles.more({ height: 1 })}></div>
    </div>
}

Gallery.displayName = 'Gallery';


// Gallery.propTypes = {

// };
