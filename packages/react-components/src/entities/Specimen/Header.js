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
  specimen,
  loading,
  error,
  className,
  children,
  ...props
}) {
  const isBelow = useBelow(500);
  const theme = useContext(ThemeContext);
  if (!specimen || loading) return null;

  const { decimalLatitude, decimalLongitude, gbif } = specimen?.collectionEvent?.location?.georeference ?? {};
  const eventDate = specimen?.collectionEvent?.eventDate;

  const item = {
    globe: {
      lat: Number.parseFloat(decimalLatitude),
      lon: Number.parseFloat(decimalLongitude)
    }
  };

  if (gbif) {
    gbif.forEach(x => {
      if (x.source === 'http://gadm.org/') {
        x.name = x.title;
      }
    });
    const gadm = {
      "level0": gbif.find(x => x.type === 'GADM0'),
      "level1": gbif.find(x => x.type === 'GADM1'),
      "level2": gbif.find(x => x.type === 'GADM2'),
      "level3": gbif.find(x => x.type === 'GADM3'),
    };
    item.gadm = gadm;
  }

  const isSequenced = specimen.sequences.material.length > 0 || specimen.sequences.parts.length > 0 || specimen?.catalogItem?.associatedSequences || specimen?.sequences?.external.length > 0;
  const currentScientificName = specimen?.identifications?.current?.taxa?.[0]?.scientificName
  
  return <HeaderWrapper>
    <Row wrap="no-wrap" css={header({ theme })} {...props}>
      {!isBelow && !!item.globe.lat &&
        <Col grow={false} style={{ marginRight: 18 }}>
          <Globe {...item.globe} style={{ width: 120, height: 120 }} />
        </Col>
      }
      <Col grow>
        <div>
          <Eyebrow
            prefix='Catalog number'
            suffix={specimen?.catalogItem?.catalogNumber} />

          <Headline>
            {currentScientificName || 'No identification provided'}
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
                {eventDate && <GenericFeature>
                  <MdAccessTime />
                  <div>
                    <FormattedDate value={eventDate} year="numeric" month="long" day="2-digit" />
                  </div>
                </GenericFeature>}

                {(item.gadm || specimen?.collectionEvent?.location?.locality) && <GenericFeature>
                  <FaGlobeAfrica />
                  <div>
                    {item.gadm && <GadmClassification gadm={item.gadm} />}
                    {specimen?.collectionEvent?.location?.locality && <div>{specimen.collectionEvent.location.locality}</div>}
                  </div>
                </GenericFeature>}
              </FeatureList>

              <IconFeatures css={features({ theme })}
                stillImageCount={specimen?.media?.images?.specimen?.length}
                typeStatus={[specimen?.identifications?.current?.typeStatus]}
                isSequenced={isSequenced}
                isTreament={false}
                isClustered={false}
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