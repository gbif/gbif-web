import { jsx, css } from '@emotion/react';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Button, ErrorBoundary } from '../../../components';
import { FormattedNumber } from 'react-intl';
import { AnnotationList } from './AnnotationList';
import { AnnotationForm } from './CreateAnnotation';
import env from '../../../../.env.json';
import { MapWrapper } from './MapWrapper';
import { FilterContext } from '../../../widgets/Filter/state';

/*
This component is a widget that allows the user to search for annotations. 
add annotation rules, create projects to contain annotations, and view annotations. 
as well as comment on individual annotations.
 */
function RulesWrapper(props) {
  const [activeAnnotations, setActiveAnnotations] = useState([]);
  const currentFilterContext = useContext(FilterContext);

  const handlePolygonSelect = useCallback((annotation, annotationList) => {
    setActiveAnnotations(annotationList);
  }, []);

  useEffect(() => {
    setActiveAnnotations([]);
  }, [currentFilterContext.filterHash]);

  return <ErrorBoundary>
    <div css={css`
        width: 100%; 
        height: 90vh;
        display: flex;
        `}>
      <div css={css`z-index: 2; position: relative; flex: 0 0 auto; height: calc(100% - 48px); width: 350px; top: 0; left: 0; margin-right: 12px;`}>
        <Rules activeAnnotations={activeAnnotations} clearActive={() => setActiveAnnotations([])} />
      </div>
      <div css={css`flex: 1 1 100%; width: 100%; height: 100%; background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);`}>
        <MapWrapper onPolygonSelect={handlePolygonSelect} />
      </div>
    </div>
  </ErrorBoundary>
}

export default RulesWrapper;

function Rules({ activeAnnotations, clearActive, ...props }) {
  const [showNewRule, setShowNewRule] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);

  return <div css={css`background: white; border: 1px solid #eee; box-shadow: 0 2px 2px 2px rgba(0,0,0,.1); border-radius: 8px; height: 100%; display: flex; flex-direction: column; overflow: hidden;`}>
    <div css={css`padding: 8px 12px;`}>
      Rules
    </div>
    <div css={css`flex: 1 1 100%; background: #f3f3f3; overflow: auto; max-height: 100%;`}>
      <List activeAnnotations={activeAnnotations} clearActive={clearActive} />
    </div>
  </div>
}

function List({ activeAnnotations, clearActive, ...props }) {
  const [showNewRule, setShowNewRule] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);

  return <div style={{ paddingBottom: 48 }}>
    {/* {activeAnnotation && <pre>{JSON.stringify(activeAnnotation, null, 2)}</pre>} */}
    {/* <CustomSelect options={[{value: 'TAXON', label: "Taxon"}, {value: 'DATASET', label: "Dataset"}]} value="Pumas" inputPlaceholder="Select context" /> */}
    
    {showNewRule && <AnnotationForm token={env._tmp_token} onCreate={(annotation) => {
      setShowNewRule(false);
      setShowCreateSuccess(true);
    }}
      onClose={() => setShowNewRule(false)}
    />}
    {!showNewRule && activeAnnotations.length === 0 && <>
      {showCreateSuccess && <SuccessCard onCreate={() => setShowNewRule(true)} onClose={() => setShowCreateSuccess(false)} />}
      <AnnotationList token={env._tmp_token} />
    </>}
    
    {!showNewRule && activeAnnotations.length > 0 && <>
      <Button style={{ margin: '12px 0 0 12px' }} look="primaryOutline" onClick={clearActive}>Back</Button>
      <AnnotationList activeAnnotations={activeAnnotations} token={env._tmp_token} />
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
    <Button onClick={onCreate} style={{ marginInlineEnd: 8 }}>Create another</Button>
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