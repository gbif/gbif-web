import React, { useContext, useEffect, useState } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import {Row, Col, Tabs,Button} from "../../components";
import { TabPanel } from "../../components/Tabs/Tabs";
import {MdClose, MdInfo} from "react-icons/md";
import {FilterContext} from "../../widgets/Filter/state";
import EventContext from "../../search/SearchContext";
import {filter2predicate} from "../../dataManagement/filterAdapter";
import env from "../../../.env.json";
import hash from "object-hash";
import {useGraphQLContext} from "../../search/EventSearch/views/Api/GraphQLContext";
const { TabList, Tab, TapSeperator } = Tabs;

export function GraphQLSidebar({
  onCloseRequest,
  className,
  style,
  ...props
}) {

  const theme = useContext(ThemeContext);
  const [activeId, setTab] = useState('details');

  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(EventContext);

  const {query:graphQLQuery} = useGraphQLContext();
  const  {query: _query, size: limit , from: offset} = graphQLQuery;

  let filter = {
    type: 'and',
    predicates: [
      rootPredicate,
      filter2predicate(currentFilterContext.filter, predicateConfig)
    ].filter(x => x)
  };

  let predicate = {
    "predicate":filter,
    "limit": limit,
    "offset": offset
  }

  let queryId = hash(_query)
  let formattedQuery = _query.replace(/\n( *)/g, function (match, p1) {
    return '\\n'.repeat(1);
  })

  const queryUrl = env.EVENT_GRAPH_API + "?queryId="+queryId + "&strict=true&variables=" + JSON.stringify(predicate);
  const curlUrl = "curl "+env.EVENT_GRAPH_API +" -H '"+env.EVENT_GRAPH_API+"' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' " +
      "-H 'Connection: keep-alive' -H 'DNT: 1' " +
      "-H 'Origin: "+env.EVENT_GRAPH_API+"' " +
      "--data-binary " +
      "'{\"query\":\""+formattedQuery+"\"," +
      "\"variables\":"+JSON.stringify(predicate)+"}'"+
      " --compressed";

  function copyCurlUrl() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(curlUrl)
          .then(() => {
            //setCopyButtonText("Copied")
          })
          .catch((error) => { alert( error) })
    }
  }

  function copyUrl() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(queryUrl)
          .then(() => {
            //setCopyButtonText("Copied")
          })
          .catch((error) => { alert( error) })
    }
  }

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
        <TabPanel tabId='details' style={{ height: '100%' }}>
          <Row direction="column" wrap="auto" style={{ maxHeight: '100%', overflow: 'hidden' }}>
            <Col align="left">
              <h2>GraphQL Request details</h2>
              <Button onClick={copyCurlUrl}>Copy curl command</Button> &nbsp;
              <Button onClick={() => window.open(queryUrl, '_blank', 'noopener,noreferrer')}>
                Try on GraphQL
              </Button>
              <h3>Query</h3>
              <pre>{_query}</pre>
              <h3>Query variables</h3>
              <pre>{ JSON.stringify(predicate,undefined,2)}</pre>
            </Col>
          </Row>
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};







