import { Card, CardContent } from '@/components/ui/smallCard';
import { DatasetQuery } from '@/gql/graphql';
import { notNull } from '@/utils/notNull';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { FormattedMessage } from 'react-intl';

type LocalContexts = NonNullable<DatasetQuery['dataset']>['localContexts'];

export function LocalContextCards({ localContexts }: { localContexts?: LocalContexts }) {
  return (
    <div className="g-grid g-mb-4 g-gap-2 g-grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
      {localContexts?.filter(notNull).map((localContext) => {
        if (!localContext.project_page) return null;
        const notices = (localContext.notice ?? [])
          .filter(notNull)
          .filter((n) => n.name && n.img_url);
        const labels = (localContext.labels ?? [])
          .filter(notNull)
          .filter((l) => l.name && l.img_url);

        // Group labels by community name
        const labelsByCommunity = new Map<string, typeof labels>();
        for (const label of labels) {
          const community = label.communityName ?? '';
          if (!labelsByCommunity.has(community)) {
            labelsByCommunity.set(community, []);
          }
          labelsByCommunity.get(community)!.push(label);
        }

        return (
          <Card className="gbif-word-break" key={localContext.project_page}>
            <CardContent className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
              <div className="g-flex-none g-me-2">
                <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                  <ExternalLinkIcon />
                </div>
              </div>
              <div className="g-flex-auto">
                <a
                  href={localContext.project_page}
                  target="_blank"
                  rel="noreferrer"
                  className="g-flex g-items-center g-underline"
                >
                  <h5 className="g-font-bold">{localContext.title}</h5>
                </a>
                {notices.length > 0 && (
                  <ul className="g-mt-2">
                    {notices.map((notice, i) => (
                      <li className="g-flex g-items-center g-mb-2" key={`${notice.name}-${i}`}>
                        <img
                          className="g-flex-none g-me-2 g-w-5 g-h-5 g-object-contain"
                          src={notice.img_url ?? undefined}
                          alt={notice.name ?? undefined}
                          title={notice.name ?? undefined}
                        />
                        <span>{notice.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {[...labelsByCommunity.entries()].map(([communityName, communityLabels]) => (
                  <div key={communityName}>
                    {communityName && (
                      <p className="g-mt-2 g-text-slate-500">
                        <FormattedMessage
                          id="dataset.localContextsLabelsAppliedBy"
                          defaultMessage="{count, plural, one{Label} other{Labels}} applied by {communityName}"
                          values={{
                            count: communityLabels.length,
                            communityName,
                          }}
                        />
                      </p>
                    )}
                    <ul className="g-mt-2">
                      {communityLabels.map((label, i) => (
                        <li className="g-flex g-items-center g-mb-2" key={`${label.name}-${i}`}>
                          <img
                            className="g-flex-none g-me-2 g-w-5 g-h-5 g-object-contain"
                            src={label.img_url ?? undefined}
                            alt={label.name ?? undefined}
                            title={label.name ?? undefined}
                          />
                          <span>{label.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
