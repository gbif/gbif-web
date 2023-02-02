import { jsx } from '@emotion/react';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDone } from 'react-icons/md';
import range from 'lodash/range';
import * as css from './styles';

// Project components
import { useQuery } from '../../../dataManagement/api';
import ThemeContext from '../../../style/themes/ThemeContext';
import {
  Properties,
  Image,
  GalleryTiles,
  GalleryTile,
  HyperText,
  Skeleton,
  Row,
  Col,
} from '../../../components';
import { Card } from '../../shared';
const { Term, Value } = Properties;

const IMAGE_QUERY = `
query image($key: String, $size: Int) {
  taxonMedia(key: $key, size: $size) {
    identifier
    type
    subtypeLiteral
    title
    rights
    Credit
    providerLiteral
    description
    accessURI
    accessOriginalURI
    format
    PixelXDimension
    PixelYDimension
  }
}
`;

const IMAGE_HEIGHT = 250;

export default function Media({ id }) {
  const { data, load, loading } = useQuery(IMAGE_QUERY, { lazyLoad: true });
  const [activeImage, setActiveImage] = useState(null);
  const [activeLoading, setActiveLoading] = useState(true);
  const theme = useContext(ThemeContext);

  // useEffect hook to load
  useEffect(() => {
    load({ variables: { key: id, size: 25 } });
  }, []);

  // useEffect hook to update the active image when the data is loaded
  useEffect(() => {
    if (data?.taxonMedia[0] && activeImage === null)
      setActiveImage(data.taxonMedia[0]);
  }, [data]);

  return (
    <Row halfGutter={5} gridGutter>
      <Col xs={12} sm={12} md={6} lg={7} xl={8}>
        <Card style={{ padding: 24, height: '100%' }}>
          <GalleryTiles>
            {data?.taxonMedia?.map((image) => {
              return (
                <GalleryTile
                  style={{ position: 'relative' }}
                  onSelect={() => {
                    setActiveLoading(true);
                    setActiveImage(image);
                  }}
                  key={image.identifier}
                  src={image.accessURI}
                  height={80}
                >
                  {image.identifier === activeImage?.identifier ? (
                    <span css={css.imageSelectCheck()}>
                      <MdDone />
                    </span>
                  ) : null}
                </GalleryTile>
              );
            })}
            {!data &&
              range(0, 20).map((key) => (
                <GalleryTile key={key} height={80}></GalleryTile>
              ))}
          </GalleryTiles>
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6} lg={5} xl={4}>
        <Card style={{ padding: 24 }}>
          <div css={css.imageContainer({ theme })}>
            {(!activeImage || activeLoading) && (
              <Skeleton
                style={{
                  width: '100%',
                  height: IMAGE_HEIGHT,
                  marginBottom: 0,
                }}
              />
            )}
            <Image
              src={activeImage?.accessOriginalURI}
              h={IMAGE_HEIGHT.toString()}
              style={{
                display: activeLoading ? 'none' : 'block',
                maxWidth: '100%',
                maxHeight: IMAGE_HEIGHT,
              }}
              onLoad={() => setActiveLoading(false)}
            />
          </div>
          {activeImage ? (
            <Properties css={css.properties}>
              {[
                'title',
                'description',
                'type',
                'providerLiteral',
                'rights',
                'Credit',
                'format',
              ]
                .filter(
                  (property) => !activeImage || Boolean(activeImage[property])
                )
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
          ) : (
            <Properties css={css.properties}>
              {range(0, 5).map((property) => (
                <React.Fragment key={property}>
                  <Term>
                    <Skeleton as='p' width='100%' style={{ height: 20 }} />
                  </Term>
                  <Value>
                    <Skeleton as='p' width='100%' style={{ height: 20 }} />
                  </Value>
                </React.Fragment>
              ))}
            </Properties>
          )}
        </Card>
      </Col>
    </Row>
  );
}
