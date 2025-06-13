import { VocabularyConceptQuery, VocabularyConceptQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useI18n } from '@/reactRouterPlugins';
import { useEffect } from 'react';
import { SimpleTooltip } from './simpleTooltip';

/**
 * Component will show given content only partially
 * If the content is too high, component will render "Show More" button
 */
export const ConceptValue = ({
  vocabulary,
  name,
  includeContext,
  hideTooltip,
}: {
  vocabulary: string;
  name: string;
  includeContext?: boolean;
  hideTooltip?: boolean;
}) => {
  const { locale } = useI18n();

  const { data, error, loading, load } = useQuery<
    VocabularyConceptQuery,
    VocabularyConceptQueryVariables
  >(CONCEPT, { lazyLoad: true });

  useEffect(() => {
    if (!vocabulary || !name) return;
    load({
      variables: {
        vocabulary,
        concept: name,
        language: locale.vocabularyLocale ?? locale.localeCode,
      },
    });
  }, [vocabulary, name, locale, load]);

  const concept = data?.concept;

  if (loading) return <>Loading</>;
  if (!vocabulary || !name || !data || !concept) return <>{name || 'Unknown'}</>;
  if (error) return <>Error</>;

  const parentLabels =
    concept.parents?.length &&
    concept.parents?.length > 0 &&
    concept.parents?.map((parent) => parent.uiLabel).join(', ');
  if (includeContext) {
    return (
      <>
        {concept?.uiLabel} {<span className="g-text-slate-500">{parentLabels}</span>}
        <div>{concept?.uiDefinition}</div>
      </>
    );
  }

  if (!concept.uiDefinition && !parentLabels) return <>{concept.uiLabel}</>;

  if (hideTooltip) {
    return concept.uiLabel;
  }

  return (
    <>
      <SimpleTooltip
        title={
          <>
            {concept.uiDefinition && <div className="g-mb-2">{concept.uiDefinition}</div>}
            <div>{parentLabels}</div>
          </>
        }
      >
        {concept.uiLabel}
      </SimpleTooltip>
    </>
  );
};

const CONCEPT = /* GraphQL */ `
  query vocabularyConcept($language: String, $vocabulary: ID!, $concept: ID!) {
    concept: vocabularyConcept(vocabulary: $vocabulary, concept: $concept) {
      uiLabel(language: $language)
      uiDefinition(language: $language)
      parents {
        uiLabel(language: $language)
      }
    }
  }
`;
