import { jsx, css } from '@emotion/react';
import React, { useContext } from "react";
import RouteContext from '../../dataManagement/RouteContext';
import { Link } from "react-router-dom";

export function ResourceLink({id, type, discreet, ...props}) {
  const routeContext = useContext(RouteContext);
  const {url, isHref} = routeContext[type];
  const to = url({key: id});
  const style = discreet ? isDiscreet : null;
  if (isHref) {
    return <a href={to} css={style} {...props}/>
  } else {
    return <Link to={to} css={style} {...props} />
  }
}

export function PublisherKeyLink(props) {
  return <ResourceLink type='publisherKey' {...props}/>
}

export function DatasetKeyLink(props) {
  return <ResourceLink type='datasetKey' {...props}/>
}

const isDiscreet = css`
  color: inherit;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;