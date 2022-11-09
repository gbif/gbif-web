
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { useQuery } from '../../dataManagement/api';
import { SpecimenPresentation } from './SpecimenPresentation';
import merge from 'lodash/merge';
import EnsureRouter from '../../EnsureRouter';

export function Specimen({
  id,
  ...props
}) {
  const { data, error, loading } = {
    loading: false,
    error: null,
    data: {
      
    }
  }

  return <EnsureRouter>
    <SpecimenPresentation {...{ data, error, loading, id }} />
  </EnsureRouter>
};
