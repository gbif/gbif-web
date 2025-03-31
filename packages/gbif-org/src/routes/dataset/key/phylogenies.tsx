// based on https://github.com/veg/phylotree.js/issues/437, but that didn't work for me. So I now add the crazy append myself
import { Phylogeny } from '@/components/phylogeny';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext, useEffect, useState } from 'react';
import { DatasetKeyContext } from './datasetKey';

type Phylogeny = {
  phyloTreeFileName: string;
  phyloTreeTipLabel: string;
};

export const DatasetKeyPhylo = () => {
  const [phylogenies, setPhylogenies] = useState<Phylogeny[]>([]);
  const { datasetKey, dynamicProperties } = useContext(DatasetKeyContext);

  useEffect(() => {
    if (dynamicProperties && datasetKey) {
      try {
        const parsedDynamicProperties = JSON.parse(dynamicProperties);
        if (parsedDynamicProperties?.phylogenies?.[0]?.phyloTreeFileName) {
          setPhylogenies(parsedDynamicProperties?.phylogenies);
        }
      } catch (error) {
        /* empty */
      }
    }
  }, [datasetKey, dynamicProperties]);

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
