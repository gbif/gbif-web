import React, { useContext, useEffect } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, Properties, Skeleton } from '../../../components';
import range from 'lodash/range';
import { SeedbankFields } from '../SeedbankFields';
import { useQuery } from '../../../dataManagement/api';
import { Group } from './Groups';

const { Term: T, Value: V } = Properties;

const TREATMENT_EVENT = `
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
        eventType {
          concept
        }
        day
        month
        year
        parentEventID
        month
        year
        temporalCoverage {
          gte
          lte
        }
        extensions {
          seedbank {
            mediaSubstrate
            nightTemperatureInCelsius
            dayTemperatureInCelsius
            darkHours
            lightHours
          }
        }
      }
    }
  }
}
`;

const getDate = ({ temporalCoverage: tc }) => {
  if (tc?.gte && tc?.lte) {
    return `${tc.gte} to ${tc.lte}`;
  } else if (tc?.gte) {
    return tc.gte;
  } else if (tc?.lte) {
    return tc.lte;
  }

  return 'Unknown Date';
};

function TreatmentCardSkeleton({ ...props }) {
  const theme = useContext(ThemeContext);

  return (
    <article css={css.clusterCard({ theme })} {...props}>
      <Row wrap='nowrap' halfGutter={6} style={{ padding: 12 }}>
        <Col>
          <Skeleton width='60%' style={{ height: 18, marginBottom: 18 }} />
          {/* <div css={css.entitySummary({ theme })}></div> */}
          <div>
            <Properties style={{ fontSize: 12 }} horizontal dense>
              {range(0, 6).map((key) => (
                <React.Fragment key={key}>
                  <T>
                    <Skeleton width='80%' />
                  </T>
                  <V>
                    <Skeleton width='75%' />
                  </V>
                </React.Fragment>
              ))}
            </Properties>
          </div>
        </Col>
      </Row>
      <div css={css.clusterFooter({ theme })}>
        <Properties style={{ fontSize: 12 }} horizontal dense>
          <T>
            <Skeleton width='80%' />
          </T>
          <V>
            <Skeleton width='75%' />
          </V>
        </Properties>
      </div>
    </article>
  );
}

function TreatmentCard({ event, ...props }) {
  const theme = useContext(ThemeContext);

  if (!event) return <TreatmentCardSkeleton />;
  const treatment = event.extensions?.seedbank;
  const treatmentFields = [
    'mediaSubstrate',
    'nightTemperatureInCelsius',
    'dayTemperatureInCelsius',
    'darkHours',
    'lightHours',
  ];

  return (
    <article css={css.clusterCard({ theme })} {...props}>
      <Row wrap='nowrap' halfGutter={6} style={{ padding: 12 }}>
        <Col>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <h4 style={{ margin: 0 }}>{getDate(event)}</h4>
          </div>
          <div>
            <SeedbankFields event={event} fields={treatmentFields} />
          </div>
        </Col>
      </Row>
      {treatment.pretreatment && (
        <div css={css.clusterFooter({ theme })}>
          <Properties style={{ fontSize: 12 }} horizontal dense>
            <T>Pre-Treatment</T>
            <V>{treatment.pretreatment}</V>
          </Properties>
        </div>
      )}
    </article>
  );
}

export function Treatments({ event }) {
  const { data, error, loading, load } = useQuery(TREATMENT_EVENT, {
    lazyLoad: true,
  });

  console.log(data);

  useEffect(() => {
    if (typeof event?.eventID !== 'undefined') {
      load({
        variables: {
          predicate: {
            type: 'and',
            predicates: [
              {
                type: 'equals',
                key: 'eventHierarchy',
                value: event?.eventID,
              },
              {
                type: 'equals',
                key: 'eventType',
                value: 'Treatment',
              },
            ],
          },
        },
        size: 10,
        from: 0,
      });
    }
  }, [event?.eventID]);

  const isLoading = loading || !data;

  return (
    <Group label='extensions.seedbank.groups.treatments'>
      {isLoading ? (
        <TreatmentCardSkeleton />
      ) : (
        data.results.documents.results.map((treatment) => (
          <TreatmentCard event={treatment} />
        ))
      )}
    </Group>
  );
}
