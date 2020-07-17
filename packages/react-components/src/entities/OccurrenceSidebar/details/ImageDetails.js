/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useEffect } from 'react';
import { MdDone } from 'react-icons/md';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Accordion, Properties, Image, GalleryTiles, GalleryTile } from "../../../components";
import { Header } from './Header';

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

  return <div style={{ padding: '12px 16px' }}>
    <Header data={data} />
    {/* <h4 dangerouslySetInnerHTML={{ __html: data?.occurrence?.gbifClassification?.usage?.formattedName }}></h4> */}
    {activeImage && <>
    <div css={css.imageContainer({theme})}>
      {/* <ZoomableImage style={{height: 300}} src={activeImage.identifier} thumbnail={Image.getImageSrc({src: activeImage.identifier, h:150})} /> */}
      <Image src={activeImage.identifier} h="450" style={{maxWidth: '100%', maxHeight: 450}} />
    </div>
    <Accordion css={css.accordion({theme})} summary={<span>About</span>} defaultOpen={data?.occurrence?.stillImages?.length === 1}>
      <Properties style={{ fontSize: 13 }}>
        {['type', 'format', 'identifier', 'created', 'creator', 'license', 'publisher', 'references', 'rightsholder']
          .map(x => <React.Fragment key={x}>
            <Term>{x}</Term>
            <Value>
              {activeImage[x]}
            </Value>
          </React.Fragment>)}
      </Properties>
    </Accordion>
    </>}
    {data?.occurrence?.stillImages?.length > 1 &&
      <Accordion css={css.accordion({theme})} summary={<span>More photos</span>} defaultOpen={true}>
        <GalleryTiles>
          {data.occurrence.stillImages.map((x, i) => {
            return <GalleryTile onSelect={() => setActiveImage(x)} key={i} src={x.identifier} height={120}>
              {x === activeImage ? <span style={{background: 'black', color: 'white', padding: '5px 5px 2px 5px'}}>
                <MdDone />
              </span> : null}
              </GalleryTile>
          })
          }
          <div></div>
        </GalleryTiles>
      </Accordion>
    }
  </div>
};