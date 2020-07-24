/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ThemeContext from '../../style/themes/ThemeContext';
import { MdGridOn, MdVideocam, MdLocationOn, MdEvent, MdInsertDriveFile, MdLabel, MdImage, MdPhotoLibrary, MdStar } from 'react-icons/md';
import { GiDna1 } from 'react-icons/gi';
import { FaGlobeAfrica } from 'react-icons/fa';
import { ClusterIcon } from '../Icons/Icons';
import { BsLightningFill } from 'react-icons/bs';
import { AiFillAudio } from 'react-icons/ai';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as css from './styles';

export function IconFeatures({
  isSequenced,
  isTreament,
  isSpecimen,
  isClustered,
  isSamplingEvent,
  formattedCoordinates,
  eventDate,
  stillImageCount,
  movingImageCount,
  soundCount,
  typeStatus,
  basisOfRecord,
  countryCode,
  locality,
  issueCount,
  children,
  iconsOnly,
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
    {formattedCoordinates && <div><MdLocationOn />{!iconsOnly && <span>{formattedCoordinates}</span>}</div>}
    {countryCode && <div><FaGlobeAfrica />{!iconsOnly && <span><FormattedMessage id={`enums.countryCode.${countryCode}`} />{locality}</span>}</div>}
    {isSpecimen && <div><MdLabel />{!iconsOnly && <span><FormattedMessage id={`enums.basisOfRecord.${basisOfRecord}`} /></span>}</div>}
    {stillImageCount > 0 && <div>
      {stillImageCount > 1 ? <MdPhotoLibrary /> : <MdImage />}
      {!iconsOnly && <span>{stillImageCount} image(s)</span>}
    </div>}
    {movingImageCount > 0 && <div><MdVideocam />{!iconsOnly && <span>{movingImageCount} video(s)</span>}</div>}
    {soundCount > 0 && <div><AiFillAudio />{!iconsOnly && <span>{soundCount}sound file(s)</span>}</div>}
    {isSequenced && <div><GiDna1 />{!iconsOnly && <span>Sequenced</span>}</div>}
    {isTreament && <div><MdInsertDriveFile />{!iconsOnly && <span>Treatment</span>}</div>}
    {typeStatus && <div><MdStar />{!iconsOnly && <span style={typeStatus === 'HOLOTYPE' ? { background: '#e2614a', color: 'white', padding: '0 8px', borderRadius: 2 } : null}>
      <FormattedMessage id={`enums.typeStatus.${typeStatus}`} />
    </span>}</div>}
    {isSamplingEvent && <div><MdGridOn />{!iconsOnly && <span>Sampling event</span>}</div>}
    {isClustered && <div><ClusterIcon />{!iconsOnly && <span>Clustered</span>}</div>}
    {issueCount > 0 && <div><BsLightningFill style={{ color: 'orange' }} />{!iconsOnly && <span>{issueCount} quality flags</span>}</div>}
  </div>
};

IconFeatures.propTypes = {
  as: PropTypes.element
};
