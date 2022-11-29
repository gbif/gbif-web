import { jsx, css } from '@emotion/react';
import React from 'react';
import { Classification, HyperText, Image, Properties } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';
import { FormattedMessage } from 'react-intl';

export function Media({
  id,
  ...props
}) {
  const occurrence = {
    sounds: [],
    movingImages: [],
    stillImages: [
      {
        identifier: 'https://web.corral.tacc.utexas.edu/arctos-s3/cstark/2019-11-07/Tamias_quadrivittatus_C34S32_110718_DORSAL.jpg',
      },
      {
        "type": "StillImage",
        "format": "image/jpeg",
        "references": "https://www.artportalen.se/Image/3750484",
        "created": "2022-01-04T00:00:00.000+00:00",
        "license": "© all rights reserved",
        "rightsHolder": "Per Wahlén",
        "identifier": "https://www.artportalen.se/MediaLibrary/2022/1/2997700a-020b-44fa-ae49-e1682fee8dc9_image.jpg"
      }
    ],
  };

  // return <Card padded={false} {...props}>
  return <>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Media</CardHeader2>
      <div css={css`
        
      `}>
        <ul css={mediaList}>
          <Sounds       {...{ occurrence }} />
          <MovingImages {...{ occurrence }} />
          <Images occurrence={occurrence} />
        </ul>
      </div>
    </div>
    <div css={css`padding: 12px 24px; background: var(--paperBackground800); border-top: 1px solid var(--paperBorderColor);`}>
      <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Images</h3>

    </div>
  </>
  // </Card>
};

function Images({ occurrence, ...props }) {
  return <>
    {occurrence.stillImages?.map(media => <li>
      <div css={mediaCard}>
        <figure css={mediaArea}>
          <a target="_blank" href={`https://www.gbif.org/tools/zoom/simple.html?src=${encodeURIComponent(media.identifier)}`}>
            <Image w={600} src={media.identifier} />
          </a>
        </figure>
        <Caption media={media} />
      </div>
    </li>)}
  </>
}

function Sounds({ occurrence, termMap, ...props }) {
  return <>
    {occurrence.sounds?.map((media, i) => {
      const knownFormat = supportedFormats.includes(media.format);
      return <li key={i}>
        <div css={mediaCard}>
          <div css={mediaArea}>
            {knownFormat && <>
              <audio controls>
                <source src={media.identifier} type={media.format} />
                Unable to play
              </audio>
              {<div>
                <a href={termMap?.references?.value || media.identifier}>
                  If it isn't working try the publishers site instead <RiExternalLinkLine />
                </a>
              </div>}
            </>}
          </div>
          <Caption media={media} />
        </div>
      </li>
    })}
  </>
}

function MovingImages({ occurrence, termMap, ...props }) {
  return <>
    {occurrence.movingImages?.map((media, i) => {
      const knownFormat = ['video/mp4', 'video/ogg'].includes(media.format);
      return <li key={i}>
        <div css={mediaCard}>
          <div css={mediaArea}>
            {knownFormat && <>
              <video controls>
                <source src={media.identifier} type={media.format} />
                Unable to play
              </video>
              {<div>
                <a href={termMap?.references?.value || media.identifier}>
                  If it isn't working try the publishers site instead <RiExternalLinkLine />
                </a>
              </div>}
            </>}
            {!knownFormat && <a href={media.identifier} css={downloadMedia}>
              <div className="gb-download-icon"><MdFileDownload /></div>
              <div>Download media file</div>
            </a>}
          </div>
          <Caption media={media} />
        </div>
      </li>
    })}
  </>
}

function Caption({ media, ...props }) {
  return <figcaption>
    <Properties style={{ fontSize: '85%' }}>
      {['description', 'format', 'identifier', 'created', 'creator', 'license', 'publisher', 'references', 'rightsholder']
        .filter(x => media[x]).map(x => <React.Fragment key={x}>
          <Term>
            <FormattedMessage id={`occurrenceFieldNames.${x}`} />
          </Term>
          <Value>
            <HyperText inline text={media[x]} />
          </Value>
        </React.Fragment>)}
    </Properties>
  </figcaption>
}

const mediaList = css`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -6px;
  >li {
    display: block;
    flex: 0 1 calc(50%);
    padding: 12px 6px;
  }
`;

const mediaArea = ({ ...props }) => css`
  border-bottom: 1px solid #ddd;
  > div, a {
    color: inherit;
    text-decoration: none;
    text-align: center;
    display: block;
    /* img {
      height: 300px;
      width: auto;
    } */
  }
  audio, video {
    width: 100%;
  }
`;

const downloadMedia = ({ ...props }) => css`
  text-align: center;
  display: block;
  width: 300px;
  margin: auto;
  background: #ebebeb;
  border-radius: 4px;
  padding: 12px;
  .gb-download-icon {
    font-size: 30px;
  }
`;

const mediaCard = ({ ...props }) => css`
  background: white;
  font-size: 1em;
  img {
    width: 100%;
  }
  figure {
    margin: 0;
    padding: 0;
  }
  >div {
    padding: 12px;
  }
  figcaption {
    padding: 12px;
  }
`;