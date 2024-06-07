import { useEffect } from 'react';
import { SimpleTooltip } from './SimpleTooltip';
import { VocabularyConceptQuery, VocabularyConceptQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';

/**
 * Component will show given content only partially
 * If the content is too high, component will render "Show More" button
 */
export const ConceptValue = ({ vocabulary, name, includeContext }: {
  vocabulary: string,
  name: string,
  includeContext?: boolean
}) => {
  const { data, error, loading, load } = useQuery<VocabularyConceptQuery, VocabularyConceptQueryVariables>(CONCEPT, { lazyLoad: true });

  useEffect(() => {
    if (!vocabulary || !name) return;
    load({ variables: { vocabulary, concept: name, language: 'en' } });
  }, [vocabulary, name]);

  const concept = data?.concept;

  if (loading) return <>Loading</>;
  if (!vocabulary || !name || !data || !concept) return <>Unknown</>
  if (error) return <>Error</>;

  

  const parentLabels = concept.parents?.length && concept.parents?.length > 0 && concept.parents?.map(parent => parent.uiLabel).join(', ');
  if (includeContext) {
    return <>
      {concept?.uiLabel}{' '}{<span className='g-text-slate-500'>{parentLabels}</span>}
      <div>
        {concept?.uiDefinition}
      </div>
    </>
  }
  
  if (!concept.uiDefinition && !parentLabels) return (<>{concept.uiLabel}</>);

  return (<>
    <SimpleTooltip title={<>{concept.uiDefinition && <div className='g-mb-2'>{concept.uiDefinition}</div>}<div>{parentLabels}</div></>}>
      {concept.uiLabel}
    </SimpleTooltip>
  </>
  );
}

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
