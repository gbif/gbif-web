// @ts-nocheck
import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
// import { FilterContext } from '../../../../widgets/Filter/state';
import { useIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import {
  MdChevronRight,
  MdChevronLeft,
  MdFirstPage,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
// import { useUrlState } from '../../../../dataManagement/state/useUrlState';
import graphOfClusters, { highlightNode } from './clusterGraph';
import useBelow from '@/hooks/useBelow';
import { ViewHeader } from '@/components/ViewHeader';
import { Button } from '@/components/ui/button';
import { prettifyEnum } from '@/components/filters/displayNames';
import { Spinner } from '@/components/ui/spinner';
import { useNumberParam } from '@/hooks/useParam';
import { HelpText } from '@/components/helpText';
import styles from './cluster.module.css';
import DynamicHeightDiv from '@/components/DynamicHeightDiv';
import { Card, CardContent, CardHeader } from '@/components/ui/smallCard';
import { cn } from '@/utils/shadcn';

export const ClusterPresentation = ({
  reload,
  first,
  prev,
  next,
  size,
  from,
  error,
  graph,
  total,
  loading,
}) => {
  const intl = useIntl();
  const [activeKey, setActiveKey] = useNumberParam({ key: 'entity' });
  const ref = useRef(null);
  const [activeCluster, setActiveCluster] = useState();
  const [tooltipItem, setTooltipItem] = useState();
  const useMobileLayout = useBelow(1000);
  const [mobileTab, setMobileTab] = useState('clusters');

  const page = 1 + Math.floor(from / size);
  const totalPages = Math.ceil(total / size);

  const nextItem = useCallback(() => {
    if (!activeCluster) return;
    const clusterNodes = activeCluster.clusterNodes;
    const activeIndex = clusterNodes.findIndex((x) => x === activeKey);
    const next = activeIndex === clusterNodes.length - 1 ? 0 : activeIndex + 1;
    if (clusterNodes[next]) {
      setActiveKey(clusterNodes[next]);
    }
  }, [activeKey, activeCluster]);

  const previousItem = useCallback(() => {
    if (!activeCluster) return;
    const clusterNodes = activeCluster.clusterNodes;
    const activeIndex = clusterNodes.findIndex((x) => x === activeKey);
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
          setTooltipItem,
        });
      } else {
        graphOfClusters({
          element: ref.current,
          nodes_data: [],
          links_data: [],
          onNodeClick: ({ key }) => {
            setActiveKey(key);
          },
          setTooltipItem,
        });
      }
    }
  }, [ref, graph]);

  return (
    <>
      <DynamicHeightDiv
        minPxHeight={500}
        className="g-flex g-flex-col"
      >
        <ViewHeader loading={loading} total={total} className="g-flex-none">
          <div style={{ flex: '1 1 auto' }}></div>
          {/* {useMobileLayout && <div><DropdownButton look="primaryOutline"
          label={<FormattedMessage id={`search.occurrenceClustersView.${mobileTab}`} />}
          menuItems={menuState => [
            <DropdownButton.MenuAction onClick={e => { setMobileTab('about'); menuState.hide() }}><FormattedMessage id="search.occurrenceClustersView.about" /></DropdownButton.MenuAction>,
            <DropdownButton.MenuAction onClick={e => { setMobileTab('clusters'); menuState.hide() }}><FormattedMessage id="search.occurrenceClustersView.clusters" /></DropdownButton.MenuAction>,
          ]} /></div>} */}
        </ViewHeader>
        <div className="gbif-main g-flex g-flex-row g-flex-1 g-basis-full g-h-1 g-gap-2">
          {error && (
            <div className="requestError g-text-center g-mt-24 g-flex-auto">
              <FormattedMessage id={`phrases.failedToLoadData`} />
              <div className="g-mt-8">
                <Button onClick={reload}>
                  <FormattedMessage id={`phrases.retry`} />
                </Button>
              </div>
            </div>
          )}
          {!error && (
            <Card
              className="clusterWrapper g-flex-auto g-basis-full g-flex g-flex-col g-border g-rounded g-bg-white"
              style={useMobileLayout && mobileTab !== 'clusters' ? { display: 'none' } : {}}
            >
              <div className="g-w-full g-flex-auto g-overflow-hidden g-relative">
                <div
                  id="gb-cluster-tooltip"
                  className="tooltipWrapper g-absolute g-invisible g-z-[1000] g-pointer-events-none"
                >
                  <div
                    id="gb-cluster-tooltip-content"
                    className="tooltipContent g-absolute g-p-2 g-h-auto g-bg-slate-800 g-text-white g-rounded g-text-xs g-w-auto g-max-w-[450px]"
                  >
                    {tooltipItem && (
                      <>
                        {tooltipItem.link && (
                          <>
                            {tooltipItem.link?.reasons?.length > 0 && (
                              <div>
                                <div>
                                  <FormattedMessage id="search.occurrenceClustersView.aboutLink" />
                                </div>
                                <ul style={{ whiteSpace: 'pre' }}>
                                  {tooltipItem.link.reasons.map((x) => (
                                    <li>
                                      <FormattedMessage
                                        id={`enums.clusterReasons.${x}`}
                                        defaultMessage={prettifyEnum(x)}
                                      />{' '}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div>
                              {tooltipItem.link.source.taxonKey !==
                                tooltipItem.link.target.taxonKey && (
                                <div>
                                  <FormattedMessage id="search.occurrenceClustersView.hasMultipleTaxonKeys" />
                                </div>
                              )}
                              {tooltipItem.link.source.publishingOrgKey !==
                                tooltipItem.link.target.publishingOrgKey && (
                                <div>
                                  <FormattedMessage id="search.occurrenceClustersView.differentPublishers" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        {tooltipItem.node && (
                          <>
                            {tooltipItem.node.type === 'DELETED' && (
                              <div>
                                <FormattedMessage id="search.occurrenceClustersView.isDeleted" />
                              </div>
                            )}
                            {tooltipItem.node.basisOfRecord && (
                              <div style={{ whiteSpace: 'nowrap' }}>
                                <FormattedMessage id="occurrenceFieldNames.basisOfRecord" />:{' '}
                                <FormattedMessage
                                  id={`enums.basisOfRecord.${tooltipItem.node.basisOfRecord}`}
                                />
                              </div>
                            )}
                            {!tooltipItem.node.basisOfRecord &&
                              tooltipItem.node.type !== 'DELETED' && (
                                <div>
                                  <FormattedMessage
                                    id={`search.occurrenceClustersView.nodeType.${tooltipItem.node.type}`}
                                  />
                                </div>
                              )}
                            {tooltipItem.node.isTreatment && (
                              <div>
                                <FormattedMessage
                                  id={`search.occurrenceClustersView.nodeType.TREATMENT`}
                                />
                              </div>
                            )}
                            {tooltipItem.node.distinctTaxa > 1 && (
                              <div>
                                <FormattedMessage id="search.occurrenceClustersView.hasMultipleTaxonKeys" />
                              </div>
                            )}
                            {tooltipItem.node.capped && (
                              <div>
                                <FormattedMessage id="search.occurrenceClustersView.isCapped" />
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {loading && !graph && (
                  <div style={{ margin: '48px auto', width: 100 }}>
                    <Spinner />
                  </div>
                )}
                {graph && (
                  <svg
                    className={`${styles.clusters} g-rounded-t`}
                    ref={ref}
                    style={{
                      pointerEvents: loading ? 'none' : null,
                      filter: loading ? 'grayscale(8)' : null,
                      opacity: loading ? 0.5 : 1,
                    }}
                  ></svg>
                )}
              </div>
              {next && (
                <div className="footer g-bg-white g-rounded-b g-h-10 g-flex g-flex-row g-px-2 g-items-center g-border-t">
                  {total > 0 && (
                    <span className="footerText g-flex-grow g-text-xs">
                      <FormattedMessage
                        id="pagination.pageXofY"
                        defaultMessage={'Loading'}
                        values={{
                          current: <FormattedNumber value={page} />,
                          total: <FormattedNumber value={totalPages} />,
                        }}
                      />
                    </span>
                  )}
                  {first && page > 2 && (
                    <Button
                      variant="ghost"
                      className="footerItem"
                      tip={intl.formatMessage({ id: 'pagination.first' })}
                      onClick={first}
                    >
                      <MdFirstPage />
                    </Button>
                  )}
                  {prev && page > 1 && (
                    <Button
                      variant="ghost"
                      className="footerItem"
                      tip={intl.formatMessage({ id: 'pagination.previous' })}
                      onClick={prev}
                    >
                      <MdChevronLeft />
                    </Button>
                  )}
                  {next && page < totalPages && (
                    <Button
                      variant="ghost"
                      className="footerItem"
                      tip={intl.formatMessage({ id: 'pagination.next' })}
                      onClick={next}
                    >
                      <MdChevronRight />
                    </Button>
                  )}
                </div>
              )}
            </Card>
          )}
          {(!useMobileLayout || mobileTab === 'about') && (
            <div
              className={cn(
                'g-flex-grow g-flex-shrink-0 g-basis-[280px] g-overflow-x-auto',
                '[&::-webkit-scrollbar]:g-w-1 [&::-webkit-scrollbar-track]:g-bg-gray-100 [&::-webkit-scrollbar-thumb]:g-bg-gray-300'
              )}
            >
              <InfoCard headline={<FormattedMessage id={`phrases.about`} />} collapsed={true}>
                <HelpText
                  identifier="cluster-explorer"
                  className="helptext g-prose g-text-sm"
                ></HelpText>
              </InfoCard>
              <InfoCard
                headline={<FormattedMessage id={`phrases.legend`} />}
                collapsible={false}
                className="g-mt-2"
              >
                <LegendItem
                  message={
                    <FormattedMessage id={`search.occurrenceClustersView.nodeType.SPECIMEN`} />
                  }
                >
                  <div
                    style={{ borderRadius: '50%', width: 25, height: 25, background: '#fab93d' }}
                  ></div>
                </LegendItem>
                <LegendItem
                  message={
                    <FormattedMessage id={`search.occurrenceClustersView.nodeType.OBSERVATION`} />
                  }
                >
                  <div
                    style={{ borderRadius: '50%', width: 25, height: 25, background: '#5295a4' }}
                  ></div>
                </LegendItem>
                <LegendItem
                  message={
                    <FormattedMessage id={`search.occurrenceClustersView.nodeType.TREATMENT`} />
                  }
                >
                  <div
                    style={{ borderRadius: '50%', width: 25, height: 25, background: '#56bda7' }}
                  ></div>
                </LegendItem>
                <LegendItem
                  message={
                    <FormattedMessage id={`search.occurrenceClustersView.hasMultipleTaxonKeys`} />
                  }
                >
                  <div
                    className={styles.stripes}
                    style={{ borderRadius: '50%', width: 25, height: 25 }}
                  ></div>
                </LegendItem>
                <LegendItem
                  message={
                    <FormattedMessage id={`search.occurrenceClustersView.nodeType.SEQUENCE`} />
                  }
                >
                  <div
                    style={{ borderRadius: '50%', width: 15, height: 15, background: '#e9c0dc' }}
                  ></div>
                </LegendItem>
                <LegendItem
                  message={<FormattedMessage id={`search.occurrenceClustersView.nodeType.TYPE`} />}
                >
                  <div
                    style={{
                      borderRadius: '50%',
                      width: 15,
                      height: 15,
                      background: 'rgb(203, 56, 53)',
                    }}
                  ></div>
                </LegendItem>
                <LegendItem
                  message={<FormattedMessage id={`search.occurrenceClustersView.nodeType.IMAGE`} />}
                >
                  <div
                    style={{
                      borderRadius: '50%',
                      width: 15,
                      height: 15,
                      background: 'rgb(44, 79, 123)',
                    }}
                  ></div>
                </LegendItem>
                <LegendItem
                  message={
                    <FormattedMessage id={`search.occurrenceClustersView.differentPublishers`} />
                  }
                >
                  <div style={{ width: 25, height: 3, background: 'pink' }}></div>
                </LegendItem>
                <LegendItem
                  message={<FormattedMessage id={`search.occurrenceClustersView.samePublishers`} />}
                >
                  <div style={{ width: 15, height: 3, background: 'deepskyblue' }}></div>
                </LegendItem>
                <LegendItem
                  message={<FormattedMessage id={`search.occurrenceClustersView.entryPoint`} />}
                >
                  <div
                    style={{
                      borderRadius: '50%',
                      width: 25,
                      height: 25,
                      border: '3px solid #888888',
                    }}
                  ></div>
                </LegendItem>
              </InfoCard>
            </div>
          )}
        </div>
      </DynamicHeightDiv>
    </>
  );
};

function InfoCard({ headline, children, style, className, collapsible = true, collapsed = false }) {
  const [expanded, setExpanded] = useState(!collapsed);
  return (
    <Card style={style} className={cn(className)}>
      <CardHeader className="g-flex g-flex-row g-items-center">
        <h2 className="g-flex-1">{headline}</h2>
        {collapsible && (
          <button className="g-flex-0" variant="ghost" onClick={() => setExpanded(!expanded)}>
            {expanded ? <MdExpandMore /> : <MdExpandLess />}
          </button>
        )}
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="content g-text-sm">{children}</div>
        </CardContent>
      )}
    </Card>
  );
}

function LegendItem({ message, children }) {
  return (
    <div className="legendItem g-flex g-flex-row g-items-center g-gap-1 g-mb-1 g-text-sm">
      <div className="g-flex-0 g-w-10 [&_div]:g-mx-auto">{children}</div>
      <div className="g-flex-1">{message}</div>
    </div>
  );
}
