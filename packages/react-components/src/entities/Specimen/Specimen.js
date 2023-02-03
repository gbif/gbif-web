import React, { useEffect } from 'react';
import { useQuery } from '../../dataManagement/api';
import { SpecimenPresentation } from './SpecimenPresentation';
import { MemoryRouter, useRouteMatch } from 'react-router-dom';

function EnsureRouter({ children }) {
  let hasRouter;
  try {
    const forTestOnly = useRouteMatch();
    hasRouter = true;
  } catch (err) {
    console.log(
      'No router context found, so creating a MemoryRouter for the component'
    );
    hasRouter = false;
  }
  return hasRouter ? (
    <>{children}</>
  ) : (
    <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
  );
}

export function Specimen({ id, config }) {
  const { data, error, loading, load } = useQuery(QUERY_SPECIMEN, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const query = {
        variables: {
          predicate: {
            type: 'and',
            predicates: [
              {
                type: "equals",
                key: "catalogNumber",
                value: "CANB 866289.4"
              },
              {
                type: "equals",
                key: "eventType",
                value: "Accession"
              }
            ]
          },
          offset: 0,
          limit: 1
        },
      };
      load(query);
    }
  }, [id]);

  return (
    <EnsureRouter>
      <SpecimenPresentation {...{ data, error, loading, id, config }} />
    </EnsureRouter>
  );
}

const QUERY_SPECIMEN = `
query list($predicate: Predicate, $offset: Int, $limit: Int){
  results: eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $offset
    ) {
    documents {
      size
      from
      total
      results {
        eventID
        occurrences(size: 1) {
          results {
            key
            gbifID
            identifier
            modified
            acceptedScientificName
            verbatimScientificName
            acceptedTaxonKey
            kindgom
            kingdomKey
            phylum
            phylumKey
            class
            classKey
            order
            orderKey
            family
            familyKey
            genus
            genusKey
            species
            speciesKey
            datasetKey
            parsedEventDate {
              gte
              lte
            }
            disposition
            eventID
            eventRemarks
            eventDate
            geodeticDatum
            georeferencedBy
            habitat
            nomenclaturalCode
            occurrenceID
            occurrenceRemarks
            occurrenceStatus
            recordNumber
            recordedBy
            reproductiveCondition
            scientificNameAuthorship
            verbatimLatitude
            verbatimLongitude
            basisOfRecord
            catalogNumber
            collectionCode
            coordinateUncertaintyInMeters
            country
            countryCode
            stateProvince
            identifiedBy
            dateIdentified
            day
            month
            year
            decimalLatitude
            decimalLongitude
            institutionCode
            locality
          }
        }
      }
    }
  }
}
`;
