
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
// import * as css from './styles';
import { Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';

const { TabList, Tab, TabPanel } = Tabs;

export function CollectionPresentation({
  id,
  defaultTab = 'about',
  ...props
}) {
  const { data, error, loading, load } = useQuery(DATASET, { lazyLoad: true });
  const [activeId, setTab] = useState(defaultTab);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);

  return <>
    <div>
      <Row>
        <Col shrink={true} grow={true}>Back</Col>
        <Col shrink={false} grow={false}>doi, api, citation, help</Col>
      </Row>
    </div>
    <div>
      Header
      <Row>
        <Col>Image</Col>
        <Col>
          <div>
            <h1>Title</h1>
            <div>
              about intro
            </div>
          </div>
        </Col>
      </Row>
    </div>

    <Tabs activeId={activeId} onChange={id => setTab(id)}>
      <TabList style={{ paddingTop: '12px' }}>
        <Tab tabId="about">
          About
        </Tab>
        <Tab tabId="people">
          People
        </Tab>
        <Tab tabId="citations">
          Citations
        </Tab>
        <Tab tabId="specimens">
          Digitized specimens
        </Tab>
      </TabList>

      <section>
        <TabPanel tabId='about'>
          About page - registry style table for now
        </TabPanel>
        <TabPanel tabId='people'>
          People
        </TabPanel>
        <TabPanel tabId='citations'>
          Citations
      </TabPanel>
        <TabPanel tabId='specimens'>
          Specimens
        </TabPanel>
      </section>
    </Tabs>
  </>
};

const DATASET = `
query dataset($key: String!){
  dataset(key: $key) {
    title
    created
    description
    temporalCoverages
    logoUrl
    publishingOrganizationKey
    publishingOrganizationTitle
    contributors {
      firstName
      lastName
      position
      organization
      address
      userId
      type
      _highlighted
      roles
    }
    geographicCoverages {
      description
      boundingBox {
        minLatitude
        maxLatitude
        minLongitude
        maxLongitude
        globalCoverage
      }
    }
    taxonomicCoverages {
      description
      coverages {
        scientificName
        rank {
          interpreted
        }
      }
    }
    bibliographicCitations {
      identifier
      text
    }
    samplingDescription {
      studyExtent
      sampling
      qualityControl
      methodSteps
    } 
    citation {
      text
    }
    license
  }
}
`;

