import { jsx, css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import equal from 'fast-deep-equal/react';
import startCase from 'lodash/startCase';
import { ButtonGroup, Button, Image, ResourceLink, Accordion, Properties, HyperText, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink } from "../../../components";
import { CustomValueField, BasicField, PlainTextField, EnumField, HtmlField, LicenseField, Chips } from './properties';
import { Group } from './Groups';
import * as styles from "../styles";
import { MdDone, MdVideocam } from 'react-icons/md';
import { prettifyEnum } from '../../../utils/labelMaker/config2labels';
import { Card, CardHeader2 } from '../../shared';

const { Term: T, Value: V } = Properties;

export function Media({ updateToc, specimen, defaultCollapse, ...props }) {
  if (!specimen) return null;
  const images = specimen?.media?.images?.specimen || [];
  if (images.length === 0) return null;
  return <Card padded={false} {...props}>
    {/* <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Media</CardHeader2>
    </div> */}
    <MediaSummary specimen={specimen} defaultCollapse={defaultCollapse} />
  </Card>
}

function MediaSummary({ specimen, defaultCollapse, ...props }) {
  const [collapsed, setCollapsed] = useState(defaultCollapse);
  const [limit, setLimit] = useState(8);
  const images = specimen?.media?.images?.specimen || [];
  const [activeMedia, setActive] = useState();
  useEffect(() => {
    const hasVideo = false;//specimen?.movingImageCount > 0;
    const hasPlayableVideo = false;//hasVideo && ['video/mp4', 'video/ogg'].includes(specimen?.movingImages[0].format);
    const hasImages = images.length > 0;
    const hasAudio = false;//specimen.soundCount > 0;
    if (!collapsed) {
      if (hasPlayableVideo) {
        setActive({ ...specimen?.movingImages[0], isVideo: true })
      } else if (hasImages) {
        setActive({ ...images[0], isImage: true })
      } else if (hasAudio) {
        setActive({ ...specimen?.sounds[0], isSound: true })
      }
    }
  }, [specimen])

  const isVideo = activeMedia?.isVideo;
  const hasPlayableVideo = isVideo && ['video/mp4', 'video/ogg'].includes(activeMedia.format);
  if (images.length === 0 && specimen.movingImageCount === 0 && specimen.soundCount === 0) return null;

  return <>
    {activeMedia && <>
      <div style={{ position: 'relative', background: '#eee' }} {...props}>
        {hasPlayableVideo && <video controls style={{ maxWidth: '100%', maxHeight: 400, display: 'block', margin: 'auto' }} >
          <source src={activeMedia.identifier} type={activeMedia.format} />
          Unable to play
        </video>}
        {activeMedia && activeMedia.isImage && <Image src={activeMedia.media.accessUri} h={450} style={{ maxWidth: '100%', maxHeight: 450, display: 'block', margin: 'auto' }} 
          onClick={() => {window.open(`${activeMedia.media.accessUri}`, '_blank');}}/>}
      </div>
      <Accordion
        summary={<FormattedMessage id='occurrenceDetails.about' />}
        defaultOpen={false}
        css={styles.accordionGroup()}>
        <Properties dense css={styles.properties} style={{ padding: '12px 0' }}>
          {['accessUri',
            'format',
            'webStatement',
            'license',
            'rights',
            'rightsUri',
            'accessRights',
            'rightsHolder',
            'source',
            'sourceUri',
            'creator',
            'created',
            'modified',
            'language',
            'bibliographicCitation']
            .filter(x => !!activeMedia.media[x]).map(x => <React.Fragment key={x}>
              <T>
                {prettifyEnum(x)}
              </T>
              <V>
                <HyperText text={activeMedia.media[x]} inline />
              </V>
            </React.Fragment>)}
        </Properties>
      </Accordion>
    </>}
    <div style={{ padding: 12 }}>
      {images.length > 0 &&
        <div>
          {/* <h4>Images</h4> */}
          <GalleryTiles>
            {images.slice(0,limit).map((x, i) => {
              let src = x.media.accessUri;
              let title;
              if (x.media.digitalEntityType === 'INTERACTIVE_RESOURCE') {
                src = 'https://upload.wikimedia.org/wikipedia/commons/e/e8/International_Image_Interoperability_Framework_logo.png';
                title = 'Open iiif interactive resource'
              }
              if (x.media.digitalEntityType === 'TEXT') {
                src = 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Icon-txt.svg';
                title = x.media.webStatement;
              }
              return <GalleryTile 
                title={title}
                onSelect={() => {
                  if (x.media.digitalEntityType === 'INTERACTIVE_RESOURCE') {
                    window.open(`https://labs.gbif.org/mirador/?manifest=${x.media.accessUri}`, '_blank');
                  } else if (x.media.digitalEntityType === 'TEXT') {
                    window.open(x.media.accessUri, '_blank');
                  } else {
                    setActive({ ...x, isImage: true })};
                  }
                }
                key={i} 
                src={src} 
                height={100}>
                {x === activeMedia ? <span style={{ background: 'black', color: 'white', padding: '5px 5px 2px 5px' }}>
                  <MdDone />
                </span> : null}
              </GalleryTile>
            })
            }
            {images.length > limit && <div><Button look="primaryOutline" onClick={() => setLimit(200)}>See all {images.length}</Button></div>}
          </GalleryTiles>
        </div>
      }
      {specimen?.movingImages?.length > 0 &&
        <div>
          <h4>Video</h4>
          <GalleryTiles>
            {specimen.movingImages.map((x, i) => {
              return <button onClick={() => setActive({ ...x, isVideo: true })} key={i} style={{ border: 'none', background: '#ddd', padding: 30, fontSize: 28 }}>
                <MdVideocam />
                {x === activeMedia ? <span style={{ background: 'black', color: 'white', padding: '5px 5px 2px 5px' }}>
                  <MdDone />
                </span> : null}
              </button>
            })
            }
            <div></div>
          </GalleryTiles>
        </div>
      }
    </div>
  </>
}