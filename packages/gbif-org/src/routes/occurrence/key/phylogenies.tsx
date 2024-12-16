// based on https://github.com/veg/phylotree.js/issues/437, but that didn't work for me. So I now add the crazy append myself
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { OccurrenceIssue, OccurrenceQuery, OccurrenceQueryVariables, Term } from '@/gql/graphql';
import { OccurrenceKeyContext } from './occurrenceKey';
import { useContext, useState, useEffect } from 'react';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import { Phylogeny } from '@/components/phylogeny/phologeny';

// we will need a way to scope the css to the component

export const OccurrenceKeyPhylo = () => {
  const [phylogenies, setPhylogenies] = useState([])
  const { key, datasetKey, dynamicProperties } = useContext(OccurrenceKeyContext);

  useEffect(()=> {
    if(dynamicProperties && datasetKey){
      try {
        const parsedDynamicProperties = JSON.parse(dynamicProperties)
        if(parsedDynamicProperties?.phylogenies?.[0]?.phyloTreeFileName){
          setPhylogenies(parsedDynamicProperties?.phylogenies)
        }
      } catch (error) { /* empty */ }
    }
  }, [datasetKey, dynamicProperties])


 
 /*  const phylogenies = [
    {
      "phyloTreeTipLabel": "Pyxidanthera_barbulata_02",
      "phyloTreeFileName": "above50_genes.nex"
    }
  ] */
  // const datasetKey = "83d08402-136a-42c4-ae34-d4904a7ceade"


 

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-0">
      {phylogenies.map(p => <Phylogeny datasetKey={datasetKey} phyloTreeFileName={p.phyloTreeFileName} phyloTreeTipLabel={p.phyloTreeTipLabel}/>)}
    </ArticleContainer>
  );
}
