// based on https://github.com/veg/phylotree.js/issues/437, but that didn't work for me. So I now add the crazy append myself
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { useEffect, useRef } from 'react';
// @ts-ignore
import { phylotree } from 'phylotree';

// import 'phylotree/dist/phylotree.css'; // there is no scoping of the css, so it will affect the whole site
// we will need a way to scope the css to the component

export function OccurrenceKeyPhylo() {
  const ref = useRef(null);

  useEffect(() => {
    const nwk =
      '(((EELA:0.150276,CONGERA:0.213019):0.230956,(EELB:0.263487,CONGERB:0.202633):0.246917):0.094785,((CAVEFISH:0.451027,(GOLDFISH:0.340495,ZEBRAFISH:0.390163):0.220565):0.067778,((((((NSAM:0.008113,NARG:0.014065):0.052991,SPUN:0.061003,(SMIC:0.027806,SDIA:0.015298,SXAN:0.046873):0.046977):0.009822,(NAUR:0.081298,(SSPI:0.023876,STIE:0.013652):0.058179):0.091775):0.073346,(MVIO:0.012271,MBER:0.039798):0.178835):0.147992,((BFNKILLIFISH:0.317455,(ONIL:0.029217,XCAU:0.084388):0.201166):0.055908,THORNYHEAD:0.252481):0.061905):0.157214,LAMPFISH:0.717196,((SCABBARDA:0.189684,SCABBARDB:0.362015):0.282263,((VIPERFISH:0.318217,BLACKDRAGON:0.109912):0.123642,LOOSEJAW:0.3971):0.287152):0.140663):0.206729):0.222485,(COELACANTH:0.558103,((CLAWEDFROG:0.441842,SALAMANDER:0.299607):0.135307,((CHAMELEON:0.771665,((PIGEON:0.150909,CHICKEN:0.172733):0.082163,ZEBRAFINCH:0.099172):0.272338):0.014055,((BOVINE:0.167569,DOLPHIN:0.15745):0.104783,ELEPHANT:0.166557):0.367205):0.050892):0.114731):0.295021)';
    const tree_nwk = new phylotree(nwk);

    const renderedTree = tree_nwk.render({
      height: 1000,
      width: 1000,
      'left-right-spacing': 'fit-to-size',
      'top-bottom-spacing': 'fit-to-size',
      container: ref.current,
    });

    // this seems wrong. What is the point of providing the container if it isn't used?
    if (ref?.current) ref.current.appendChild(renderedTree.show());
  }, []);

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-0">
      <div ref={ref} id="tree_container" className="g-bg-slate-200"></div>
    </ArticleContainer>
  );
}
