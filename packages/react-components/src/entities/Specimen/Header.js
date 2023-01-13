import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ThemeContext from '../../style/themes/ThemeContext';
import { Row, Col, IconFeatures, Eyebrow, Tag, Tooltip, Classification, GadmClassification, ResourceLink } from "../../components";
import { iconFeature } from '../../components/IconFeatures/styles';
import { MdPeople, MdAccessTime } from 'react-icons/md';
import { Globe } from './Globe';
import useBelow from '../../utils/useBelow';
import { FaGlobeAfrica, FaTag } from 'react-icons/fa';
import { AiFillTag } from 'react-icons/ai';
import { BsLightningFill } from 'react-icons/bs';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain, HeaderInfoEdit } from '../shared/header';
import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature, GbifCount } from '../../components/IconFeatures/IconFeatures';

export function Header({
  data,
  termMap,
  loading,
  error,
  className,
  children,
  ...props
}) {
  const isBelow = useBelow(500);
  const theme = useContext(ThemeContext);
  const item = {
    gadm: {
      "level0": {
        "gid": "GRD",
        "name": "Denmark"
      },
      "level1": {
        "gid": "GRD.4_1",
        "name": "Syddanmark"
      },
      "level2": {
        "gid": "GRD.4_1",
        "name": "Kolding"
      }
    },
    globe: {
      lat: 50,
      lon: 12
    }
  };
  return <HeaderWrapper>
    <Row wrap="no-wrap" css={header({ theme })} {...props}>
      {!isBelow &&
        <Col grow={false} style={{ marginRight: 18 }}>
          <Globe {...item.globe} style={{ width: 120, height: 120 }} />
        </Col>
      }
      <Col grow>
        <div>
          <Eyebrow
            prefix='Catalog number'
            suffix='C-F-136872' />

          <Headline>
            <i>Cortinarius Koldingensis</i>
          </Headline>
          {/* <div style={{ marginTop: 8 }}>
            From <Classification style={{display: 'inline'}}>
              <span>
                <ResourceLink type="institutionKey" id="1cfca87c-083e-4d67-8e60-cb7d311f6058">Harvard University, Museum of Comparative Zoology</ResourceLink>
              </span>
              <span style={{ marginTop: 4 }}>
                <ResourceLink type="collectionKey" id="42844cb6-421e-4bcf-bdeb-c56039bee08c">Entomology</ResourceLink>
              </span>
            </Classification>
          </div> */}

          <HeaderInfoWrapper>
            <HeaderInfoMain>
              <FeatureList style={{ marginTop: 8, alignItems: 'flex-start' }}>
                <GenericFeature>
                  <MdAccessTime />
                  <div>
                    <FormattedDate value="2010-10-09" year="numeric" month="long" day="2-digit" />
                  </div>
                </GenericFeature>

                <GenericFeature>
                  <FaGlobeAfrica />
                  <div>
                    <GadmClassification gadm={item.gadm} />
                    <div>Marielund skov</div>
                  </div>
                </GenericFeature>
              </FeatureList>

              <IconFeatures css={features({ theme })}
                stillImageCount={5}
                typeStatus={['HOLOTYPE']}
                basisOfRecord={item.basisOfRecord}
                isSequenced={true}
                isTreament={false}
                isClustered={true}
                isSamplingEvent={false}
              // issueCount={item?.issues?.length}
              // link={termMap.references?.value}
              />
            </HeaderInfoMain>
          </HeaderInfoWrapper>
        </div>
      </Col>
    </Row>
    {children}
  </HeaderWrapper>
};

const header = ({ ...props }) => css`
  margin: 0 16px;
  .gbif-header-location {
    font-size: 13px;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
`;

const entitySummary = ({ ...props }) => css`
  /* font-size: 13px; */
  margin-top: 12px;
  margin-bottom: 12px;
`;

const features = ({ ...props }) => css`
  margin-top: 4px;
  margin-bottom: 4px;
`;