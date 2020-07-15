/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ThemeContext from '../../style/themes/ThemeContext';
import { MdLocationOn, MdEvent, MdInsertDriveFile, MdLabel, MdImage } from 'react-icons/md';
import { GiDna1 } from 'react-icons/gi';
import { FaGlobeAfrica } from 'react-icons/fa';
import { ClusterIcon } from '../Icons/Icons';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as css from './styles';

export function IconFeatures({
  isSequenced,
  isTreament,
  isSpecimen,
  isClustered,
  formattedCoordinates,
  eventDate,
  hasImage,
  typeStatus,
  basisOfRecord,
  countryCode,
  locality,
  children,
  ...props
}) {
  const theme = useContext(ThemeContext);
  return <div css={css.iconFeatures({ theme })} {...props}>
    {children && <div>{children}</div>}
    {eventDate && <div>
      <MdEvent />
      <span>
        <FormattedDate value={eventDate}
          year="numeric"
          month="long"
          day="2-digit" />
      </span>
    </div>}
    {isSpecimen && <div><MdLabel /><span><FormattedMessage id={`enums.basisOfRecord.${basisOfRecord}`} /></span></div>}
    {hasImage && <div><MdImage /><span>Image</span></div>}
    {isSequenced && <div><GiDna1 /><span>Sequenced</span></div>}
    {isTreament && <div><MdInsertDriveFile /><span>Treatment</span></div>}
    {typeStatus && <div style={{background: '#00000010'}}><span><FormattedMessage id={`enums.typeStatus.${typeStatus}`} /></span></div>}
    {formattedCoordinates && <div><MdLocationOn /><span>{formattedCoordinates}</span></div>}
    {countryCode && <div><FaGlobeAfrica /><span><FormattedMessage id={`enums.countryCode.${countryCode}`} />{locality}</span></div>}
    {isClustered && <div><ClusterIcon /><span>Clustered</span></div>}
  </div>
};

IconFeatures.propTypes = {
  as: PropTypes.element
};
