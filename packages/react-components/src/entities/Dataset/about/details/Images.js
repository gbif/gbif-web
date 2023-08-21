import { jsx } from '@emotion/react';
import React from "react";
import { Button, Tooltip, OptImage, ResourceSearchLink } from "../../../../components";
import { FormattedMessage, FormattedNumber } from "react-intl";
import * as css from '../styles';
import { MdImage } from 'react-icons/md'

export function Images({
  dataset,
  images = [],
  ...props
}) {
  if (!(images?.documents?.total > 0)) return null;
  return <div css={css.galleryBar} {...props}>
    <div>
      {images.documents.results.map(occurrence => {
        return <div key={occurrence.key}>
          <OptImage src={occurrence.stillImages[0].identifier} h={300} />
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