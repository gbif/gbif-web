
import { jsx } from '@emotion/react';
import React, { useContext, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDone } from 'react-icons/md';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Accordion, Properties, Image, GalleryTiles, GalleryTile } from "../../../components";
import { Header } from './Header';
import { HyperText } from '../../../components';
import { Group } from './Groups';
const { Term, Value } = Properties;

export function ImageDetails({
  data,
  activeImage, setActiveImage,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (data?.occurrence?.stillImages) setActiveImage(data?.occurrence?.stillImages[0]);
  }, [data]);

  if (!data?.occurrence?.stillImages) {
    return <div>no images to display</div>
  }

  return <div style={{ padding: '12px 0' }}>
    <Header data={data} />
    {activeImage && <>
      <div css={css.imageContainer({ theme })}>
        {/* <ZoomableImage style={{height: 300}} src={activeImage.identifier} thumbnail={Image.getImageSrc({src: activeImage.identifier, h:150})} /> */}
        <Image src={activeImage.identifier} h="450" style={{ maxWidth: '100%', maxHeight: 450 }} />
      </div>
      <Group label="occurrenceDetails.about" defaultOpen={data?.occurrence?.stillImages?.length === 1}>
        <Properties css={css.properties}>
          {['description', 'type', 'format', 'identifier', 'created', 'creator', 'license', 'publisher', 'references', 'rightsholder']
            .filter(x => !!activeImage[x]).map(x => <React.Fragment key={x}>
              <Term>
                <FormattedMessage id={`occurrenceFieldNames.${x}`} />
              </Term>
              <Value>
                <HyperText text={activeImage[x]} />
              </Value>
            </React.Fragment>)}
        </Properties>
      </Group>
    </>}
    {data?.occurrence?.stillImages?.length > 1 &&
      <Group label="occurrenceDetails.morePhotos" defaultOpen={true}>
        <GalleryTiles>
          {data.occurrence.stillImages.map((x, i) => {
            return <GalleryTile onSelect={() => setActiveImage(x)} key={i} src={x.identifier} height={120}>
              {x === activeImage ? <span style={{ background: 'black', color: 'white', padding: '5px 5px 2px 5px' }}>
                <MdDone />
              </span> : null}
            </GalleryTile>
          })
          }
          <div></div>
        </GalleryTiles>
      </Group>
    }
  </div>
};