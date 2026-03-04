import { IptInstallationsQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { GeoJsonMap } from '@/routes/institution/search/map';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { useQuery } from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useMemo } from 'react';

const IPT_INSTALLATIONS_QUERY = /* GraphQL */ `
  query IptInstallations {
    installationSearch(type: "IPT_INSTALLATION", limit: 10000) {
      count
      results {
        key
        type
        organization {
          key
          title
          latitude
          longitude
          country
        }
      }
    }
  }
`;

interface IptMapData {
  geojson: GeoJSON.FeatureCollection;
  installationCount: number;
  countryCount: number;
}

function buildIptMapData(
  installations: NonNullable<IptInstallationsQuery['installationSearch']>['results']
): IptMapData {
  type Org = NonNullable<(typeof installations)[number]['organization']>;
  const orgMap = new Map<
    string,
    Pick<Org, 'title' | 'key' | 'country'> & { lat: number; lng: number; count: number }
  >();

  const countries = new Set<string>();

  for (const inst of installations) {
    const org = inst.organization;
    if (!org) continue;

    if (org.country) countries.add(org.country);

    const existing = orgMap.get(org.key);
    if (existing) {
      existing.count++;
    } else if (org.latitude != null && org.longitude != null) {
      orgMap.set(org.key, {
        title: org.title,
        key: org.key,
        lat: org.latitude,
        lng: org.longitude,
        count: 1,
        country: org.country ?? undefined,
      });
    }
  }

  const features: GeoJSON.Feature[] = [];
  for (const [, org] of orgMap) {
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [org.lng, org.lat] },
      properties: { key: org.key, name: org.title, count: org.count },
    });
  }

  return {
    geojson: { type: 'FeatureCollection', features },
    installationCount: installations.length,
    countryCount: countries.size,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IptPopupContent({ features }: { features: Record<string, any>[] }) {
  return (
    <ul className="g-list-disc g-px-2">
      {features.map((x) => (
        <li key={x.key}>
          <DynamicLink
            className="g-underline"
            to={`/publisher/${x.key}`}
            pageId="publisherKey"
            variables={{ key: x.key }}
          >
            {x.name}
          </DynamicLink>
          <div className="g-text-slate-500">
            <FormattedMessage id="counts.nInstallations" values={{ total: x.count }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function IptInstallationsMap({ textClassName }: { textClassName?: string }) {
  const { data, loading, error } = useQuery<IptInstallationsQuery, undefined>(
    IPT_INSTALLATIONS_QUERY,
    { keepDataWhileLoading: true }
  );

  const mapData = useMemo(() => {
    const installations = data?.installationSearch?.results ?? [];
    return buildIptMapData(installations);
  }, [data]);

  const isLoading = loading || !data;

  return (
    <div className="g-mt-8 g-mb-6 g-max-w-6xl g-m-auto">
      {isLoading && <Skeleton className="g-aspect-[2/1] md:g-aspect-[12/5] g-rounded-md" />}
      {!isLoading && (
        <GeoJsonMap
          geojson={mapData.geojson}
          loading={isLoading}
          error={!!error}
          className="g-aspect-[2/1] md:g-aspect-[12/5] g-rounded-md"
          PopupContent={IptPopupContent}
          storageKey="iptMap"
        />
      )}

      {/* Stats bar */}
      <div className="g-bg-primary-500 g-text-white g-flex g-flex-col sm:g-flex-row g-justify-around g-items-center g-px-6 g-py-3 g-text-sm g-font-semibold g-gap-2">
        {isLoading ? (
          <>
            <Skeleton className="g-h-5 g-w-32 g-bg-primary-400" />
            <Skeleton className="g-h-5 g-w-28 g-bg-primary-400" />
          </>
        ) : (
          <>
            <span>
              <FormattedMessage
                id="counts.nInstallations"
                values={{ total: mapData.installationCount }}
              />
            </span>
            <span>
              <FormattedMessage id="counts.nCountries" values={{ total: mapData.countryCount }} />
            </span>
          </>
        )}
      </div>

      {/* Help text */}
      <p className={cn("g-text-sm g-text-slate-500 dark:g-text-slate-400 underlineLinks g-mt-0.5", textClassName)}>
        <FormattedMessage
          id="tools.ipt.dontSeeYourIpt"
          values={{
            a: (text) => (
              <a
                href="mailto:helpdesk@gbif.org"
                title="Mail to GBIF Help Desk requesting IPT be added to map"
              >
                {text}
              </a>
            ),
          }}
        />
      </p>
    </div>
  );
}
