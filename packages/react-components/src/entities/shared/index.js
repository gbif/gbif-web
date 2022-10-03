import { jsx, css } from '@emotion/react';
import { h2 as h2Style } from '../../components/typography/Prose';
import { TextButton } from '../../components'
import { MdPushPin } from 'react-icons/md';
import { FormattedDate } from 'react-intl';

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