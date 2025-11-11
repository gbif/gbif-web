export { MapThumbnail } from './MapThumnail';

import { jsx, css } from '@emotion/react';
import React from 'react';
import { h2 as h2Style, h3 as h3Style } from '../../components/typography/Prose';
import { Autocomplete, TextButton, Button, Skeleton, ResourceLink } from '../../components'
import { MdPushPin } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { ContentWrapper, HeaderWrapper } from './header';
import { Error404Image, ErrorImage } from '../../components/Icons/Icons';
// import { BrokenJar } from '../../components/Icons/Icons';

export function Card({ noPadding, ...props }) {
  const padded = !noPadding;
  return <div
    css={css`
      background: var(--paperBackground);
      ${padded ? paddedCardContent : null}
      border: 1px solid var(--paperBorderColor);
      border-radius: var(--borderRadiusPx);
    `}
    {...props}>
  </div>
}

export const CardHeader2 = React.forwardRef((props, ref) => {
  return <h2 ref={ref} css={h2Style} {...props} />
});

export const CardHeader3 = React.forwardRef((props, ref) => {
  return <h3 ref={ref} css={h3Style} {...props} />
});

export function SideBarCard({ children, ...props }) {
  return <div style={{ paddingTop: 12 }} {...props}>
    <Card noPadding>
      {children}
    </Card>
  </div>
}

export function SideBarCardContentWrap({ ...props }) {
  return <div css={css`
      padding: 12px;
      display: flex;
    `} {...props} />
}

export const paddedCardContent = css`
  padding: 24px 48px;
  // less padding on small devices
  @media (max-width: 800px) {
    padding: 24px 24px;
  }
`;

export function GrSciCollMetadata({ entity, setPinState, isPinned, ...props }) {
  if (!entity) return null;
  return <div css={css`
  color: #aaa; 
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 24px;
  > div {
    flex: 0 0 auto;
    margin: 4px 24px;
  }
`} {...props}>
    <TextButton>
      <MdPushPin style={isPinned ? { color: 'var(--color900)' } : null} onClick={setPinState} />
    </TextButton>
    <div><FormattedMessage id="grscicoll.entryCreated" deafultMessage="Entry created" />: <FormattedDate value={entity.created}
      year="numeric"
      month="long"
      day="2-digit" /></div>
    <div><FormattedMessage id="grscicoll.lastModified" deafultMessage="Last modified" />: <FormattedDate value={entity.modified}
      year="numeric"
      month="long"
      day="2-digit" /></div>
    <div><FormattedMessage id="grscicoll.modifiedBy" deafultMessage="Modified by" />: {entity.modifiedBy}</div>
    {entity.masterSourceMetadata && <div>
      <span><FormattedMessage id="grscicoll.masterSource" deafultMessage="Master source" />: </span>
      {entity.masterSourceMetadata.source === 'ORGANIZATION' && <ResourceLink discreet type="publisherKey" id={entity.masterSourceMetadata.sourceId}>GBIF publisher</ResourceLink>}
      {entity.masterSourceMetadata.source === 'DATASET' && <ResourceLink discreet type="datasetKey" id={entity.masterSourceMetadata.sourceId}>GBIF publisher</ResourceLink>}
      {entity.masterSourceMetadata.source === 'IH_IRN' && <a css={css`color: inherit;`} href={`http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${entity.masterSourceMetadata.sourceId}`}>Index Herbariorum</a>}
    </div>}
  </div>
}

export function Page404(props) {
  return <div style={{ padding: '96px 48px', margin: Autocomplete, textAlign: 'center', minHeight: '80vh' }}>
    <Error404Image style={{ maxWidth: '100%', width: 280 }} />
    <CardHeader2><FormattedMessage id="phrases.pageNotFound" /></CardHeader2>
    <p style={{ color: 'var(--color300)', marginBottom: 12 }}><FormattedMessage id="phrases.pageNotFoundDescription" /></p>
    <Button as="a" href="/"><FormattedMessage id="phrases.backHome" /></Button>
  </div>
}

export function PageLoader(props) {
  return <div style={{ maxWidth: '100%' }}>
    <HeaderWrapper style={{ paddingTop: 40, paddingBottom: 40 }}>
      <Skeleton as="p" width={200} />
      <Skeleton as="h1" style={{ width: 600, height: 50, marginBottom: 50 }} />
      <Skeleton as="p" width={300} />
      <Skeleton as="p" width={200} />
    </HeaderWrapper>
    <ContentWrapper style={{ minHeight: '70vh' }}>
      <Card style={{ minHeight: 500 }}>
        <Skeleton as="h2" style={{ width: 600, marginBottom: 30 }} />
        <Skeleton as="p" width={300} />
        <Skeleton as="p" width={200} />
        <Skeleton as="p" />
        <Skeleton as="p" />
        <Skeleton as="p" />
      </Card>
    </ContentWrapper>
  </div>
}

export function SideBarHeader(props) {
  return <h4 css={css`margin: 0 0 24px 0; font-size: 14px; font-weight: bold;`} {...props} />
}

export function SideBarProgressList(props) {
  return <ul css={css`padding: 0; margin: 0; list-style: none;`} {...props} />
}

export function SideBarLoader({ lines = 5, ...props }) {
  return <div {...props}>
    <SideBarHeader><Skeleton /></SideBarHeader>
    <div>
      {Array(lines).fill().map((x, i) => <Skeleton key={i} width="random" css={css`margin-bottom: .7em;`} />)}
    </div>
  </div>
};

export function SideBarError({ ...props }) {
  return <div {...props}>Failed to load</div>
};
