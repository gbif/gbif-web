
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
// import * as css from './styles';
import { Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { CollectionPresentation } from './CollectionPresentation';
const { TabList, Tab, TabPanel } = Tabs;

export function Collection({
  id,
  defaultTab = 'about',
  ...props
}) {
  const { data, error, loading, load } = useQuery(COLLECTION, { lazyLoad: true });
  const [activeId, setTab] = useState(defaultTab);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({
        variables: {
          key: id,
          predicate: {
            type: "equals",
            key: "collectionKey",
            value: id
          }
        }
      });
    }
  }, [id]);

  return <CollectionPresentation {...{ data, error, loading: loading || !data, id }} />
};

const COLLECTION = `
query collection($key: String!, $predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
  }
  collection(key: $key) {
    key
    code
    name
    description
    contentTypes
    active
    personalCollection
    email
    phone
    homepage
    catalogUrl
    preservationTypes
    accessionStatus
    institutionKey
    notes
    identifiers {
      key
      type
      identifier
    }
    contacts {
      key
      firstName
      lastName
      position
      areaResponsibility
      researchPursuits
      phone
      email
      fax
    }
    numberSpecimens
    taxonomicCoverage
    geography
    incorporatedCollections
    importantCollectors
    collectionSummary
    alternativeCodes {
      code
      description
    }
    # occurrenceMappings
    institution {
      code
      name
      key
    }
    
    mailingAddress {
      address
      city
      province
      postalCode
      country
    }
    address {
      address
      city
      province
      postalCode
      country
    }
  }
}
`;

