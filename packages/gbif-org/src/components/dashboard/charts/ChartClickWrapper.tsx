import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FilterContext, FilterType } from '@/contexts/filter';
import { ParamQuery, stringify } from '@/utils/querystring';
import React, { useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { merge } from 'ts-deepmerge';

type RedirectArgs = {
  filter?: Record<string, unknown>;
};

type ChartClickWrapperProps = {
  children: React.ReactElement;
  interactive?: boolean;
  detailsRoute?: string;
  [key: string]: unknown;
};

export default function ChartClickWrapper({
  children,
  interactive,
  detailsRoute,
  ...props
}: ChartClickWrapperProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { filter: filterContext, setFilter } = useContext(FilterContext);

  const handleRedirect = useCallback(
    ({ filter }: RedirectArgs) => {
      if (!filter || !interactive) return;
      if (!detailsRoute && !setFilter) {
        console.warn('ChartClickWrapper: no detailsRoute or setFilter provided');
        return;
      }
      const mergedFilter = merge({}, filterContext, { must: { ...filter } }) as FilterType;
      if (detailsRoute) {
        const newLocation = `${detailsRoute || location.pathname}?${stringify(
          filter as ParamQuery
        )}`;
        navigate(newLocation, { replace: false });
      } else {
        setFilter(mergedFilter);
      }
    },
    [detailsRoute, location.pathname, filterContext, interactive, setFilter, navigate]
  );

  return (
    <ErrorBoundary type="CARD">
      {React.cloneElement(children, { handleRedirect, interactive, ...props })}
    </ErrorBoundary>
  );
}
