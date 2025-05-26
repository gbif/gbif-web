// @ts-nocheck
import { FilterContext } from '@/contexts/filter';
import { stringify } from '@/utils/querystring';
import React, { useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { merge } from 'ts-deepmerge';

export default function ChartClickWrapper({ children, interactive, detailsRoute, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { filter: filterContext, setFilter } = useContext(FilterContext);

  const handleRedirect = useCallback(
    ({ filter }) => {
      if (!filter || !interactive) return;
      if (!detailsRoute && !setFilter) {
        console.warn('ChartClickWrapper: no detailsRoute or setFilter provided');
        return;
      }
      const mergedFilter = merge({}, filterContext, { must: { ...filter } });
      if (detailsRoute) {
        const newLocation = `${detailsRoute || location.pathname}?${stringify(filter)}`;
        navigate(newLocation, { replace: false });
      } else {
        setFilter(mergedFilter);
      }
    },
    [detailsRoute, location.pathname, filterContext, interactive, setFilter, navigate]
  );

  // return React.cloneElement(children, { handleRedirect, interactive, ...props });
  return React.cloneElement(children, { handleRedirect, interactive, ...props });
}
