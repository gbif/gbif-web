import { jsx, css } from '@emotion/react';
import React, { useState, useEffect, useContext } from 'react';
import { Button, ErrorBoundary, Input } from '../../../components';
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
  const [q, setQ] = useState('');
  const { setField } = useContext(FilterContext);
  const [activeView, setActiveView] = useQueryParam('view', StringParam);

  useEffect(() => {
    let cancelPending = null;
    const fetchProjects = async () => {
      const { promise, cancel } = axios.get(`${env.ANNOTATION_API}/occurrence/experimental/annotation/project`);
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

  // filter projects by search query, look in name, description and members
  const filteredProjects = projects.filter(x => {
    if (typeof q !== 'string' || q === '') return true;
    const name = x.name.toLowerCase();
    const description = x.description.toLowerCase();
    const members = x.members.map(x => x.toLowerCase()).join(' ');
    const query = q.toLowerCase();
    return name.includes(query) || description.includes(query) || members.includes(query);
  });

  return <ErrorBoundary>
    <div css={css`text-align: center; margin: 12px 0 24px 0;`}>
      <Input style={{ maxWidth: 500, padding: 24 }} changeHandler={q} placeholder="Search projects" onChange={(e) => setQ(e.currentTarget.value)} />
    </div>
    <div css={css`
        width: 100%; 
        height: auto;
        display: flex;
        `}>
      <div css={css`width: 100%;`}>
        <ul css={css`
          margin: 0; padding: 0; list-style: none; overflow: hidden; padding: 8px;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          >li {
            margin-bottom: 12px;
          }`}>
          {filteredProjects.map(x => <li key={x.id}><Project project={x} addProjectFilter={(id) => {
            setField('projectId', [id]);
            setActiveView('RULES');
          }} /></li>)}
        </ul>
      </div>
    </div>
  </ErrorBoundary>
}

export default ProjectWrapper;

var hash = function (str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function Project({ project, addProjectFilter, ...props }) {
  // hard coded list of nice retro color pairs used for backgrounds and text
  const colors = [
    { background: "#001219", text: "#ffffffaa" },
    { background: "#005f73", text: "#ffffffaa" },
    { background: "#0a9396", text: "#ffffffaa" },
    { background: "#94d2bd", text: "#ffffffaa" },
    { background: "#e9d8a6", text: "#ffffffaa" },
    { background: "#ee9b00", text: "#ffffffaa" },
    { background: "#ca6702", text: "#ffffffaa" },
    { background: "#bb3e03", text: "#ffffffaa" },
    { background: "#ae2012", text: "#ffffffaa" },
    { background: "#9b2226", text: "#ffffffaa" }

  ];
  const palette = colors[Math.abs(hash(project.name) * project.id) % colors.length];

  return <article css={css`
    background: white; 
    border-radius: 4px; 
    width: 300px; 
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
    position: relative;
    `}>
    <a href="#" onClick={() => addProjectFilter(project.id)} css={css`position: absolute; top: 0; right: 0; bottom: 0; left: 0;`}></a>
    <div css={css`
      font-size: 250px;
      font-weight: 900;
      overflow: hidden;
      height: 150px;
      width: 100%;
      background: ${palette.background};
      color: ${palette.text};
      `}>
      <div style={{ marginTop: -50 }}>{project.name}</div>
    </div>
    <div css={css`padding: 16px;`}>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <div>
        {/* If more than 5 members, then show count, else show individual names */}
        {project.members.length > 5 && <span>Members: <FormattedNumber value={project.members.length} /></span>}
        {project.members.length <= 5 && <span>Members: {project.members.join(', ')}</span>}
        {/* Rules: <FormattedNumber value={2} /> */}
      </div>
    </div>
  </article>
}