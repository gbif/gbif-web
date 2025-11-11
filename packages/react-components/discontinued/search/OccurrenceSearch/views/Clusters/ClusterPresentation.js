import { jsx, css } from '@emotion/react';
import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
// import { FilterContext } from '../../../../widgets/Filter/state';
import { useIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { DetailsDrawer, Button, DropdownButton, HelpText } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { MdChevronRight, MdChevronLeft, MdFirstPage, MdExpandMore, MdExpandLess } from "react-icons/md";
// import { useUrlState } from '../../../../dataManagement/state/useUrlState';
import { useQueryParam, NumberParam } from 'use-query-params';
import ThemeContext from '../../../../style/themes/ThemeContext';
import graphOfClusters, { highlightNode } from './clusterGraph';
import { prettifyEnum } from '../../../../utils/labelMaker/config2labels';

import * as styles from './styles';
import { ResultsHeader } from '../../../ResultsHeader';
import useBelow from '../../../../utils/useBelow';
import { CircularLoader, EllipsisLoader } from '../../../../components/Loaders';

export const ClusterPresentation = ({ reload, first, prev, next, size, from, error, data, graph, total, loading }) => {
  const theme = useContext(ThemeContext);
  const intl = useIntl();
  const [activeKey, setActiveKey] = useQueryParam('entity', NumberParam);
  const ref = useRef(null);
  const [activeCluster, setActiveCluster] = useState();
  const [tooltipItem, setTooltipItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });
  const useMobileLayout = useBelow(1000);
  const [mobileTab, setMobileTab] = useState('clusters');

  const page = 1 + Math.floor(from / size);
  const totalPages = Math.ceil(total / size);

  useEffect(() => {
    if (activeKey) {
      dialog.show();
      const clusterKey = graph.nodes.find(x => x.name === '' + activeKey).rootKey;
      const cluster = graph.clusterMap[clusterKey];
      setActiveCluster(cluster);
      highlightNode({
        element: ref.current,
        key: activeKey
      });
    } else {
      dialog.hide();
      // setActiveCluster();
      highlightNode({
        element: ref.current
      });
    }
  }, [activeKey]);

  useUpdateEffect(() => {
    if (!dialog.visible) {
      setActiveKey();
    }
  }, [dialog.visible]);

  const nextItem = useCallback(() => {
    if (!activeCluster) return;
    const clusterNodes = activeCluster.clusterNodes;
    const activeIndex = clusterNodes.findIndex(x => x === activeKey);
    const next = activeIndex === clusterNodes.length - 1 ? 0 : activeIndex + 1;
    if (clusterNodes[next]) {
      setActiveKey(clusterNodes[next]);
    }
  }, [activeKey, activeCluster]);

  const previousItem = useCallback(() => {
    if (!activeCluster) return;
    const clusterNodes = activeCluster.clusterNodes;
    const activeIndex = clusterNodes.findIndex(x => x === activeKey);
    const prev = activeIndex === 0 ? clusterNodes.length - 1 : activeIndex - 1;
    if (clusterNodes[prev]) {
      setActiveKey(clusterNodes[prev]);
    }
  }, [activeKey, activeCluster]);

  useEffect(() => {
    if (ref && ref.current) {
      if (graph) {
        graphOfClusters({
          element: ref.current,
          nodes_data: graph.nodes,
          links_data: graph.links,
          onNodeClick: ({ key }) => {
            setActiveKey(key);
          },
          setTooltipItem
        })
      } else {
        graphOfClusters({
          element: ref.current,
          nodes_data: [],
          links_data: [],
          onNodeClick: ({ key }) => {
            setActiveKey(key);
          },
          setTooltipItem
        })
      }
    }
  }, [ref, graph]);

  return <>
    {dialog.visible && <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeKey}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeKey} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>}
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      <ResultsHeader loading={loading} total={total}>
        <div style={{ flex: '1 1 auto' }}></div>
        {useMobileLayout && <div><DropdownButton look="primaryOutline"
          label={<FormattedMessage id={`search.occurrenceClustersView.${mobileTab}`} />}
          menuItems={menuState => [
            <DropdownButton.MenuAction onClick={e => { setMobileTab('about'); menuState.hide() }}><FormattedMessage id="search.occurrenceClustersView.about" /></DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setMobileTab('clusters'); menuState.hide() }}><FormattedMessage id="search.occurrenceClustersView.clusters" /></DropdownButton.MenuAction>,
          ]} /></div>}
      </ResultsHeader>
      <div css={styles.main}>
        {error && <div css={styles.requestError}>
        <FormattedMessage id={`phrases.failedToLoadData`} />
          <div>
            <Button onClick={reload}><FormattedMessage id={`phrases.retry`} /></Button>
          </div>
        </div>}
        {!error && <div css={styles.clusterWrapper} style={(useMobileLayout && mobileTab !== 'clusters') ? {display: 'none'} : {} }>
          <div>
            <div id="gb-cluster-tooltip" css={styles.tooltipWrapper}>
              <div id="gb-cluster-tooltip-content" css={styles.tooltipContent}>
                {tooltipItem && <>
                  {tooltipItem.link && <>
                    {tooltipItem.link?.reasons?.length > 0 && <div>
                      <div><FormattedMessage id="search.occurrenceClustersView.aboutLink" /></div>
                      <ul style={{ whiteSpace: 'pre' }}>
                        {tooltipItem.link.reasons.map(x => <li><FormattedMessage id={`enums.clusterReasons.${x}`} defaultMessage={prettifyEnum(x)}/> </li>)}
                      </ul>
                    </div>}
                    <div>
                      {tooltipItem.link.source.taxonKey !== tooltipItem.link.target.taxonKey && <div>
                        <FormattedMessage id="search.occurrenceClustersView.hasMultipleTaxonKeys" />
                      </div>}
                      {tooltipItem.link.source.publishingOrgKey !== tooltipItem.link.target.publishingOrgKey && <div>
                        <FormattedMessage id="search.occurrenceClustersView.differentPublishers" />
                      </div>}
                    </div>
                  </>}
                  {tooltipItem.node && <>
                    {tooltipItem.node.type === 'DELETED' && <div><FormattedMessage id="search.occurrenceClustersView.isDeleted" /></div>}
                    {tooltipItem.node.basisOfRecord && <div style={{ whiteSpace: 'nowrap' }}><FormattedMessage id="occurrenceFieldNames.basisOfRecord" />: <FormattedMessage id={`enums.basisOfRecord.${tooltipItem.node.basisOfRecord}`} /></div>}
                    {!tooltipItem.node.basisOfRecord && tooltipItem.node.type !== 'DELETED' && <div><FormattedMessage id={`search.occurrenceClustersView.nodeType.${tooltipItem.node.type}`} /></div>}
                    {tooltipItem.node.isTreatment && <div><FormattedMessage id={`search.occurrenceClustersView.nodeType.TREATMENT`} /></div>}
                    {tooltipItem.node.distinctTaxa > 1 && <div><FormattedMessage id="search.occurrenceClustersView.hasMultipleTaxonKeys" /></div>}
                    {tooltipItem.node.capped && <div><FormattedMessage id="search.occurrenceClustersView.isCapped" /></div>}
                    {/* I've decided not to add images as they often are slow to load, and since there can be many image per record, it doesn't tell you if they are the same anyway. */}
                    {/* {tooltipItem.node.image && <div>
                      <img src={tooltipItem.node.image.identifier} width={200}/></div>} */}
                  </>}
                </>}
              </div>
            </div>
            {loading && !graph && <div style={{margin: '48px auto', width: 100}}><EllipsisLoader /></div>}
            {graph && <svg css={styles.clusters} ref={ref} style={{ pointerEvents: loading ? 'none' : null, filter: loading ? 'grayscale(8)' : null, opacity: loading ? 0.5 : 1 }}></svg>}
          </div>
          {next && <div css={styles.footer({ theme })}>
            {first && page > 2 && <Button appearance="text" css={styles.footerItem({ theme })} direction="right" tip={intl.formatMessage({ id: 'pagination.first' })} onClick={first}>
              <MdFirstPage />
            </Button>}
            {prev && page > 1 && <Button appearance="text" css={styles.footerItem({ theme })} direction="right" tip={intl.formatMessage({ id: 'pagination.previous' })} onClick={prev}>
              <MdChevronLeft />
            </Button>}
            {total > 0 && <span css={styles.footerText({ theme })}>
              <FormattedMessage
                id='pagination.pageXofY'
                defaultMessage={'Loading'}
                values={{ current: <FormattedNumber value={page} />, total: <FormattedNumber value={totalPages} /> }}
              />
            </span>}
            {next && page < totalPages && <Button appearance="text" css={styles.footerItem({ theme })} direction="left" tip={intl.formatMessage({ id: 'pagination.next' })} onClick={next}>
              <MdChevronRight />
            </Button>}
          </div>}
        </div>}
        {(!useMobileLayout || mobileTab === 'about') && <div css={styles.meta}>
          <InfoCard headline={<FormattedMessage id={`phrases.about`} />} >
            <HelpText identifier="cluster-explorer" css={css`
              margin-block: 12px; 
              blockquote {
                margin: 12px 0;
                padding: 5px 20px;
                background-color: var(--color600);
                color: var(--background);
              }
            `}>
            </HelpText>
          </InfoCard>
          <InfoCard headline={<FormattedMessage id={`phrases.legend`} />} collapsible={false} style={{ marginTop: 8 }}>
            <div css={styles.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 25, height: 25, background: '#fab93d' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.nodeType.SPECIMEN`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 25, height: 25, background: '#5295a4' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.nodeType.OBSERVATION`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 25, height: 25, background: '#56bda7' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.nodeType.TREATMENT`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div css={styles.stripes} style={{ borderRadius: '50%', width: 25, height: 25 }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.hasMultipleTaxonKeys`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 15, height: 15, background: '#e9c0dc' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.nodeType.SEQUENCE`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 15, height: 15, background: 'rgb(203, 56, 53)' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.nodeType.TYPE`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 15, height: 15, background: 'rgb(44, 79, 123)' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.nodeType.IMAGE`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div style={{ width: 25, height: 3, background: 'pink' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.differentPublishers`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div style={{ width: 15, height: 3, background: 'deepskyblue' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.samePublishers`} /></div>
            </div>
            <div css={styles.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 25, height: 25, border: '3px solid #888888' }}></div>
              </div>
              <div style={{ flex: '1 1 auto' }}><FormattedMessage id={`search.occurrenceClustersView.entryPoint`} /></div>
            </div>
          </InfoCard>
        </div>}
      </div>
    </div>
  </>
}

function InfoCard({ headline, children, style, collapsible = true, collapsed = false, props }) {
  const [expanded, setExpanded] = useState(!collapsed);
  return <div css={styles.card} style={style}>
    <div css={styles.headline}>
      <h2>{headline}</h2>
      {collapsible && <Button appearance="text" onClick={() => setExpanded(!expanded)} >
        {expanded ? <MdExpandMore /> : <MdExpandLess />}
      </Button>}
    </div>
    {expanded && <div css={styles.contentWrapper}>
      <div css={styles.content}>
        {children}
      </div>
    </div>}
  </div>;
}