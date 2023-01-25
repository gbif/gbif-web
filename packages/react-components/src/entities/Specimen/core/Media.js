import { jsx } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import equal from 'fast-deep-equal/react';
import startCase from 'lodash/startCase';
import { ButtonGroup, Button, Image, ResourceLink, Accordion, Properties, HyperText, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink } from "../../../components";
import { CustomValueField, BasicField, PlainTextField, EnumField, HtmlField, LicenseField, Chips } from './properties';
import { Group } from './Groups';
import * as css from "../styles";
import { MdDone, MdVideocam } from 'react-icons/md';
import { prettifyEnum } from '../../../utils/labelMaker/config2labels';

const { Term: T, Value: V } = Properties;

export function Media({ updateToc, specimen, ...props }) {
  if (!specimen) return null;
  return <Group {...props}>
    <MediaSummary specimen={specimen} />
  </Group>
}

function MediaSummary({ specimen, ...props }) {
  const images = specimen?.media?.images?.specimen || [];
  const [activeMedia, setActive] = useState({ ...images[0], isImage: true });
  useEffect(() => {
    const hasVideo = false;//specimen?.movingImageCount > 0;
    const hasPlayableVideo = false;//hasVideo && ['video/mp4', 'video/ogg'].includes(specimen?.movingImages[0].format);
    const hasImages = images.length > 0;
    const hasAudio = false;//specimen.soundCount > 0;
    if (hasPlayableVideo) {
      setActive({ ...specimen?.movingImages[0], isVideo: true })
    } else if (hasImages) {
      setActive({ ...images[0], isImage: true })
    } else if (hasAudio) {
      setActive({ ...specimen?.sounds[0], isSound: true })
    }
  }, [specimen])

  const isVideo = activeMedia.isVideo;
  const hasPlayableVideo = isVideo && ['video/mp4', 'video/ogg'].includes(activeMedia.format);
  if (images.length === 0 && specimen.movingImageCount === 0 && specimen.soundCount === 0) return null;

  return <>
    <div style={{ position: 'relative', background: '#eee' }} {...props}>
      {hasPlayableVideo && <video controls style={{ maxWidth: '100%', height: 400, display: 'block', margin: 'auto' }} >
        <source src={activeMedia.identifier} type={activeMedia.format} />
        Unable to play
      </video>}
      {activeMedia.isImage && <Image src={activeMedia.media.accessUri} h={400} style={{ maxWidth: '100%', height: 400, display: 'block', margin: 'auto' }} />}
    </div>
    <Accordion
      summary={<FormattedMessage id='occurrenceDetails.about' />}
      defaultOpen={false}
      css={css.accordionGroup()}>
      <Properties dense css={css.properties} style={{ padding: '12px 0' }}>
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
    <div style={{ padding: 12 }}>
      {images.length > 0 &&
        <div>
          <h4>Images</h4>
          <GalleryTiles>
            {images.map((x, i) => {
              return <GalleryTile onSelect={() => setActive({ ...x, isImage: true })} key={i} src={x.media.accessUri} height={120}>
                {x === activeMedia ? <span style={{ background: 'black', color: 'white', padding: '5px 5px 2px 5px' }}>
                  <MdDone />
                </span> : null}
              </GalleryTile>
            })
            }
            <div></div>
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