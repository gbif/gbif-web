
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { ApiContext, ApiClient } from '../../dataManagement/api';
import { useQuery, } from '../../dataManagement/api';
import { SpecimenPresentation } from './SpecimenPresentation';
import get from 'lodash/get';
import _ from 'lodash';
import EnsureRouter from '../../EnsureRouter';
import useSpecimenData from './useSpecimenData';

export function Specimen({
  id,
  ...props
}) {
  const { specimen, data, error, loading } = useSpecimenData({ id });

  if (data?.specimen?.nodes?.length === 0) {
    return <h2 style={{color: '#aaa', padding: '0px 50px 500px 50px'}}>No such catalogue number</h2>
  }

  return <EnsureRouter>
    <SpecimenPresentation {...{ data: { specimen }, error, loading, id }} />
  </EnsureRouter>
};