import { jsx, css } from '@emotion/react';
import React, { useState, useEffect, useContext } from 'react';
import { Button, ErrorBoundary } from '../../../components';
import { FormattedNumber } from 'react-intl';
import { FilterContext } from '../../../widgets/Filter/state';
import axios from '../../../dataManagement/api/axios';
import UserContext from '../../../dataManagement/UserProvider/UserContext';
import env from '../../../../.env.json';
import { StringParam, useQueryParam } from 'use-query-params';

/*
This component is a widget that allows the user to search for annotation projects. 
When clicking a project, the user can view the annotations associated with that project.
 */
function ProjectWrapper(props) {
  const [projects, setProjects] = useState([]);
  const { setField } = useContext(FilterContext);
  const [activeView, setActiveView] = useQueryParam('view', StringParam);

  useEffect(() => {
    let cancelPending = null;
    const fetchProjects = async () => {
      const { promise, cancel } = axios.get(`${env.ANNOTATION_API}/occurrence/annotation/project`);
      cancelPending = cancel;
      // setCancel(cancel);
      promise.then((response) => {
        setProjects(response.data);
      });
    };

    fetchProjects();
    return () => {
      if (cancelPending) {
        cancelPending();
      }
    }
  }, []);

  return <ErrorBoundary>
    <div css={css`
        width: 100%; 
        height: 90vh;
        display: flex;
        `}>
      <div css={css``}>
        <ul css={css`
          margin: 0; padding: 0; list-style: none; overflow: hidden; padding: 8px; 
          >li {
            margin-bottom: 12px;
          }`}>
          {projects.map(x => <li key={x.id}><Project project={x} addProjectFilter={(id) => {
            setField('projectId', [id]);
            setActiveView('RULES');
          }} /></li>)}
        </ul>
      </div>
    </div>
  </ErrorBoundary>
}

export default ProjectWrapper;


function Project({ project, addProjectFilter, ...props }) {
  return <article css={css`background: white; border-radius: 4px;`} onClick={() => addProjectFilter(project.id)}>
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