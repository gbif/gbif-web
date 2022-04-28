
import { jsx } from '@emotion/react';
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
  typeStatus: typeStatusString,
  basisOfRecord,
  countryCode,
  locality,
  issueCount,
  children,
  iconsOnly,
  ...props
}) {
  const theme = useContext(ThemeContext);
  let typeStyle;
  const typeStatus = typeStatusString === 'NOTATYPE' ? null : typeStatusString;
  if (typeStatus) {
    // Someone will ask at some point. 
    // https://bugguide.net/node/view/359346
    // I've added SYNTYPE on the level of PARALECTOTYPE based on a comment in the link

    // Looking at shared images of types, the majority use nothing or red for any type.
    // But yellow is often used for paratypes though (e.g. AntWeb does so a lot)

    // how about 'EPITYPE', 'ISOTYPE', 'SYNTYPE' they seem to be on the level of paratype?
    
    if (['HOLOTYPE', 'LECTOTYPE', 'NEOTYPE'].includes(typeStatus))
      typeStyle = { background: '#e2614a', color: 'white', padding: '0 8px', borderRadius: 2 };
    if (['PARATYPE', 'PARALECTOTYPE', 'SYNTYPE'].includes(typeStatus))
      typeStyle = { background: '#f1eb0b', padding: '0 8px', borderRadius: 2 };
    if (['ALLOTYPE'].includes(typeStatus))
      typeStyle = { background: '#7edaff', color: 'white', padding: '0 8px', borderRadius: 2 };
  }
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
      {!iconsOnly && <span><FormattedMessage id="counts.nImages" values={{ total: stillImageCount }} /></span>}
    </div>}
    {movingImageCount > 0 && <div><MdVideocam />{!iconsOnly && <span><FormattedMessage id="counts.nVideos" values={{ total: movingImageCount }} /></span>}</div>}
    {soundCount > 0 && <div><AiFillAudio />{!iconsOnly && <span><FormattedMessage id="counts.nAudioFiles" values={{ total: soundCount }} /></span>}</div>}
    {isSequenced && <div><GiDna1 />{!iconsOnly && <span><FormattedMessage id="occurrenceDetails.features.isSequenced" /></span>}</div>}
    {isTreament && <div><MdInsertDriveFile />{!iconsOnly && <span><FormattedMessage id="occurrenceDetails.features.isTreatment" /></span>}</div>}
    {typeStatus && <div><MdStar />{!iconsOnly && <span style={typeStyle}>
      <FormattedMessage id={`enums.typeStatus.${typeStatus}`} />
    </span>}</div>}
    {isSamplingEvent && <div><MdGridOn />{!iconsOnly && <span><FormattedMessage id="occurrenceDetails.features.isSamplingEvent" /></span>}</div>}
    {isClustered && <div><ClusterIcon />{!iconsOnly && <span><FormattedMessage id="occurrenceDetails.features.isClustered" /></span>}</div>}
    {issueCount > 0 && <div><BsLightningFill style={{ color: 'orange' }} />{!iconsOnly && <span><FormattedMessage id="counts.nQualityFlags" values={{ total: issueCount }} /></span>}</div>}
  </div>
};

IconFeatures.propTypes = {
  as: PropTypes.element
};
