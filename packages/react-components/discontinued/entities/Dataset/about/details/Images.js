import { jsx, css } from '@emotion/react';
import React from "react";
import { Button, Tooltip, OptImage, ResourceSearchLink } from "../../../../components";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { MdImage } from 'react-icons/md'

export function Images({
  dataset,
  images = [],
  ...props
}) {
  if (!(images?.documents?.total > 0)) return null;
  return <div css={galleryBar} {...props}>
    <div>
      {images.documents.results.map(occurrence => {
        return <div key={occurrence.key}>
          <OptImage w={300} src={occurrence.stillImages[0].identifier} />
        </div>
      })}
    </div>
    <Tooltip title={<span>Records with images</span>} placement="auto">
      <ResourceSearchLink type="occurrenceSearch" queryString={`datasetKey=${dataset.key}&view=GALLERY`} discreet >
        <Button look="primary" >
          <MdImage style={{ marginRight: 8 }} /> <FormattedNumber value={images?.documents?.total} />
        </Button>
      </ResourceSearchLink>
    </Tooltip>
  </div>
}



const galleryHeight = '200';
const galleryBar = css`
  height: ${galleryHeight}px;
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 0 -6px;
  > a {
    position: absolute;
    margin: 12px;
    bottom: 0;
    right: 0;
  }
  > div {
    display: flex;
    overflow-x: auto;
    height: ${galleryHeight + 100}px;
    padding-bottom: 100px;
    > div {
      margin-right: 10px;
      flex: 0 0 auto;
      height: ${galleryHeight}px;
    }
  }
  img, .gb-image-failed {
    display: block;
    height: ${galleryHeight}px;
    margin: 0 6px;
    max-width: initial;
  }
  .gb-image-failed {
    > div {
      height: 100%;
      margin: auto;
      padding: 24px 50px;
      font-size: 24px;
      color: var(--color100);
      background: rgba(0,0,0,.05);
    }
  }
`;