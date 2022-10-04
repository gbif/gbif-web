import { jsx, css } from '@emotion/react';
import React from 'react';
import { h2 as h2Style } from '../../components/typography/Prose';
import { Autocomplete, TextButton, Button, Skeleton } from '../../components'
import { MdPushPin } from 'react-icons/md';
import { FormattedDate } from 'react-intl';
import { ContentWrapper, HeaderWrapper } from './header';
import { BrokenJar } from '../../components/Icons/Icons';

export function Card({ padded = true, ...props }) {
  return <div
    css={css`
      background: var(--paperBackground);
      ${padded ? paddedContent : null}
      border: 1px solid var(--paperBorderColor);
      border-radius: var(--borderRadiusPx);
    `}
    {...props}>
  </div>
}

function PaddedContent(props) {
  return <div
    css={paddedContent}
    {...props}>
  </div>
}

export function CardHeader2(props) {
  return <h2 css={h2Style} {...props} />
}

const paddedContent = css`
  padding: 24px 48px;
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
    <div>Entry created: <FormattedDate value={entity.created}
      year="numeric"
      month="long"
      day="2-digit" /></div>
    <div>Last modified: <FormattedDate value={entity.modified}
      year="numeric"
      month="long"
      day="2-digit" /> by {entity.modifiedBy}</div>
    {entity.masterSourceMetadata && <div>
      <span>Master source: </span>
      {entity.masterSourceMetadata.source === 'ORGANIZATION' && <ResourceLink discreet type="publisherKey" id={entity.masterSourceMetadata.sourceId}>GBIF publisher</ResourceLink>}
      {entity.masterSourceMetadata.source === 'DATASET' && <ResourceLink discreet type="datasetKey" id={entity.masterSourceMetadata.sourceId}>GBIF publisher</ResourceLink>}
      {entity.masterSourceMetadata.source === 'IH_IRN' && <a css={css`color: inherit;`} href={`http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${entity.masterSourceMetadata.sourceId}`}>Index Herbariorum</a>}
    </div>}
  </div>
}

export function PageError(props) {
  return <div style={{ padding: '96px 48px', margin: Autocomplete, textAlign: 'center', minHeight: '80vh' }}>
    <img src="http://localhost:4000/images/error500.svg" style={{ maxWidth: '100%', width: 280 }} />
    <h2>500</h2>
    <p style={{ color: 'var(--color300)' }}>Sorry, something went wrong.</p>
    <Button>Back home</Button> <Button look="primaryOutline" onClick={() => location.reload()}>Refresh</Button>
  </div>
}

export function Page404(props) {
  return <div style={{ padding: '96px 48px', margin: Autocomplete, textAlign: 'center', minHeight: '80vh' }}>
    <img src="http://localhost:4000/images/error404.svg" style={{ maxWidth: '100%', width: 280 }} />
    <h2>404</h2>
    <p style={{ color: 'var(--color300)' }}>Sorry, the page you visited does not exist.</p>
    <Button>Back home</Button>
  </div>
}

export function PageLoader(props) {
  return <div>
    <HeaderWrapper style={{paddingTop: 40, paddingBottom: 40}}>
      <Skeleton as="p" width={200} />
      <Skeleton as="h1" style={{width: 600, height:50, marginBottom: 50}} />
      <Skeleton as="p" width={300} />
      <Skeleton as="p" width={200} />
    </HeaderWrapper>
    <ContentWrapper style={{minHeight: '70vh'}}>
      <Card style={{minHeight: 500}}>
        <Skeleton as="h2" style={{width: 600, marginBottom: 30}} />
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
  return <h4 css={css`margin: 0 0 24px 0; font-size: 14px; font-weight: bold;`} {...props}/>
}

export function SideBarProgressList(props) {
  return <ul css={css`padding: 0; margin: 0; list-style: none;`} {...props} />
}

export function SideBarLoader({lines = 5, ...props}) {
  return <>
    <h4><Skeleton /></h4>
    <div>
      {Array(lines).fill().map((x, i ) => <Skeleton key={i} width="random" css={css`margin-bottom: .7em;`}/>)}
    </div>
  </>
};

export function SideBarError({...props}) {
  return <div {...props}>Failed to load</div>
};
