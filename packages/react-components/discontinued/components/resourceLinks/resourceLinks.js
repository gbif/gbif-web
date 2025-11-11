import { jsx, css } from '@emotion/react';
import React, { useContext } from "react";
import RouteContext from '../../dataManagement/RouteContext';
import LocaleContext from '../../dataManagement/LocaleProvider/LocaleContext';
import { Link, useHistory } from "react-router-dom";

export const ResourceLink = React.forwardRef(({ id, type, forceHref = false, queryString, otherIds, discreet, bold, localeContext: localeOverwrite, routeContext: routeOverwrite, ...props }, ref) => {
  const localeSettings = useContext(LocaleContext);
  const routeSettings = useContext(RouteContext);

  const localeContext = localeOverwrite || localeSettings;
  const routeContext = routeOverwrite || routeSettings;

  const basename = routeContext.basename;
  if (!routeContext[type]) {
    console.warn(`No such route: ${type}`)
    return null;
  }

  const gbifOrgLocale = localeContext?.localeMap?.gbif_org;
  const { alwaysUseHrefs, enabledRoutes = [] } = routeContext;
  const { url, isHref, route, gbifUrl, parent } = routeContext[type];

  // check to see if the route is enabled or we should use GBIF routes
  const types = [type];
  if (parent) types.push(parent);
  const intersection = enabledRoutes.filter(value => types.includes(value));
  const useGBIF = intersection.length === 0;

  const urlBuilder = useGBIF ? (gbifUrl ?? url) : (url ?? gbifUrl);

  const to = urlBuilder({ key: id, otherIds, queryString, route, basename, gbifOrgLocalePrefix: gbifOrgLocale ? `/${gbifOrgLocale}` : '' });
  let style = isDiscreetLink;
  if (discreet) style = isDiscreet;
  if (bold) style = isBoldLink;
  if (forceHref || useGBIF || alwaysUseHrefs || isHref) {
    return <a href={to} css={style} ref={ref} {...props} />
  } else {
    return <Link to={to} css={style} ref={ref} {...props} />
  }
});

export const ResourceSearchLink = ResourceLink;

export const resourceAction =  ({ id: key, type, history, localeSettings, routeContext, ...rest }) => {
  const basename = routeContext.basename;
  const gbifOrgLocale = localeSettings?.localeMap?.gbif_org;
  const { alwaysUseHrefs = false } = routeContext;
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
  if (alwaysUseHrefs || isHref) {
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