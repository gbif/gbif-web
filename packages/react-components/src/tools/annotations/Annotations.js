import { jsx, css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { MdSearch } from 'react-icons/md';
import { useQuery } from '../../dataManagement/api';
import { filter2predicate } from '../../dataManagement/filterAdapter';
import { Button, Input, HyperText, ErrorBoundary, NavBar, NavItem } from '../../components';
import { FormattedNumber } from 'react-intl';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { join } from '../../utils/util';
import { StringParam, useQueryParam } from 'use-query-params';
import { AnnotationList } from './AnnotationList';
import { AnnotationForm } from './CreateAnnotation';
import env from '../../../.env.json';
/*
This component is a widget that allows the user to search for annotations. 
add annotation rules, create projects to contain annotations, and view annotations. 
as well as comment on individual annotations.
 */
function Annotations(props) {
  const [activeView = 'annotations', setActiveView] = useQueryParam('view', StringParam);

  return <ErrorBoundary>
    <div css={css`width: 100%; height: 90vh; position: relative;`}>
      <div css={css`width: 100%; height: 100%; background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);`}>Map placeholder</div>

      <div css={css`position: absolute; height: calc(100% - 48px); width: 350px; top: 0; left: 0; margin: 24px;`}>
        <div css={css`background: white; border-radius: 8px; height: 100%; display: flex; flex-direction: column; overflow: hidden;`}>
          <nav css={css`flex: 0 0 auto;`}>
            <NavBar style={{ borderBottom: '1px solid #ddd' }}>
              <NavItem label="Annotations" data-targetid="annotations" onClick={e => setActiveView('annotations')} isActive={activeView === 'annotations'} />
              <NavItem label="Projects" data-targetid="projects" onClick={e => setActiveView('projects')} isActive={activeView === 'projects'} />
            </NavBar>
          </nav>
          <div css={css`flex: 1 1 100%; background: #f3f3f3; overflow: auto; max-height: 100%;`}>
            {/* <Projects /> */}
            <div>
              <AnnotationList token={env._tmp_token}/>
              {/* <AnnotationForm token={env._tmp_token}/> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ErrorBoundary>
}

export default Annotations;


function Projects({ ...props }) {
  return <div css={css``}>
    <ul css={css`margin: 0; padding: 0; list-style: none; overflow: hidden; padding: 8px; 
    >li {
      margin-bottom: 12px;
    }`}>
      <li><Project /></li>
      <li><Project /></li>
    </ul>
  </div>
}

function Project({ ...props }) {
  return <article css={css`background: white; border-radius: 4px;`}>
    <div css={css`padding: 8px;`}>
      <h1>Legume</h1>
      <p>Suggested annotations for data dealing with faberceae</p>
      <div>
        Members: <FormattedNumber value={3} />
        Rules: <FormattedNumber value={2} />
      </div>
    </div>
  </article>
}