import { GbifNetworkParticipantsQuery } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import countries from '../../../enums/basic/country.json';
import { getCss } from './css';
import SvgMap from './SvgMap.jsx';

const gradients = {
  1: '#cbdbc5',
  2: '#b8ceb0',
  4: '#a6c19b',
  10: '#94b487',
  40: '#82a872',
  100: '#5a964d',
};

const votingColor = '#5a964d';
const associateColor = '#f8d572';

export function Map({
  listData,
  className,
}: {
  listData: GbifNetworkParticipantsQuery;
  className: string;
}) {
  const [mapType, setMapType] = useState('participants');
  const [publishers, setPublishers] = useState<Record<string, string>>({});
  const results = listData?.nodeSearch?.results ?? [];
  // map listdata.nodesearch results to a lookup with x.participant.countryCode.toLowerCase() as key and x.participant.participationStatus as value
  const countryLookup = results
    ?.filter((x) => x.type === 'COUNTRY')
    .reduce((acc, x) => {
      if (x.participant?.countryCode) {
        acc[x.participant.countryCode.toLowerCase()] =
          x.participant.participationStatus === 'VOTING'
            ? votingColor
            : x.participant.participationStatus === 'ASSOCIATE'
            ? associateColor
            : '#ffffff';
      }
      return acc;
    }, {} as Record<string, string>);

  const participants = countries.reduce((acc, c) => {
    acc[c.toLowerCase()] = countryLookup[c.toLowerCase()] ?? '#ffffff';
    return acc;
  }, {} as Record<string, string>);

  // fetch data from /unstable-api/network-stats
  useEffect(() => {
    fetch(`${import.meta.env.PUBLIC_WEB_UTILS}/network-stats`)
      .then((res) => res.json())
      .then((data) => {
        // const results = data.collectionsPerCountry;
        const results = data.organizationsPerCountry;
        const lookup = {};

        Object.keys(results).forEach((key) => {
          // select largest gradient color based on number of organizations
          const gradient = Object.keys(gradients)
            .map(Number)
            .reverse()
            .find((g) => results[key] >= g);

          lookup[key.toLowerCase()] = gradients[gradient];
        });
        const orgs = countries.reduce((acc, c) => {
          acc[c.toLowerCase()] = lookup[c.toLowerCase()] ?? '#ffffff';
          return acc;
        }, {} as Record<string, string>);
        setPublishers(orgs);
      });
  }, []);

  const style = getCss(mapType === 'publishers' ? publishers : participants);
  return (
    <div className={cn('g-max-w-6xl g-m-auto', className)}>
      <div className="g-w-full g-h-0 g-relative g-z-10" style={{ paddingBottom: '51%' }}>
        <SvgMap style={style} />
        <div className="g-absolute g-z-20 g-bottom-4 g-text-center g-w-full">
          <div className="g-inline-block g-text-center g-mx-auto g-text-sm g-rounded-full g-bg-white g-shadow">
            <button
              className={cn(
                'g-rounded-s-full g-border g-px-2 dark:g-bg-slate-700 dark:g-text-slate-100',
                {
                  'g-bg-slate-700 g-text-white g-border-slate-800 dark:g-bg-white dark:g-text-slate-700 dark:g-border-white':
                    mapType === 'participants',
                }
              )}
              onClick={() => setMapType(mapType === 'publishers' ? 'participants' : 'publishers')}
            >
              <FormattedMessage id="gbifNetwork.countryParticipants" />
            </button>
            <button
              className={cn(
                'g-rounded-e-full g-border g-px-2 dark:g-bg-slate-700 dark:g-text-slate-100',
                {
                  'g-bg-slate-700 g-text-white g-border-slate-800 dark:g-bg-white dark:g-text-slate-700 dark:g-border-white':
                    mapType === 'publishers',
                }
              )}
              onClick={() => setMapType(mapType === 'publishers' ? 'participants' : 'publishers')}
            >
              <FormattedMessage id="gbifNetwork.publishersPerCountry" />
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="g-mt-1 g-mb-1 g-text-slate-500 g-text-center g-text-sm">
          {mapType === 'participants' && (
            <div>
              <div className="g-inline-block g-ms-2">
                <div className="g-inline-block g-mx-4">
                  <div
                    className="g-inline-block g-w-4 g-h-4 g-me-1 g-text-slate-900"
                    style={{ backgroundColor: votingColor }}
                  >
                    {' '}
                  </div>
                  <FormattedMessage id="gbifNetwork.participationType.VOTING" />
                </div>
                <div className="g-inline-block">
                  <div
                    className="g-inline-block g-w-4 g-h-4 g-me-1 g-text-slate-900"
                    style={{ backgroundColor: associateColor }}
                  >
                    {' '}
                  </div>
                  <FormattedMessage id="gbifNetwork.participationType.ASSOCIATE" />
                </div>
              </div>
            </div>
          )}
          {mapType === 'publishers' && (
            <div>
              <FormattedMessage id="gbifNetwork.mapCaptionPublishers" />
              <div className="g-inline-block g-ms-2">
                {/* create a legend based on the gradients */}
                {Object.keys(gradients).map((threshold, index) => (
                  <div
                    key={index}
                    className="g-inline-block g-px-1 g-text-slate-900"
                    style={{ backgroundColor: gradients[threshold] }}
                  >
                    {threshold}+
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
