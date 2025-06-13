import { ClusterIcon } from '@/components/icons/icons';
import { FormattedDateRange } from '@/components/message';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { TypeStatus } from '@/gql/graphql';
import { isPositiveNumber } from '@/utils/isPositiveNumber';
import { AiFillAudio } from 'react-icons/ai';
import { BsLightningFill } from 'react-icons/bs';
import { FaGlobeAfrica } from 'react-icons/fa';
import { GiDna1 } from 'react-icons/gi';
import {
  MdEvent,
  MdGridOn,
  MdImage,
  MdInsertDriveFile,
  MdLabel,
  MdLocationOn,
  MdPhotoLibrary,
  MdStar,
  MdVideocam,
} from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

type Props = {
  children?: React.ReactNode;
  eventDate?: string | null;
  iconsOnly?: boolean | null;
  formattedCoordinates?: string | null;
  countryCode?: string | null;
  locality?: string | null;
  isSpecimen?: boolean | null;
  isSequenced?: boolean | null;
  basisOfRecord?: string | null;
  stillImageCount?: number | null;
  movingImageCount?: number | null;
  soundCount?: number | null;
  isTreament?: boolean | null;
  typeStatus?: (TypeStatus | null)[] | null | undefined;
  isSamplingEvent?: boolean | null;
  isClustered?: boolean | null;
  issueCount?: number | null;
};

export function IconFeatures({
  eventDate,
  iconsOnly,
  formattedCoordinates,
  countryCode,
  locality,
  isSpecimen,
  basisOfRecord,
  stillImageCount,
  movingImageCount,
  soundCount,
  isSequenced,
  isTreament,
  typeStatus: typeStatusString,
  children,
  isSamplingEvent,
  isClustered,
  issueCount,
}: Props) {
  const typeStatus = typeStatusString?.[0];

  return (
    <div className="g-flex g-flex-wrap g-items-center g--m-1">
      {children && <div className="m-1">{children}</div>}
      {eventDate && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.eventDate">
          <div className="g-inline-flex g-items-start g-m-1">
            <MdEvent className="g-flex-none g-h-[1.2em]" />
            <span className="g-ml-3">
              <FormattedDateRange date={eventDate} />
            </span>
          </div>
        </SimpleTooltip>
      )}
      {formattedCoordinates && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.hasCoordinates">
          <div className="g-inline-flex g-items-start g-m-1">
            <MdLocationOn className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && <span className="g-ml-3">{formattedCoordinates}</span>}
          </div>
        </SimpleTooltip>
      )}
      {countryCode && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.hasCountry">
          <div className="g-inline-flex g-items-start g-m-1">
            <FaGlobeAfrica className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span className="g-ml-3">
                <span>{locality ? `${locality}, ` : ''}</span>
                <span>
                  <FormattedMessage id={`enums.countryCode.${countryCode}`} />
                </span>
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isSpecimen && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.isSpecimen">
          <div className="g-inline-flex g-items-start g-m-1">
            <MdLabel className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id={`enums.basisOfRecord.${basisOfRecord}`} />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isPositiveNumber(stillImageCount) && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.hasImages">
          <div className="g-inline-flex g-items-start g-m-1">
            {stillImageCount > 1 ? (
              <MdPhotoLibrary className="g-flex-none g-h-[1.2em]" />
            ) : (
              <MdImage className="g-flex-none g-h-[1.2em]" />
            )}
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id="counts.nImages" values={{ total: stillImageCount }} />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isPositiveNumber(movingImageCount) && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.hasVideo">
          <div className="g-inline-flex g-items-start g-m-1">
            <MdVideocam className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id="counts.nVideos" values={{ total: movingImageCount }} />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isPositiveNumber(soundCount) && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.hasSound">
          <div className="g-inline-flex g-items-start g-m-1">
            <AiFillAudio className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id="counts.nAudioFiles" values={{ total: soundCount }} />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isSequenced && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.isSequenced">
          <div className="g-inline-flex g-items-start g-m-1">
            <GiDna1 className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id="occurrenceDetails.features.isSequenced" />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isTreament && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.isTreatment">
          <div className="g-inline-flex g-items-start g-m-1">
            <MdInsertDriveFile className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id="occurrenceDetails.features.isTreatment" />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {typeStatus && typeStatus !== TypeStatus.Notatype && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.isType">
          <div className="g-inline-flex g-items-start g-m-1">
            <MdStar className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span style={getTypeStyle(typeStatus)}>
                <FormattedMessage id={`enums.typeStatus.${typeStatus}`} />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isSamplingEvent && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.isSamplingEvent">
          <div className="g-inline-flex g-items-start g-m-1">
            <MdGridOn className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id="occurrenceDetails.features.isSamplingEvent" />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isClustered && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.isClustered">
          <div className="g-inline-flex g-items-start g-m-1">
            <ClusterIcon className="g-flex-none g-h-[1.2em]" />
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id="occurrenceDetails.features.isClustered" />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
      {isPositiveNumber(issueCount) && (
        <SimpleTooltip i18nKey="occurrenceDetails.features.hasIssues">
          <div className="g-inline-flex g-items-start g-m-1">
            <BsLightningFill className="g-flex-none g-h-[1.2em]" style={{ color: 'orange' }} />
            {!iconsOnly && (
              <span className="g-ml-3">
                <FormattedMessage id="counts.nQualityFlags" values={{ total: issueCount }} />
              </span>
            )}
          </div>
        </SimpleTooltip>
      )}
    </div>
  );
}

function getTypeStyle(typeStatus?: TypeStatus | null) {
  if (typeStatus) {
    // Someone will ask at some point.
    // https://bugguide.net/node/view/359346
    // I've added SYNTYPE on the level of PARALECTOTYPE based on a comment in the link

    // Looking at shared images of types, the majority use nothing or red for any type.
    // But yellow is often used for paratypes though (e.g. AntWeb does so a lot)

    // how about 'EPITYPE', 'ISOTYPE', 'SYNTYPE' they seem to be on the level of paratype?

    if (['HOLOTYPE', 'LECTOTYPE', 'NEOTYPE'].includes(typeStatus))
      return { background: '#e2614a', color: 'white', padding: '0 8px', borderRadius: 2 };
    if (['PARATYPE', 'PARALECTOTYPE', 'SYNTYPE'].includes(typeStatus))
      return { background: '#f1eb0b', padding: '0 8px', borderRadius: 2 };
    if (['ALLOTYPE'].includes(typeStatus))
      return { background: '#7edaff', color: 'white', padding: '0 8px', borderRadius: 2 };
  }
}
