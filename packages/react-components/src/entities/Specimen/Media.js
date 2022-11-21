import { jsx, css } from '@emotion/react';
import React from 'react';
import { Classification, Properties } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';

export function Media({
  id,
  ...props
}) {
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Media</CardHeader2>
      <div css={css``}>
        
      </div>
      <div css={css`margin-top: 12px;`}>
        <Properties>
          <Term>Scientific name</Term>
          <div>
            <Value>
              <div>Netta ruf. P.</div>
            </Value>
            <Value>
              Netta rufina (Pallas, 1773) <span css={css`color: #aaa;`}><ReferenceIcon style={{ verticalAlign: 'middle', margin: '0 4' }} /> GBIF</span>
            </Value>
          </div>

          <Term>Identified by</Term>
          <Value>John R. Demboski</Value>

          <Term>Nature of ID</Term>
          <Value>Molecular</Value>

          <Term>Classification</Term>
          <div>
            <Value>
              <Classification>
                <span>Animalia</span>
                <span>Chordata</span>
                <span>Mam.</span>
                <span>Sciuro.</span>
                <span>Tamias</span>
              </Classification>
            </Value>
            <Value>
              <Classification css={css`display: inline-block;`}>
                <span>Animalia</span>
                <span>Chordata</span>
                <span>Mammalia</span>
                <span>Sciurognathia</span>
                <span>Tamias</span>
                <span>Tamias Slabrias</span>
              </Classification>
              <span css={css`color: #aaa;`}><ReferenceIcon style={{ verticalAlign: 'middle', margin: '0 4' }} /> GBIF</span>
            </Value>
          </div>
        </Properties>
      </div>
    </div>
    <div css={css`padding: 12px 24px; background: var(--paperBackground800); border-top: 1px solid var(--paperBorderColor);`}>
      <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Previous identifications</h3>
      <ul css={css`margin: 0; padding: 0; list-style: none;`}>

        <li css={css`display: flex; margin-bottom: 12px;`}>
          <div css={css`flex: 0 0 auto; margin-inline-end: 24px; color: var(--color400); margin-top: 18px;`}>
            1 March 2021
          </div>
          <div css={css`flex: 1 1 auto;`}>
            <Card padded={false} css={css`padding: 12px;`}>
              <Properties dense>
                <Term>Scientific name</Term>
                <Value>Netta rufina (Pallas, 1773)</Value>

                <Term>Identified by</Term>
                <Value>John R. Demboski</Value>

                <Term>Nature of ID</Term>
                <Value>Molecular</Value>

                <Term>Classification</Term>
                <Value>
                  <Classification>
                    <span>Animalia</span>
                    <span>Chordata</span>
                    <span>Mam.</span>
                    <span>Sciuro.</span>
                    <span>Tamias</span>
                  </Classification>
                </Value>
              </Properties>
            </Card>
          </div>
        </li>

        <li css={css`display: flex;`}>
          <div css={css`flex: 0 0 auto; margin-inline-end: 24px; color: var(--color400); margin-top: 1em;`}>
            24 June 2019
          </div>
          <div css={css`flex: 1 1 auto;`}>
            <Card padded={false}>
              <div css={css`padding: 8px 12px; border-bottom: 1px solid var(--paperBorderColor); display: flex; align-items: center;`}>
                <Properties dense css={css`flex: 1 1 auto;`}>
                  <Term>Source</Term>
                  <Value>Plazi</Value>
                </Properties>
                <div css={css`flex: 0 0 auto;`}>
                  <div css={css`padding: 3px; background: #ffd41e; box-shadow: 0 1px 2px rgba(0,0,0,.05); border-radius: var(--borderRadiusPx);`}>
                    <TbCircleDot css={css`font-size: 18px; vertical-align: middle;`} />
                  </div>
                </div>
              </div>
              <div css={css`padding: 12px;`}>
                <Properties dense>
                  <Term>Scientific name</Term>
                  <Value>Netta</Value>

                  <Term>Identified by</Term>
                  <Value>John R. Demboski</Value>

                  <Term>Nature of ID</Term>
                  <Value>Molecular</Value>

                  <Term>Classification</Term>
                  <Value>
                    <Classification>
                      <span>Animalia</span>
                      <span>Chordata</span>
                      <span>Mam.</span>
                      <span>Sciuro.</span>
                      <span>Tamias</span>
                    </Classification>
                  </Value>
                </Properties>
              </div>
            </Card>
          </div>
        </li>


      </ul>
    </div>

  </Card>
};

