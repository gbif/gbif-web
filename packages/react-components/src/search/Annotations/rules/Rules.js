import { jsx, css } from '@emotion/react';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Button, ErrorBoundary } from '../../../components';
import { FormattedNumber } from 'react-intl';
import { AnnotationList } from './AnnotationList';
import { AnnotationForm } from './CreateAnnotation';
import { MapWrapper } from './MapWrapper';
import { FilterContext } from '../../../widgets/Filter/state';
import { filter2v1 } from '../../../dataManagement/filterAdapter';
import axios from '../../../dataManagement/api/axios';
import SearchContext from '../../SearchContext';
import UserContext from '../../../dataManagement/UserProvider/UserContext';
import env from '../../../../.env.json';
import { NumberParam, useQueryParam } from 'use-query-params';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

/*
This component is a widget that allows the user to search for annotations. 
add annotation rules, create projects to contain annotations, and view annotations. 
as well as comment on individual annotations.
 */
function RulesWrapper(props) {
  const [activeAnnotations, setActiveAnnotations] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [polygons, updatePolygons] = useState([]);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const [limit = 20, setLimit] = useQueryParam('limit', NumberParam);
  const [offset = 0, setOffset] = useQueryParam('offset', NumberParam);

  const setPolygons = useCallback((list) => {
    updatePolygons(list);
  }, []);

  useEffect(() => {
    let cancelPending = null;
    const fetchAnnotations = async () => {
      const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
      const filter = { ...v1Filter, ...rootPredicate, limit, offset };
      const { promise, cancel } = axios.get(`${env.ANNOTATION_API}/occurrence/experimental/annotation/rule`, { params: filter });
      cancelPending = cancel;
      // setCancel(cancel);
      promise.then((response) => {
        setAnnotations(response.data);  
      });
    };

    fetchAnnotations();
    return () => {
      if (cancelPending) {
        cancelPending();
      }
    }
  }, [currentFilterContext.filterHash, limit, offset]);

  useEffect(() => {
    setOffset();
  }, [currentFilterContext.filterHash]);

  // on unmount, clear the filter
  useEffect(() => {
    return () => {
      currentFilterContext.setFilter({});
      setOffset();
      setLimit();
    }
  }, []);

  const handlePolygonSelect = useCallback((annotation, annotationList) => {
    setActiveAnnotations(annotationList);
  }, []);

  const next = useCallback(() => {
    setOffset(offset + limit);
  }, [offset, limit]);

  const previous = useCallback(() => {
    setOffset(Math.max(0, offset - limit));
  }, [offset, limit]);

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
        <Rules {...{polygons, setPolygons, annotations, activeAnnotations, setActiveAnnotations, limit, offset, next, previous}} setAnnotations={(list) => setAnnotations(list)} clearActive={() => setActiveAnnotations([])} />
      </div>
      <div css={css`flex: 1 1 100%; width: 100%; height: 100%;`}>
        <MapWrapper {...{polygons, setPolygons, annotations}} onPolygonSelect={handlePolygonSelect} />
      </div>
    </div>
  </ErrorBoundary>
}

export default RulesWrapper;

function Rules({ polygons, setPolygons, annotations, setAnnotations, activeAnnotations, setActiveAnnotations, clearActive, limit, offset, next, previous, ...props }) {
  const { user } = useContext(UserContext);
  const [showNewRule, setShowNewRule] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);

  // show new rule if there are polygons in the list
  useEffect(() => {
    if (polygons.length > 0) {
      setShowNewRule(true);
      setActiveAnnotations([]);
    }
  }, [polygons]);

  return <div css={css`background: white; border: 1px solid #eee; box-shadow: 0 2px 2px 2px rgba(0,0,0,.1); border-radius: 8px; height: 100%; display: flex; flex-direction: column; overflow: hidden;`}>
    <div css={css`padding: 8px 12px; display: flex; align-items: center; border-bottom: 1px solid #eee;`}>
      <div css={css`flex: 1 1 auto; padding: 6px 0; display: flex; align-items: center;`}>
        {!showNewRule && <>
          <span>Showing {annotations.length} rules</span>
          <span style={{fontSize: 12, marginLeft: 8}}>
            <Button disabled={offset <= 0} look="outline" onClick={e => previous()}><MdChevronLeft /></Button>
            <Button disabled={annotations.length < limit} look="outline" onClick={e => next()}><MdChevronRight /></Button>
          </span>
        </>}
        {showNewRule && <>
        Create new rule
        </>}
      </div>
      {user && !showNewRule && <Button onClick={() => setShowNewRule(true)} look="primary" style={{ fontSize: 14 }}>Create new</Button>}
      {showNewRule && <Button onClick={() => {setShowNewRule(false); setPolygons([]);}} look="primaryOutline" style={{ fontSize: 14 }}>Cancel</Button>}
    </div>
    <div css={css`flex: 1 1 100%; background: #f3f3f3; overflow: auto; max-height: 100%;`}>
      <div style={{ paddingBottom: 48 }}>
        {showNewRule && <AnnotationForm {...{polygons, setPolygons}} onCreate={(annotation) => {
          setShowNewRule(false);
          setShowCreateSuccess(true);
          setAnnotations([annotation, ...annotations]);
          setPolygons([]);
        }}
          onClose={() => {
            setShowNewRule(false);
            setPolygons([]);
          }}
        />}
        {!showNewRule && activeAnnotations.length === 0 && <>
          {showCreateSuccess && <SuccessCard onCreate={() => setShowNewRule(true)} onClose={() => setShowCreateSuccess(false)} />}
          <AnnotationList annotations={annotations} setAnnotations={setAnnotations} />
        </>}

        {!showNewRule && activeAnnotations.length > 0 && <>
          <Button style={{ margin: '12px 0 0 12px' }} look="primaryOutline" onClick={clearActive}>Back</Button>
          <AnnotationList annotations={annotations} activeAnnotations={activeAnnotations} setAnnotations={setAnnotations} />
        </>}
        {/* <div>
          <div css={css`margin: 8px; overflow: hidden; border-radius: 4px;`}>
            <img css={css`width: 100%; display: block;`} src="https://cdn.discordapp.com/attachments/1017143593351258192/1091055752023642172/Morten100_tech_illustration_woman_classifying_geomtric_lines_er_28b388c3-d5f1-4e2f-b359-77a370f94477.png" />
          </div>
        </div> */}
      </div>
    </div>
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