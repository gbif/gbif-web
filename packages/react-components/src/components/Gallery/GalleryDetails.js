
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { MdInfo, MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md'
// import PropTypes from 'prop-types';
import { keyCodes } from '../../utils/util';
import { Row, Col } from '../Row/Row';
import { ZoomableImage } from '../ZoomableImage/ZoomableImage';
import { Button } from '../Button/Button';
import { Root } from '../Root/Root';
import { Tabs } from '../Tabs/Tabs';
import { detailPage, detailHeader, detailPrev, detailNext, detailHeaderDescription, detailMainWrapper, detailMain, detailDrawerBar, detailDrawerContent } from './styles';

const { TabList, Tab, TabPanel } = Tabs;

export const getThumbnail = src => `https://api.gbif.org/v1/image/unsafe/x150/${encodeURIComponent(src)}`;

export const GalleryDetails = ({
  closeRequest,
  item,
  title,
  subtitle,
  details,
  previous,
  next,
  imageSrc,
  ...props
}) => {
  const [activeImage, setImage] = useState({ src: imageSrc(item) });
  const theme = useContext(ThemeContext);

  useEffect(() => {
    function handleKeypress(e) {
      switch (e.which) {
        case keyCodes.LEFT_ARROW: previous(); return;
        case keyCodes.RIGHT_ARROW: next(); return;
        default: return;
      }
    }
    if (document) document.addEventListener("keydown", handleKeypress, false);

    return function cleanup() {
      if (document) document.removeEventListener("keydown", handleKeypress, false);
    }
  }, [next, previous]);

  useEffect(() => {
    setImage({ src: imageSrc(item) });
  }, [item, imageSrc]);

  return <Root>
    <Row as="section" direction="row" wrap="nowrap" {...props} css={detailPage({ theme })}>
      <Col shrink={true} basis="100%" style={{background: '#00000005'}}></Col>
      <Row >{details && details({ item, onImageChange: setImage }) }</Row>
    </Row>
  </Root>

  return <Root>
    <Row as="section" direction="column" wrap="nowrap" {...props} css={detailPage({ theme })}>
      <Row css={detailHeader} alignItems="center">
        <Col>
          {item && <h2>{title}</h2>}
          {subtitle && <div css={detailHeaderDescription}>
            {subtitle}
          </div>}
        </Col>
        <Col grow={false}>
          <Button appearance="text" onClick={closeRequest}>
            <MdClose />
          </Button>
        </Col>
      </Row>
      <Row css={detailMainWrapper} wrap="nowrap">
        <Col css={detailMain} shrink={true} basis="100%">
          <div css={detailPrev} onClick={() => previous()}><MdChevronLeft /></div>
          {item && <ZoomableImage src={activeImage.src} thumbnail={getThumbnail(activeImage.src)} />}
          <div css={detailNext} onClick={() => next()}><MdChevronRight /></div>
        </Col>
        {details && details({ item, onImageChange: setImage }) }
      </Row>
    </Row>

  </Root >
};

GalleryDetails.displayName = 'Gallery';

// Gallery.propTypes = {

// };
