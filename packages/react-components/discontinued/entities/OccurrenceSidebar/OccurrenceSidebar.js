
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo, MdInsertPhoto, MdClose, MdExtension } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import * as css from './styles';
import { Properties, Row, Col, Tabs, ErrorBoundary } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { ImageDetails } from './details/ImageDetails';
import { Intro } from './details/Intro';
import { Cluster } from './details/Cluster';
import { ClusterIcon } from '../../components/Icons/Icons';
import LinksContext from '../../search/OccurrenceSearch/config/links/LinksContext';
import { Extensions } from './details/Extensions';

const { TabList, Tab, TabPanel, TapSeperator } = Tabs;

export function OccurrenceSidebar(props) {
  return <ErrorBoundary invalidateOn={props.id}>
    <OccurrenceSidebarCore {...props} />
  </ErrorBoundary>
}

export function OccurrenceSidebarCore({
  onImageChange,
  onCloseRequest,
  id,
  defaultTab,
  className,
  style,
  ...props
}) {
  const links = useContext(LinksContext);

  // Get the keys for custom dataset links and custom taxon links
  const linkKeys = Object.keys(links).map(k => links[k]?.key).filter(k => !!k).join('\n')
  
  const { data, error, loading, load } = useQuery(OCCURRENCE(linkKeys), { lazyLoad: true, throwAllErrors: true });
  const [activeId, setTab] = useState(defaultTab || 'details');
  const theme = useContext(ThemeContext);
  const [activeImage, setActiveImage] = useState();
  const [fieldGroups, setFieldGroups] = useState();

  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);

  useEffect(() => {
    if (!loading && activeId === 'images' && data?.occurrence?.stillImageCount === 0) {
      setTab('details');
    }
    const hasExtensions = Object.keys(data?.occurrence?.extensions || {}).find(x => data?.occurrence?.extensions[x]);
    if (!loading && data && activeId === 'extensions' && !hasExtensions) {
      setTab('details');
    }
    if (!loading && data?.occurrence) {
      setFieldGroups(data.occurrence.groups);
    }
  }, [data, defaultTab, loading]);

  const isSpecimen = get(data, 'occurrence.basisOfRecord', '').indexOf('SPECIMEN') > -1;
  const hasExtensions = Object.keys(data?.occurrence?.extensions || {}).find(x => data?.occurrence?.extensions[x]);

  return <Tabs activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerBar({ theme })}>
        <TabList aria-label="Images" style={{ paddingTop: '12px' }} vertical>
          {onCloseRequest && <>
            <Tab direction="left" onClick={onCloseRequest}>
              <MdClose />
            </Tab>
            <TapSeperator vertical />
          </>}
          <Tab tabId="details" direction="left">
            <MdInfo />
          </Tab>
          {data?.occurrence?.stillImageCount > 0 && <Tab tabId="images" direction="left">
            <MdInsertPhoto />
          </Tab>}
          {data?.occurrence?.volatile?.features?.isClustered && <Tab tabId="cluster" direction="left">
            <ClusterIcon />
          </Tab>}
          {hasExtensions && <Tab tabId="extensions" direction="left">
            <MdExtension title="Extensions"/>
          </Tab>}
        </TabList>
      </Col>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='images'>
          <ImageDetails activeImage={activeImage} setActiveImage={setActiveImage} data={data} loading={loading} error={error} />
        </TabPanel>
        <TabPanel tabId='details' style={{height: '100%'}}>
          <Intro setActiveImage={id => { setActiveImage(id); setTab('images') }} fieldGroups={fieldGroups} isSpecimen={isSpecimen} data={data} loading={loading} error={error} />
        </TabPanel>
        <TabPanel tabId='cluster'>
          <Cluster data={data} loading={loading} error={error} />
        </TabPanel>
        <TabPanel tabId='extensions'>
          <Extensions data={data} loading={loading} error={error} />
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
  // return <Div css={styles.occurrenceDrawer({ theme })} {...props}>
  //   <Properties style={{ fontSize: 13, maxWidth: 600 }} horizontal={true}>
  //     <Term>Description</Term>
  //     <Value>
  //       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.
  //   </Value>
  //   </Properties>
  // </Div>
};


const OCCURRENCE = (linkKeys) => `
query occurrence($key: ID!){
  occurrence(key: $key) {
    key
    coordinates
    countryCode
    eventDate
    typeStatus
    issues
    ${linkKeys || ''}
    institution {
      name
      key
    }
    collection {
      name
      key
    }
    volatile {
      globe(sphere: false, land: false, graticule: false) {
        svg
        lat
        lon
      }
      features {
        isSpecimen
        isTreament
        isSequenced
        isClustered
        isSamplingEvent
      }
    }
    datasetKey,
    datasetTitle
    publishingOrgKey,
    publisherTitle,
    dataset {
      citation {
        text
      }
    }
    institutionCode
    recordedByIDs {
      value
      person(expand: true) {
        name
        birthDate
        deathDate
        image
      }
    }
    identifiedByIDs {
      value
      person(expand: true) {
        name
        birthDate
        deathDate
        image
      }
    }

    gadm

    stillImageCount
    movingImageCount
    soundCount
    stillImages {
      type
      format
      identifier
      thumbnail: thumbor(height: 240, fitIn: true)
      large: thumbor(height: 1000, fitIn: true)
      created
      creator
      license
      publisher
      references
      rightsHolder
      description
    }

    gbifClassification {
      kingdom
      kingdomKey
      phylum
      phylumKey
      class
      classKey
      order
      orderKey
      family
      familyKey
      genus
      genusKey
      species
      speciesKey
      synonym
      classification {
        key
        rank
        name
      }
      usage {
        rank
        formattedName
        key
      }
      acceptedUsage {
        formattedName
        key
      }
    }

    primaryImage {
      identifier
    }

    terms {
      simpleName
      verbatim
      value
      htmlValue
      remarks
      issues
    }

    extensions {
      amplification
      germplasmAccession
      germplasmMeasurementScore
      germplasmMeasurementTrait
      germplasmMeasurementTrial
      identification
      identifier
      measurementOrFact
      reference
      resourceRelationship
      cloning
      gelImage
      loan
      materialSample
      permit
      preparation
      preservation
      extendedMeasurementOrFact
      chronometricAge
      dnaDerivedData
      audubon
      multimedia
      image
    }
  }
}
`;

