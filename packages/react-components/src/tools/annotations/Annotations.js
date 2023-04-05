import { jsx, css } from '@emotion/react';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { MdSearch } from 'react-icons/md';
import { useQuery } from '../../dataManagement/api';
import { filter2predicate } from '../../dataManagement/filterAdapter';
import { Button, Input, HyperText, ErrorBoundary, NavBar, NavItem, ButtonGroup } from '../../components';
import { FormattedNumber } from 'react-intl';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { join } from '../../utils/util';
import { StringParam, useQueryParam } from 'use-query-params';
import { AnnotationList } from './AnnotationList';
import { AnnotationForm } from './CreateAnnotation';
import env from '../../../.env.json';
import CustomSelect from './CustomSelect';
import { Context } from './Context';
import { SearchWrapper } from '../../search/Search';
import predicateConfig from './config/predicateConfig';
import defaultFilterConfig from './config/filterConf';
import { MapWrapper } from './MapWrapper';

/*
This component is a widget that allows the user to search for annotations. 
add annotation rules, create projects to contain annotations, and view annotations. 
as well as comment on individual annotations.
 */
function Annotations(props) {
  const [activeView = 'annotations', setActiveView] = useQueryParam('view', StringParam);

  const [activeAnnotation, setActiveAnnotation] = useState();
  const handlePolygonSelect = useCallback((annotation, annotationList) => {
    setActiveAnnotation(annotation);
    console.log(annotation);
  }, []);

  return <ErrorBoundary>
    <div css={css`width: 100%; height: 90vh; position: relative;`}>
      <div css={css`width: 100%; height: 100%; background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);`}>
        <MapWrapper onPolygonSelect={handlePolygonSelect} />
      </div>

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
            <SearchWrapper {...{predicateConfig, defaultFilterConfig}}>
              <Rules activeAnnotation={activeAnnotation}/>
            </SearchWrapper>
          </div>
        </div>
      </div>
    </div>
  </ErrorBoundary>
}

export default Annotations;

function Rules({activeAnnotation, ...props}) {
  const [contextType = 'TAXON', setType] = useQueryParam('type', StringParam);
  const [contextKey, setKey] = useQueryParam('key', StringParam);
  const [showNewRule, setShowNewRule] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  
  return <div style={{paddingBottom: 48}}>
    {/* {activeAnnotation && <pre>{JSON.stringify(activeAnnotation, null, 2)}</pre>} */}
    {/* <CustomSelect options={[{value: 'TAXON', label: "Taxon"}, {value: 'DATASET', label: "Dataset"}]} value="Pumas" inputPlaceholder="Select context" /> */}
    {showNewRule && <AnnotationForm token={env._tmp_token} onCreate={(annotation) => {
      setShowNewRule(false); 
      setShowCreateSuccess(true);
      setType(annotation.contextType);
      setKey(annotation.contextKey);
      }} 
      onClose={() => setShowNewRule(false)}
      />}
    {!showNewRule && <>
      {showCreateSuccess && <SuccessCard onCreate={() => setShowNewRule(true)} onClose={() => setShowCreateSuccess(false)}/>}
      {!showCreateSuccess && <Context onChange={(context) => {
        setType(context.type);
        setKey(context.key);
      }} />}
      <AnnotationList activeAnnotation={activeAnnotation} token={env._tmp_token} contextType={contextType} contextKey={contextKey} />
    </>}

    {!showNewRule && <>
       <div css={css`position: absolute; bottom: 12px; right: -24px;`}>
        <Button onClick={() => setShowNewRule(true)} css={css`box-shadow: 0 3px 3px 3px rgba(0,0,0,.15); border-radius: 4px 16px 16px 4px;`}>
          Create new
        </Button>
      </div>
    </>}
    {/* <div>
    <div css={css`margin: 8px; overflow: hidden; border-radius: 4px;`}>
      <img css={css`width: 100%; display: block;`} src="https://cdn.discordapp.com/attachments/1017143593351258192/1091055752023642172/Morten100_tech_illustration_woman_classifying_geomtric_lines_er_28b388c3-d5f1-4e2f-b359-77a370f94477.png" />
    </div>
  </div> */}
  </div>
}

function SuccessCard({ onCreate, onClose, ...props }) {
  return <div css={css`background: white; margin: 12px; border-radius: 4px; text-align: center; padding: 12px;`}>
    <img css={css`width: 100%; display: block; max-width: 250px; margin: 0 auto; margin-bottom: -24px;`}
      src="https://cdn.discordapp.com/attachments/1017143593351258192/1091342958684545044/Morten100_tech_illustration_biodiversity_confetti_by_slack_and__faf2c4d0-a991-43f3-b6cb-7c8e593219c7.png" alt="Confetti" />
      <div>
        <p>Your annotation rule was created.</p>
      </div>
    <Button onClick={onCreate} style={{marginInlineEnd: 8}}>Create another</Button>
    <Button look="primaryOutline" onClick={onClose}>Close</Button>
  </div>
}

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