import { jsx, css } from '@emotion/react';
import React, { useContext } from "react";
import RouteContext from '../../dataManagement/RouteContext';
import LocaleContext from '../../dataManagement/LocaleProvider/LocaleContext';
import { Link, useHistory } from "react-router-dom";

export const ResourceSearchLink = React.forwardRef(({ queryString, type, discreet, ...props }, ref) => {
  const routeContext = useContext(RouteContext);
  const basename = routeContext.basename;
  const { url, isHref, route } = routeContext[type];
  const to = url({ queryString, basename, route });
  const style = discreet ? isDiscreet : null;
  if (isHref) {
    return <a href={to} css={style} ref={ref} {...props} />
  } else {
    return <Link to={to} css={style} ref={ref} {...props} />
  }
});

export const ResourceLink = React.forwardRef(({ id, type, otherIds, discreet, bold, localeContext: localeOverwrite, routeContext: routeOverwrite, ...props }, ref) => {
  const localeSettings = useContext(LocaleContext);
  const routeSettings = useContext(RouteContext);

  const localeContext = localeOverwrite || localeSettings;
  const routeContext = routeOverwrite || routeSettings;

  const basename = routeContext.basename;
  const gbifOrgLocale = localeContext?.localeMap?.gbif_org;
  const { url, isHref, route } = routeContext[type];
  const to = url({ key: id, otherIds, route, basename, gbifOrgLocalePrefix: gbifOrgLocale ? `/${gbifOrgLocale}` : '' });
  let style = isDiscreetLink;
  if (discreet) style = isDiscreet;
  if (bold) style = isBoldLink;
  if (isHref) {
    return <a href={to} css={style} {...props} />
  } else {
    return <Link to={to} css={style} {...props} />
  }
});

export const resourceAction =  ({ id: key, type, history, localeSettings, routeContext, ...rest }) => {
  const basename = routeContext.basename;
  const gbifOrgLocale = localeSettings?.localeMap?.gbif_org;
  const { url, isHref, route } = routeContext[type];
  const gbifOrgLocalePrefix = gbifOrgLocale ? `/${gbifOrgLocale}` : '';
  const to = url({
    key, 
    route, 
    basename, 
    gbifOrgLocalePrefix,
    gbifOrgLocale,
    isHref,
    ...rest
  });
  if (isHref) {
    location.href = to;
  } else {
    history.push(to);
  }
  return null;
}

export function PublisherKeyLink(props) {
  return <ResourceLink type='publisherKey' {...props} />
}

export function DatasetKeyLink(props) {
  return <ResourceLink type='datasetKey' {...props} />
}

const isDiscreetLink = css`
  text-decoration: none;
  color: var(--linkColor);
  :hover {
    text-decoration: underline;
  }
`;

const isDiscreet = css`
  ${isDiscreetLink};
  color: inherit;
`;

const isBoldLink = css`
  font-weight: 500;
  ${isDiscreetLink}
`;