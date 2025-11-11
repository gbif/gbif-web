import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDone, MdArrowBack } from 'react-icons/md';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';

// Local components
// import { RelatedImages } from './RelatedImages';
import { Group } from '../details/Groups';

// Project components
import {
  Properties,
  Image,
  GalleryTiles,
  GalleryTile,
  HyperText,
  Skeleton,
  Button,
} from '../../../components';
const { Term, Value } = Properties;

export function MoreImages({ data, onNavigateBack, className, ...props }) {
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(data.images[0]);

  // Setup query loading & theming
  const theme = useContext(ThemeContext);
  const IMAGE_HEIGHT = 250;

  // Event handler for active images
  const handleActiveImage = (image) => {
    if (activeImage === null || activeImage.identifier !== image.identifier) {
      setLoading(true);
      setActiveImage(image);
    }
  };

  return (
    <div>
      {activeImage && (
        <>
          <div style={{ padding: '0px 12px' }}>
            <Button
              look="text"
              style={{ fontSize: '85%', color: 'var(--color500)' }}
              onClick={onNavigateBack}
            >
              <MdArrowBack />
              &nbsp;
              <FormattedMessage id="eventDetails.backToTaxa" />
            </Button>
          </div>
          <div css={css.imageContainer({ theme })}>
            {loading && (
              <Skeleton
                style={{ width: '100%', height: IMAGE_HEIGHT, marginBottom: 0 }}
              />
            )}
            <Image
              src={activeImage.accessOriginalURI}
              h={IMAGE_HEIGHT.toString()}
              style={{
                display: loading ? 'none' : 'block',
                maxWidth: '100%',
                maxHeight: IMAGE_HEIGHT,
              }}
              onLoad={() => setLoading(false)}
            />
          </div>
          <Group label="occurrenceDetails.about" defaultOpen={true}>
            <Properties css={css.properties}>
              {[
                'title',
                'description',
                'type',
                'providerLiteral',
                'rights',
                'credit',
                'format',
              ]
                .filter((property) => Boolean(activeImage[property]))
                .map((property) => (
                  <React.Fragment key={property}>
                    <Term>
                      <FormattedMessage id={`images.${property}`} />
                    </Term>
                    <Value>
                      <HyperText text={activeImage[property]} inline />
                    </Value>
                  </React.Fragment>
                ))}
            </Properties>
          </Group>
        </>
      )}
      <Group label="eventDetails.groups.images" defaultOpen={true}>
        <GalleryTiles>
          {data.images.map((image) => {
            return (
              <GalleryTile
                style={{ position: 'relative' }}
                onSelect={() => handleActiveImage(image)}
                key={image.identifier}
                src={image.accessURI}
                height={80}
              >
                {image.identifier === activeImage.identifier ? (
                  <span css={css.imageSelectCheck()}>
                    <MdDone />
                  </span>
                ) : null}
              </GalleryTile>
            );
          })}
        </GalleryTiles>
      </Group>
    </div>
  );
}
