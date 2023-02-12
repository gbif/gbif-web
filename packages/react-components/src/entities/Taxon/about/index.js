import { css } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BiDna } from 'react-icons/bi';
import {
  Properties,
  Property,
  ListItem,
  Prose,
  ResourceLink,
} from '../../../components';
import { Card, CardHeader2, SideBarHeader } from '../../shared';
import { ExternalLink } from '../components/ExternalLink';

const { Term: T, Value: V, EmptyValue } = Properties;
const Name2Avatar = ListItem.Name2Avatar;

export default function About({ taxon }) {
  return (
    <div>
      <div
        css={css`
          padding-bottom: 100px;
          display: flex;
          margin: 0 -12px;
        `}
      >
        <div
          css={css`
            flex: 1 1 auto;
            margin: 0 12px;
          `}
        >
          <Card style={{ marginTop: 12, marginBottom: 24 }}>
            <CardHeader2>
              <FormattedMessage
                id='occurrenceFieldNames.taxonomicClassification'
                deafultMessage='Classification'
              />
            </CardHeader2>
            <Prose
              style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}
            >
              {taxon?.remarks || <EmptyValue />}
            </Prose>
            <Properties
              style={{ fontSize: 16, marginBottom: 12 }}
              breakpoint={800}
            >
              <Property
                value={taxon?.kingdom}
                labelId='occurrenceFieldNames.kingdom'
                showEmpty
              />
              <Property
                value={taxon?.phylum}
                labelId='occurrenceFieldNames.phylum'
                showEmpty
              />
              <Property
                value={taxon?.class}
                labelId='occurrenceFieldNames.class'
                showEmpty
              />
              <Property
                value={taxon?.order}
                labelId='occurrenceFieldNames.order'
                showEmpty
              />
              <Property
                value={taxon?.family}
                labelId='occurrenceFieldNames.family'
                showEmpty
              />
              <Property
                value={taxon?.genus}
                labelId='occurrenceFieldNames.genus'
                showEmpty
              />
              <Property
                value={taxon?.species}
                labelId='occurrenceFieldNames.species'
                showEmpty
              />
            </Properties>
          </Card>
        </div>
        <aside
          css={css`
            flex: 0 0 280px;
            margin: 12px;
          `}
        >
          <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
            <SideBarHeader>Sequences</SideBarHeader>
            <ExternalLink
              type='sequenceKey'
              id={taxon?.species}
              label='GenBank'
              icon={BiDna}
            />
          </Card>
        </aside>
      </div>
    </div>
  );
}
