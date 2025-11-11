import React, { useContext, useState } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import {Row, Col, Tabs, Button} from "../../components";
import { TabPanel } from "../../components/Tabs/Tabs";
import {MdClose, MdContentCopy, MdFileDownloadDone, MdInfo} from "react-icons/md";
import {FilterContext} from "../../widgets/Filter/state";
import EventContext from "../../search/SearchContext";
import {filter2predicate} from "../../dataManagement/filterAdapter";
import env from "../../../.env.json";
import hash from "object-hash";
import {useGraphQLContext} from "../../dataManagement/api/GraphQLContext";
import QueryDetails from "./QueryDetails";

const { TabList, Tab, TapSeperator } = Tabs;

export function GraphQLSidebar({
  onCloseRequest,
  className,
  style,
  ...props
}) {

  const theme = useContext(ThemeContext);
  const [activeId, setTab] = useState('details');
  const [curlCopied, setCurlCopied] = useState(false);

  const getIcon = (icon) => {
    switch(icon) {
      case true:
        return <MdFileDownloadDone />;
      default:
        return <MdContentCopy/>;
    }
  }

  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(EventContext);
  const {query:{query: _query, size: limit , from: offset}} = useGraphQLContext();

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

  const queryUrl = env.GRAPH_API + "?queryId="+queryId + "&strict=true&variables=" + JSON.stringify(predicate);
  const curlUrl = "curl "+env.GRAPH_API +" -H '"+env.GRAPH_API+"' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' " +
      "-H 'Connection: keep-alive' -H 'DNT: 1' " +
      "-H 'Origin: "+env.GRAPH_API+"' " +
      "--data-binary " +
      "'{\"query\":\""+formattedQuery+"\"," +
      "\"variables\":"+JSON.stringify(predicate)+"}'"+
      " --compressed";

  const copyCurlUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(curlUrl)
          .then(() => {
            setCurlCopied(true);
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
        <TabPanel tabId='details' style={{ height: '100%' }} style={{"overflow-y": "scroll"}}>
          <Row direction="column" wrap="auto" style={{ maxHeight: '100%', overflow: 'hidden' }}>
            <Col align="left">
              <div style={{margin: "12px 0px", padding: "24px", background: "white", overflow: "hidden"}}>
                <h2>GraphQL Request details</h2>
                <br/>
                <Button appearance="primaryOutline" onClick={ () => window.open(queryUrl, '_blank', 'noopener,noreferrer') }>
                  Try on GraphQL
                </Button> &nbsp;
                <Button appearance="primaryOutline" onClick={copyCurlUrl}>{getIcon(curlCopied)} &nbsp;  Copy cURL command</Button>
                <p/>

                  <QueryDetails>
                    <div>
                      <h3>Query</h3>
                      <pre>{_query}</pre>
                      <h3>Variables</h3>
                      <pre>{JSON.stringify(predicate,undefined,2)}</pre>
                    </div>
                  </QueryDetails>
              </div>
            </Col>
          </Row>
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
};







