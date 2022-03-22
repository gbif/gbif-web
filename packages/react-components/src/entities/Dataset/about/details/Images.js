import { jsx } from '@emotion/react';
import React from "react";
import { Button, Tooltip, Image } from "../../../../components";
import { FormattedMessage, FormattedNumber } from "react-intl";
import * as css from '../styles';
import { MdImage } from 'react-icons/md'

export function Images({
  images = [],
  ...props
}) {
  if (!(images?.documents?.total > 0)) return null;
  return <div css={css.galleryBar} {...props}>
    <div>
      {images.documents.results.map(occurrence => {
        return <div key={occurrence.key}>
          <Image src={occurrence.stillImages[0].identifier} height={300} />
        </div>
      })}
    </div>
    <Tooltip title={<span>Records with images</span>} placement="auto">
      <Button look="primary" as="a" href="/">
        <MdImage style={{marginRight: 8}}/> <FormattedNumber value={images?.documents?.total} />
      </Button>
    </Tooltip>
  </div>
}