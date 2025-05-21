import { FormattedNumber } from '@/components/dashboard/shared';
import { Unknown } from '@/components/message';
import { Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';
import { notNull } from '@/utils/notNull';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { InstitutionKeyContext } from './institutionKeyPresentation';
import OrphanedCollectionCodes from './OrphanedCollectionCodes';

export default function Collections() {
  const { key, contentMetrics } = useContext(InstitutionKeyContext);
  const collections = contentMetrics?.institution?.collections;
  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {isNoneEmptyArray(collections) && (
          <Card className="g-relative g-overflow-x-auto g-rounded g-border g-border-solid g-mb-4">
            <table className="g-w-full g-text-sm g-text-left rtl:g-text-right g-text-gray-500 dark:g-text-gray-400">
              <thead className="g-text-slate-500 g-font-light g-bg-gray-50 dark:g-bg-gray-700 dark:g-text-gray-400 g-border-b">
                <tr>
                  <th scope="col" className="g-px-6 g-py-3 g-font-normal">
                    <FormattedMessage id="grscicoll.name" />
                  </th>
                  <th scope="col" className="g-px-1 g-py-3 g-font-normal">
                    <FormattedMessage id="grscicoll.code" />
                  </th>
                  <th scope="col" className="g-px-1 g-py-3 g-font-normal">
                    <FormattedMessage id="grscicoll.description" />
                  </th>
                  <th
                    scope="col"
                    className="g-px-6 g-py-3 g-font-normal g-text-right rtl:g-text-left"
                  >
                    <FormattedMessage id="grscicoll.specimens" />
                  </th>
                  <th
                    scope="col"
                    className="g-px-6 g-py-3 g-font-normal g-text-right rtl:g-text-left"
                  >
                    <FormattedMessage id="tableHeaders.gbifNumberSpecimens" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {collections?.map((collection) => {
                  return (
                    <tr
                      key={collection.key}
                      className="g-bg-white g-border-b last:g-border-0 dark:g-bg-gray-800 dark:g-border-gray-700"
                    >
                      <td
                        scope="row"
                        className="g-px-6 g-py-3 g-font-medium g-text-slate-900 dark:g-text-white g-min-w-80"
                      >
                        <DynamicLink
                          className="g-underline"
                          to={`/collection/${collection.key}`}
                          pageId="collectionKey"
                          variables={{ key: collection.key }}
                        >
                          {collection.name}
                        </DynamicLink>{' '}
                        {!collection.active && (
                          <Tag className="g-bg-red-700 g-text-white">
                            <FormattedMessage id="grscicoll.inactiveCollection" />
                          </Tag>
                        )}
                      </td>
                      <td className="g-px-1 g-py-3">
                        <Tag className="g-whitespace-nowrap">{collection.code}</Tag>
                      </td>
                      <td className="g-px-1 g-py-3">
                        <div
                          className="g-line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: collection.excerpt ?? '' }}
                        ></div>
                      </td>
                      <td className="g-px-6 g-py-3 g-text-right rtl:g-text-left">
                        {notNull(collection.numberSpecimens) && (
                          <FormattedNumber value={collection.numberSpecimens} />
                        )}
                        {!notNull(collection.numberSpecimens) && <Unknown />}
                      </td>
                      <td className="g-px-6 g-py-3 g-text-right rtl:g-text-left">
                        {notNull(collection.occurrenceCount) && (
                          <FormattedNumber value={collection.occurrenceCount} />
                        )}
                        {!notNull(collection.occurrenceCount) && <Unknown />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}

        <OrphanedCollectionCodes institutionKey={key} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
