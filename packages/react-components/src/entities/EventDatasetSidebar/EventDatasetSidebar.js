
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo, MdClose } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { Intro } from './details/Intro';
import { Header } from './details/Header';
import { Contacts } from './details/Contacts'
import { BibliographicCitations } from './details/BibliographicCitations'
import { SamplingDescription } from './details/SamplingDescription'
import { Citation } from './details/Citation'

const { TabList, Tab, TabPanel, TapSeperator } = Tabs;

export function EventDatasetSidebar({
  onImageChange,
  onCloseRequest,
  id,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(DATASET, { lazyLoad: true, graph: 'EVENT' });
  const [activeId, setTab] = useState(defaultTab || 'details');
  const theme = useContext(ThemeContext);
  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);

  return <Tabs activeId={activeId} onChange={id => setTab(id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar({ theme })}>
      <Col shrink={false} grow={false} css={css.detailDrawerBar({ theme })}>
        <TabList style={{ paddingTop: '12px' }} vertical>
          {onCloseRequest && <>
            <Tab direction="left" onClick={onCloseRequest}>
              <MdClose />
            </Tab>
            <TapSeperator vertical />
          </>}
          <Tab tabId="details" direction="left">
            <MdInfo />
          </Tab>
        </TabList>
      </Col>
      <Col shrink={false} grow={false} css={css.detailDrawerContent({ theme })} >
        <TabPanel tabId='details'>
          <Row direction="column">
            <Col style={{ padding: '12px 16px', paddingBottom: 50 }} grow>
              {/* <Header data={data} error={error} />
              <Intro data={data} loading={loading} error={error} />
              <SamplingDescription data={data} />
              <BibliographicCitations data={data} />
              <Contacts data={data} />
              <Citation data={data} /> */}
              {JSON.stringify(data)}
            </Col>
          </Row>
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};

const DATASET = `
query dataset($key: JSON!){
  eventSearch(predicate: {type: equals, key: "datasetKey", value: $key}) {
    documents(size: 1) {
      results {
        dataset
      }
    }
  }
}
`;

