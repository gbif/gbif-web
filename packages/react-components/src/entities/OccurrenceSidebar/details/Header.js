
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, IconFeatures, Eyebrow } from "../../../components";
import { Globe } from './Globe';
import useBelow from '../../../utils/useBelow';

export function Header({
  data,
  loading,
  error,
  className,
  ...props
}) {
  const isBelow = useBelow(500);
  const theme = useContext(ThemeContext);
  const item = data?.occurrence;
  return <Row wrap="no-wrap" css={css.header({ theme })} {...props}>
    {!isBelow && data?.occurrence?.volatile?.globe &&
      <Col grow={false} style={{ marginRight: 18 }}>
        <Globe {...data?.occurrence?.volatile?.globe} />
      </Col>
    }
    <Col grow>
      <div css={css.headline({ theme })}>
        <Eyebrow 
          style={{fontSize: '80%'}}
          prefix={<FormattedMessage id="occurrenceDetails.occurrence" />} 
          suffix={data?.occurrence?.eventDate ? 
            <FormattedDate value={data?.occurrence?.eventDate}
              year="numeric"
              month="long"
              day="2-digit" /> : 
            <FormattedMessage id="phrases.unknownDate"/>} 
            />
        <h3 dangerouslySetInnerHTML={{ __html: data?.occurrence?.gbifClassification?.usage?.formattedName }}></h3>
        {/* <div style={{color: 'orange', marginTop: 4}}>Published as: Polycauliona polycarpa hoffman</div> */}
        {/* <div style={{fontSize: 13}}><MajorRanks taxon={data?.occurrence?.gbifClassification} rank={data?.occurrence?.gbifClassification?.usage?.rank}/></div> */}
      </div>
      {/* <div>Engkabelej</div> */}
      {/* <div style={{fontSize: 12, marginTop: 18}}><MdLocationOn /> <FormattedMessage id={`enums.countryCode.${data?.occurrence?.countryCode}`} /></div> */}
      <div css={css.entitySummary({ theme })}>
        <IconFeatures css={css.features({ theme })}
        eventDate={item.eventDate}
        countryCode={item.countryCode}
        locality={item.locality}
        />
        {/* Only show first type status in header - it is considered very very unlikely that this will every happen and also make sense */}
        <IconFeatures css={css.features({ theme })}
          stillImageCount={item.stillImageCount}
          movingImageCount={item.movingImageCount}
          soundCount={item.soundCount}
          typeStatus={item?.typeStatus?.[0]}
          basisOfRecord={item.basisOfRecord}
          isSequenced={item.volatile.features.isSequenced}
          isTreament={item.volatile.features.isTreament}
          isClustered={item.volatile.features.isClustered}
          isSamplingEvent={item.volatile.features.isSamplingEvent}
          issueCount={item?.issues?.length}
        />
      </div>
    </Col>
  </Row>
};
