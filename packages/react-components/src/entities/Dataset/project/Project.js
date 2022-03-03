
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Prose, HyperText, Toc, ContactList } from "../../../components";

export function Project({
  data = {},
  loading,
  error,
  tocState,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [tocRefs, setTocRefs] = useState({})
  const { dataset } = data;
  const { project } = dataset;
  if (!project) return <div>This dataset does not state any relation to a project</div>
  
  return <>
    <div css={css.withSideBar({ theme })}>
      <div css={css.sideBar({ theme })}>
        <nav css={css.sideBarNav({ theme })}>
          <Toc refs={tocRefs}/>
        </nav>
      </div>
      <div style={{ width: '100%', marginLeft: 12 }}>
        {(project.abstract || project.title) && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["abstract"] = node; }}>{ project.title }</h2>
          <HyperText text={project.abstract} />
        </Prose>}
        {project.studyAreaDescription && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["studyAreaDescription"] = node; }}>studyAreaDescription</h2>
          <HyperText text={project.studyAreaDescription} />
        </Prose>}
        {project.designDescription && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["designDescription"] = node; }}>designDescription</h2>
          <HyperText text={project.designDescription} />
        </Prose>}
        {project.funding && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["funding"] = node; }}>funding</h2>
          <HyperText text={project.funding} />
        </Prose>}
        {project?.contacts && <Prose css={css.paper({ theme })}>
          <h2 ref={node => { tocRefs["contacts"] = node; }}>Contacts</h2>
          <ContactList contacts={project.contacts} style={{paddingInlineStart: 0}}/>
        </Prose>}
      </div>
    </div>
  </>
};
