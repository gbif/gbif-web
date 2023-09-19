
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { Prose, HyperText, Toc, ContactList, Unknown } from "../../../components";
import { FormattedMessage } from 'react-intl';
import { Card, CardHeader2, SideBarCard } from '../../shared';
import * as sharedStyles from '../../shared/styles';
import useBelow from '../../../utils/useBelow';

export function Project({
  data = {},
  loading,
  error,
  tocState,
  className,
  ...props
}) {
  const isBelowSidebar = useBelow(1000);
  const [tocRefs] = useState({})
  const { dataset } = data;
  const { project } = dataset;
  if (!project) return <div>This dataset does not state any relation to a project</div>

  return <>
    <div css={sharedStyles.withSideBar({ hasSidebar: !isBelowSidebar })}>
      <div>
        {(project.abstract || project.title) && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["abstract"] = node; }}>{project.title ?? <Unknown id="phrases.notProvided" />}</CardHeader2>
          <Prose css={sharedStyles.cardProse}>
            <HyperText text={project.abstract} fallback />
          </Prose>
        </Card>}
        {project.studyAreaDescription && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["studyAreaDescription"] = node; }}>
            <FormattedMessage id="dataset.studyArea" />
          </CardHeader2>
          <Prose css={sharedStyles.cardProse}>
            <HyperText text={project.studyAreaDescription} />
          </Prose>
        </Card>}
        {project.designDescription && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["designDescription"] = node; }}>
            <FormattedMessage id="dataset.description" />
          </CardHeader2>
          <Prose css={sharedStyles.cardProse}>
            <HyperText text={project.designDescription} />
          </Prose>
        </Card>}
        {project.funding && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["funding"] = node; }}>
            <FormattedMessage id="dataset.funding" />
          </CardHeader2>
          <Prose css={sharedStyles.cardProse}>
            <HyperText text={project.funding} />
          </Prose>
        </Card>}
        {project?.contacts && <Card css={sharedStyles.cardMargins}>
          <CardHeader2 ref={node => { tocRefs["contacts"] = node; }}>
            <FormattedMessage id="dataset.contacts" />
          </CardHeader2>
          <ContactList contacts={project.contacts} style={{ paddingInlineStart: 0 }} />
        </Card>}
      </div>
      <div css={sharedStyles.sideBar}>
        <nav css={sharedStyles.sideBarNav}>
          <SideBarCard>
            <Toc refs={tocRefs} />
          </SideBarCard>
        </nav>
      </div>
    </div>
  </>
};
