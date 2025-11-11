import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { AiFillAudio } from 'react-icons/ai';
import { BsLightningFill } from 'react-icons/bs';
import { FaGlobeAfrica } from 'react-icons/fa';
import { GiDna1 } from 'react-icons/gi';
import { IoPinSharp as OccurrenceIcon } from 'react-icons/io5';
import {
  MdEvent,
  MdGridOn,
  MdImage,
  MdInsertDriveFile,
  MdLabel,
  MdLink,
  MdLocationOn,
  MdPhotoLibrary,
  MdStar,
  MdVideocam,
} from 'react-icons/md';
import { RiArchiveDrawerFill as CollectionIcon } from 'react-icons/ri';
import { FormattedMessage } from 'react-intl';
import { Classification } from '../../components/Classification/Classification';
import ThemeContext from '../../style/themes/ThemeContext';
import { ClusterIcon, GbifLogoIcon } from '../Icons/Icons';
import { FormattedDateRange } from '../Message/Message';
import { Tooltip } from '../Tooltip/Tooltip';
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
  if (Array.isArray(typeStatusString)) typeStatusString = typeStatusString?.[0];
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
  return (
    <div css={css.iconFeatures({ theme })} {...props}>
      {children && <div>{children}</div>}
      {eventDate && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.eventDate" />}>
          <div>
            <MdEvent />
            <span>
              <FormattedDateRange date={eventDate} />
            </span>
          </div>
        </Tooltip>
      )}
      {formattedCoordinates && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.hasCoordinates" />}>
          <div>
            <MdLocationOn />
            {!iconsOnly && <span>{formattedCoordinates}</span>}
          </div>
        </Tooltip>
      )}
      {countryCode && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.hasCountry" />}>
          <div>
            <FaGlobeAfrica />
            {!iconsOnly && (
              <span>
                <span>{locality ? locality + ', ' : ''}</span>
                <span>
                  <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                </span>
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {isSpecimen && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.isSpecimen" />}>
          <div>
            <MdLabel />
            {!iconsOnly && (
              <span>
                <FormattedMessage id={`enums.basisOfRecord.${basisOfRecord}`} />
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {stillImageCount > 0 && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.hasImages" />}>
          <div>
            {stillImageCount > 1 ? <MdPhotoLibrary /> : <MdImage />}
            {!iconsOnly && (
              <span>
                <FormattedMessage id="counts.nImages" values={{ total: stillImageCount }} />
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {movingImageCount > 0 && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.hasVideo" />}>
          <div>
            <MdVideocam />
            {!iconsOnly && (
              <span>
                <FormattedMessage id="counts.nVideos" values={{ total: movingImageCount }} />
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {soundCount > 0 && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.hasSound" />}>
          <div>
            <AiFillAudio />
            {!iconsOnly && (
              <span>
                <FormattedMessage id="counts.nAudioFiles" values={{ total: soundCount }} />
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {isSequenced && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.isSequenced" />}>
          <div>
            <GiDna1 />
            {!iconsOnly && (
              <span>
                <FormattedMessage id="occurrenceDetails.features.isSequenced" />
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {isTreament && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.isTreament" />}>
          <div>
            <MdInsertDriveFile />
            {!iconsOnly && (
              <span>
                <FormattedMessage id="occurrenceDetails.features.isTreatment" />
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {typeStatus && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.isType" />}>
          <div>
            <MdStar />
            {!iconsOnly && <span style={typeStyle}>{typeStatus}</span>}
          </div>
        </Tooltip>
      )}
      {isSamplingEvent && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.isSamplingEvent" />}>
          <div>
            <MdGridOn />
            {!iconsOnly && (
              <span>
                <FormattedMessage id="occurrenceDetails.features.isSamplingEvent" />
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {isClustered && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.isClustered" />}>
          <div>
            <ClusterIcon />
            {!iconsOnly && (
              <span>
                <FormattedMessage id="occurrenceDetails.features.isClustered" />
              </span>
            )}
          </div>
        </Tooltip>
      )}
      {issueCount > 0 && (
        <Tooltip title={<FormattedMessage id="occurrenceDetails.features.hasIssues" />}>
          <div>
            <BsLightningFill style={{ color: 'orange' }} />
            {!iconsOnly && (
              <span>
                <FormattedMessage id="counts.nQualityFlags" values={{ total: issueCount }} />
              </span>
            )}
          </div>
        </Tooltip>
      )}
    </div>
  );
}

IconFeatures.propTypes = {
  as: PropTypes.element,
};

export function FeatureList(props) {
  return <div css={css.iconFeatures({})} {...props} />;
}

function Hostname({ href }) {
  try {
    const hostname = new URL(href).hostname;
    return <a href={href}>{hostname}</a>;
  } catch (err) {
    return <span>invalid</span>;
  }
}

export function GenericFeature({ style, className, children, ...props }) {
  return (
    <div css={css.iconFeature()} {...{ style, className }} {...props}>
      {children}
    </div>
  );
}

export function Homepage({ href, style, className, ...props }) {
  if (!href) return null;
  return (
    <GenericFeature>
      <MdLink />
      <span>
        <Hostname href={href} {...props} />
      </span>
    </GenericFeature>
  );
}

export function OccurrenceCount({
  count,
  messageId = 'counts.nOccurrences',
  zeroMessage,
  values,
  ...props
}) {
  const message =
    zeroMessage && !count ? (
      <FormattedMessage id={zeroMessage} />
    ) : (
      <FormattedMessage id={messageId} values={values || { total: count }} />
    );
  return (
    <GenericFeature>
      <OccurrenceIcon />
      <span style={{ color: !count && 'var(--color300)' }}>{message}</span>
    </GenericFeature>
  );
}

export function GbifCount({ count, messageId = 'counts.nOccurrences', values, ...props }) {
  return (
    <GenericFeature>
      <GbifLogoIcon />
      <span>
        <FormattedMessage id={messageId} values={values || { total: count }} />
      </span>
    </GenericFeature>
  );
}

export function CollectionsCount({ count, ...props }) {
  return (
    <GenericFeature>
      <CollectionIcon />
      <span>
        <FormattedMessage id="counts.nCollections" values={{ total: count }} />
      </span>
    </GenericFeature>
  );
}

export function Location({ count, countryCode, city, locality, children, ...props }) {
  return (
    <GenericFeature>
      <FaGlobeAfrica />
      <Classification>
        {countryCode && (
          <span>
            <FormattedMessage id={`enums.countryCode.${countryCode}`} />
          </span>
        )}
        {city && <span>{city}</span>}
        {locality && <span>{locality}</span>}
        {children}
      </Classification>
    </GenericFeature>
  );
}
