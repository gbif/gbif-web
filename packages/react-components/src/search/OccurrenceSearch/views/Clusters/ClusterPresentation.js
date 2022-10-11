import { jsx } from '@emotion/react';
import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
// import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { DetailsDrawer, Button, OptImage as Image } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { ViewHeader } from '../ViewHeader';
import { MdChevronRight, MdChevronLeft, MdFirstPage, MdExpandMore, MdExpandLess } from "react-icons/md";
// import { useUrlState } from '../../../../dataManagement/state/useUrlState';
import { useQueryParam, NumberParam } from 'use-query-params';
import ThemeContext from '../../../../style/themes/ThemeContext';
import * as d3 from 'd3';
import test, { highlightNode } from './test';
import { prettifyEnum } from '../../../../utils/labelMaker/config2labels';

import * as css from './styles';

export const ClusterPresentation = ({ reload, first, prev, next, size, from, error, data, graph, total, loading }) => {
  const theme = useContext(ThemeContext);
  const intl = useIntl();
  const [activeKey, setActiveKey] = useQueryParam('entity', NumberParam);
  const ref = useRef(null);
  const [activeCluster, setActiveCluster] = useState();
  const [tooltipItem, setTooltipItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.occurrenceSearch?.documents?.results || [];

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
    // d3.select(ref.current)
    //  .append('p')
    //  .text('Hello from D3');
    if (ref && ref.current) {
      if (graph) {
        test({
          element: ref.current,
          nodes_data: graph.nodes,
          links_data: graph.links,
          onNodeClick: ({ key }) => {
            setActiveKey(key);
          },
          setTooltipItem
        })
      } else {
        test({
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
      <ViewHeader loading={loading} total={total} />
      <div css={css.main}>
        {error && <div css={css.requestError}>
          Failed to load data
          <div>
            <Button onClick={reload}>Retry</Button>
          </div>
        </div>}
        {!error && <div css={css.clusterWrapper}>
          <div>
            <div id="gb-cluster-tooltip" css={css.tooltipWrapper}>
              <div id="gb-cluster-tooltip-content" css={css.tooltipContent}>
                {tooltipItem && <>
                  {tooltipItem.link && <>
                    {tooltipItem.link?.reasons?.length > 0 && <div>
                      About the link: {tooltipItem.link.reasons.map(x => <span>{prettifyEnum(x)} </span>)}
                    </div>}
                    <div>
                      {tooltipItem.link.source.taxonKey !== tooltipItem.link.target.taxonKey && <div>
                        Identifications differ
                      </div>}
                      {tooltipItem.link.source.publishingOrgKey !== tooltipItem.link.target.publishingOrgKey && <div>
                        Different publishers
                      </div>}
                    </div>
                  </>}
                  {tooltipItem.node && <>
                    {tooltipItem.node.type === 'DELETED' && <div>This record has since been deleted</div>}
                    {tooltipItem.node.basisOfRecord && <div style={{ whiteSpace: 'nowrap' }}>Basis of record: <FormattedMessage id={`enums.basisOfRecord.${tooltipItem.node.basisOfRecord}`} /></div>}
                    {!tooltipItem.node.basisOfRecord && <div>{tooltipItem.node.type}</div>}
                    {tooltipItem.node.isTreatment && <div>Treatment</div>}
                    {tooltipItem.node.distinctTaxa > 1 && <div>Cluster contains different identifications</div>}
                    {tooltipItem.node.capped && <div>This node has more connections, than shown here. Go to the record to see the full list.</div>}
                    {/* {tooltipItem.node.image && <div>
                      <Image src={tooltipItem.node.image.identifier} w={200}/></div>} */}
                  </>}
                </>}
              </div>
            </div>
            <svg css={css.clusters} ref={ref} style={{ pointerEvents: loading ? 'none' : null, filter: loading ? 'grayscale(8)' : null, opacity: loading ? 0.5 : 1 }}></svg>
          </div>
          {next && <div css={css.footer({ theme })}>
            {first && page > 2 && <Button appearance="text" css={css.footerItem({ theme })} direction="right" tip={intl.formatMessage({ id: 'pagination.first' })} onClick={first}>
              <MdFirstPage />
            </Button>}
            {prev && page > 1 && <Button appearance="text" css={css.footerItem({ theme })} direction="right" tip={intl.formatMessage({ id: 'pagination.previous' })} onClick={prev}>
              <MdChevronLeft />
            </Button>}
            {total > 0 && <span css={css.footerText({ theme })}>
              <FormattedMessage
                id='pagination.pageXofY'
                defaultMessage={'Loading'}
                values={{ current: <FormattedNumber value={page} />, total: <FormattedNumber value={totalPages} /> }}
              />
            </span>}
            {next && page < totalPages && <Button appearance="text" css={css.footerItem({ theme })} direction="left" tip={intl.formatMessage({ id: 'pagination.next' })} onClick={next}>
              <MdChevronRight />
            </Button>}
          </div>}
        </div>}
        <div css={css.meta}>
          <InfoCard headline="About" >
          <p style={{fontWeight: 800}}>This is an experimental feature</p>

          <p>GBIF automatically detects records that may be related. Examples could be a specimen sequenced by another institution, type material deposited at different institutions, or two people reporting the same bird at the same location and time.</p>
          <p>This view shows the first N occurrences from the result, and for each record shows the related records. The same cluster may appear multiple times as it is not a list of distinct clusters, but of the occurrences.</p>
          </InfoCard>
          <InfoCard headline="Legend" collapsible={false} style={{ marginTop: 8 }}>
            <div css={css.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 25, height: 25, background: '#fab93d' }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Specimen</div>
            </div>
            <div css={css.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 25, height: 25, background: '#5295a4' }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Observation</div>
            </div>
            <div css={css.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 25, height: 25, background: '#56bda7' }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Treatment</div>
            </div>
            <div css={css.legendItem}>
              <div>
                <div css={css.stripes} style={{ borderRadius: '50%', width: 25, height: 25 }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Contains differemt identifications</div>
            </div>
            <div css={css.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 15, height: 15, background: '#e9c0dc' }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Sequence</div>
            </div>
            <div css={css.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 15, height: 15, background: 'rgb(203, 56, 53)' }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Type specimen</div>
            </div>
            <div css={css.legendItem}>
              <div>
                <div style={{ borderRadius: '50%', width: 15, height: 15, background: 'rgb(44, 79, 123)' }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Images</div>
            </div>
            <div css={css.legendItem}>
              <div>
                <div style={{ width: 25, height: 3, background: 'pink' }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Different publishers</div>
            </div>
            <div css={css.legendItem}>
              <div>
                <div style={{ width: 15, height: 3, background: 'deepskyblue' }}></div>
              </div>
              <div style={{ flex: '1 1 auto;' }}>Same publisher</div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  </>
}

function InfoCard({ headline, children, style, collapsible = true, collapsed = false, props }) {
  const [expanded, setExpanded] = useState(!collapsed);
  return <div css={css.card} style={style}>
    <div css={css.headline}>
      <h2>{headline}</h2>
      {collapsible && <Button appearance="text" onClick={() => setExpanded(!expanded)} >
        {expanded ? <MdExpandMore /> : <MdExpandLess />}
      </Button>}
    </div>
    {expanded && <div css={css.contentWrapper}>
      <div css={css.content}>
        {children}
      </div>
    </div>}
  </div>;
}