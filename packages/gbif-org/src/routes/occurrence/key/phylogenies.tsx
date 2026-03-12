// based on https://github.com/veg/phylotree.js/issues/437, but that didn't work for me. So I now add the crazy append myself
import { Phylogeny } from '@/components/phylogeny';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useMemo } from 'react';
import { OccurrenceKeyContext } from './occurrenceKey';
import EmptyTab from '@/components/EmptyTab';

type PhylogenyType = {
  phyloTreeFileName: string;
  phyloTreeTipLabel: string;
};

export const OccurrenceKeyPhylo = () => {
  const { datasetKey, dynamicProperties } = useContext(OccurrenceKeyContext);

  const phylogenies = useMemo(() => {
    if (dynamicProperties && datasetKey) {
      try {
        const parsedDynamicProperties = JSON.parse(dynamicProperties);
        return parsedDynamicProperties?.phylogenies as PhylogenyType[];
      } catch (error) {
        return undefined;
      }
    }
  }, [datasetKey, dynamicProperties]);

  if (!phylogenies) {
    return <EmptyTab />;
  }

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {phylogenies.map((p) => (
          <Phylogeny
            key={p.phyloTreeFileName}
            datasetKey={datasetKey}
            phyloTreeFileName={p.phyloTreeFileName}
            phyloTreeTipLabel={p.phyloTreeTipLabel}
          />
        ))}
      </ArticleTextContainer>
    </ArticleContainer>
  );
};
