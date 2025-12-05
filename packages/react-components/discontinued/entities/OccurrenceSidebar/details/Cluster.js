
import { jsx, css } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from '../styles';
import { Row, Col, Image, Properties, IconFeatures, ResourceLink } from "../../../components";
import { useQuery } from '../../../dataManagement/api';
import { Header } from './Header';
import { prettifyEnum } from '../../../utils/labelMaker/config2labels';
import env from '../../../../.env.json';

import { useUrlState } from '../../../dataManagement/state/useUrlState';
import { FormattedMessage } from 'react-intl';

const { Term: T, Value: V } = Properties;

export function Cluster({
  data,
  loading: keyLoading,
  activeImage, setActiveImage,
  className,
  ...props
}) {
  const [setActiveKey] = useUrlState({ param: 'entity' });
  const theme = useContext(ThemeContext);
  const { data: cluster, error, loading: clusterLoading, load } = useQuery(CLUSTER, { lazyLoad: true });

  useEffect(() => {
    if (typeof data !== 'undefined') {
      load({ variables: { key: data.occurrence.key } });
    }
  }, [data]);

  const related = cluster?.occurrence?.related?.relatedOccurrences;
  if (!data || clusterLoading || !related) {
    return <div>Loading</div>;
  }

  return <div style={{ padding: '12px 16px' }}>
    {/* Based on feedback in https://github.com/gbif/hosted-portals/issues/263 I have removed the header and instead repeated the information in a format similar to the other clustered records */}
    {/* <Header data={data} /> */}
    <div>
      <RelatedOccurrence onClick={e => setActiveKey(data.occurrence.key)} related={data.occurrence} css={css`
        border-color: var(--primary);
        background: var(--paperBackground700);
        border-radius: var(--borderRadiusPx);
      `}/>
      {related.map(x => {
        if (x.occurrence) {
          return <RelatedOccurrence key={x.occurrence.key} onClick={e => setActiveKey(x.occurrence.key)} related={x.occurrence} reasons={x.reasons} original={data.occurrence} />;
        } else {
          return <div style={{padding: 30, background: 'tomato', color: 'white', borderRadius: 4}}>
            <FormattedMessage id="search.occurrenceClustersView.isDeleted" />
            <div>
              <Properties style={{ marginTop: 12 }} horizontal dense>
                <T style={{color: 'white'}}><FormattedMessage id="occurrenceDetails.publisher" /></T><V>{x.stub.publishingOrgName}</V>
                {/* We can no longer show the original dataset name as the API has been changed.  */}
                {/* <T style={{color: 'white'}}>Dataset</T><V>{x.stub.datasetName}</V> */}
                {x.stub.catalogNumber && <><T style={{color: 'white'}}><FormattedMessage id="occurrenceFieldNames.catalogNumber" /></T><V>{x.stub.catalogNumber}</V></>}
                {x.stub.occurrenceID && <><T style={{color: 'white'}}><FormattedMessage id="occurrenceFieldNames.occurrenceID" /></T><V>{x.stub.occurrenceID}</V></>}
              </Properties>
            </div>
          </div>
        }
      })}
    </div>
  </div>
};

export function RelatedOccurrence({ original, reasons, related, ...props }) {
  const theme = useContext(ThemeContext);
  
  return <article css={styles.clusterCard({ theme })} {...props}>
    <Row wrap="nowrap" halfGutter={6} style={{ padding: 12 }}>
      <Col>
        <h4 style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: related.gbifClassification.usage.formattedName }}></h4>
        <div css={styles.entitySummary({ theme })}>
          <IconFeatures css={styles.features({ theme })}
            eventDate={related.eventDate}
            countryCode={related.countryCode}
            locality={related.locality}
          />
          <IconFeatures css={styles.features({ theme })}
            stillImageCount={related.stillImageCount}
            movingImageCount={related.movingImageCount}
            soundCount={related.soundCount}
            typeStatus={related.typeStatus}
            basisOfRecord={related.basisOfRecord}
            isSequenced={related.volatile.features.isSequenced}
            isTreament={related.volatile.features.isTreament}
            isClustered={related.volatile.features.isClustered}
            isSamplingEvent={related.volatile.features.isSamplingEvent}
            issueCount={related.issues?.length}
          />
        </div>
        <div style={{ fontSize: 12 }}>
          <Properties horizontal dense>
            <T><FormattedMessage id="occurrenceDetails.publisher" /></T><V>{related.publisherTitle}</V>
            <T><FormattedMessage id="occurrenceDetails.dataset" /></T><V>{related.datasetTitle}</V>
          </Properties>
          <a onClick={e => e.stopPropagation()} href={`${env.GBIF_ORG}/occurrence/${related.key}`}><FormattedMessage id="phrases.viewOnGBif" /></a>
        </div>
      </Col>
      <Col grow={false} shrink={false}>
        <div >
          {related?.primaryImage?.identifier && <Image style={{ width: 150, height: 150, display: 'block' }} src={related.primaryImage.identifier} w={180} h={180} />}
          {!related?.primaryImage?.identifier && related?.coordinates?.lat && <img style={{ width: 150, height: 150, display: 'block' }} src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${related.coordinates.lon},${related.coordinates.lat})/${related.coordinates.lon},${related.coordinates.lat},8,0/180x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />}
        </div>
      </Col>
    </Row>
    <div css={styles.clusterFooter({ theme })}>
      {!reasons && <div><FormattedMessage id="search.occurrenceClustersView.currentRecord" /></div>}
      {reasons && <Properties style={{ fontSize: 12 }} horizontal dense>
        <T><FormattedMessage id="search.occurrenceClustersView.similarities" /></T>
        <V>{ reasons.map(reason => <span css={styles.chip({ theme })} key={reason}>
          <FormattedMessage id={`enums.clusterReasons.${reason}`} defaultMessage={prettifyEnum(reason)} />
        </span>) }</V>
      </Properties>}
    </div>
  </article>
};

const CLUSTER = `
query occurrence($key: ID!){
  occurrence(key: $key) {
  	related {
      relatedOccurrences {
        reasons
        stub {
          gbifId
          occurrenceID
          catalogNumber
          publishingOrgKey
          publishingOrgName
          datasetKey
        }
        occurrence {
          key
          basisOfRecord
          datasetTitle
          publisherTitle
          coordinates
          typeStatus
          soundCount
          stillImageCount
          movingImageCount
          eventDate
          primaryImage {
            identifier
          }
          gbifClassification {
            usage {
              formattedName
            }
          }
          volatile {
            features {
              isSequenced
              isSamplingEvent
              isTreament
            }
          }
        }
      }
    }
  }
}
`;