import { useLink } from '@/reactRouterPlugins/dynamicLink';
import { phylotree } from 'phylotree';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import parseNexus from './parseNexus';
import cssAsText from './styles';

const css_classes = {
  'tree-container': 'phylotree-container',
  'tree-scale-bar': 'gbif-phylotree-tree-scale-bar',
  node: 'gbif-phylotree-node',
  'internal-node': 'gbif-phylotree-internal-node',
  'tagged-node': 'gbif-phylotree-node-tagged',
  'selected-node': 'gbif-phylotree-node-selected',
  'collapsed-node': 'gbif-phylotree-node-collapsed',
  'root-node': 'gbif-phylotree-root-node',
  branch: 'gbif-phylotree-branch',
  'selected-branch': 'gbif-phylotree-branch-selected',
  'tagged-branch': 'gbif-phylotree-branch-tagged',
  'tree-selection-brush': 'gbif-phylotree-tree-selection-brush',
  'branch-tracer': 'gbif-phylotree-branch-tracer',
  clade: 'gbif-phylotree-clade',
  node_text: 'gbif-phylotree-phylotree-node-text',
};

type TreeData = {
  nwk?: string;
  tipTranslation?: unknown;
};
const pathToRoot = (node: { parent: never }) => {
  const edgeSelection = [];
  while (node) {
    edgeSelection.push(node);
    node = node.parent;
  }
  return edgeSelection;
};
const startsWithLowerCase = (s: string) => {
  const character = s.charAt(0);
  return character == character.toLowerCase();
};

const Phylogeny = ({
  datasetKey,
  phyloTreeTipLabel,
  phyloTreeFileName,
}: {
  datasetKey?: string;
  phyloTreeTipLabel?: string;
  phyloTreeFileName: string;
}) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState<TreeData>({});
  const spacingX = 14;
  const spacingY = 30;
  const createLink = useLink();

  useEffect(() => {
    const fileExtension = phyloTreeFileName.split('.').pop() || '';

    fetch(`${import.meta.env.PUBLIC_WEB_UTILS}/source-archive/${datasetKey}/${phyloTreeFileName}`, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((data) => {
        let nwk, tipTranslation;
        if (['nex', 'nexus'].includes(fileExtension)) {
          const parsedNexus = parseNexus(data);
          nwk = parsedNexus?.treesblock?.trees?.[0]?.newick;
          tipTranslation = parsedNexus?.treesblock?.translate;
        } else if (['phy', 'nwk', 'newick', 'tree'].includes(fileExtension)) {
          nwk = data;
          tipTranslation = null;
        }
        setTreeData({ nwk, tipTranslation });
      })
      .catch((error) => {
        setTreeData({});
      });
  }, [datasetKey, phyloTreeFileName]);

  useEffect(() => {
    if (treeData?.nwk) {
      const { nwk, tipTranslation } = treeData;
      const tree = new phylotree(nwk);

      if (tipTranslation) {
        const internals = tree.getInternals();
        const tips = tree.getTips();
        for (const nodes of [internals, tips]) {
          for (let i = 0; i < nodes.length; i++) {
            if (tipTranslation[nodes?.[i]?.data?.name]) {
              nodes[i].data.name = tipTranslation[nodes?.[i]?.data?.name];
            }
          }
        }
      }

      const selectedNode = phyloTreeTipLabel
        ? tree.getNodeByName(phyloTreeTipLabel.replaceAll(' ', '_'))
        : null;
      const edgeSelection = selectedNode ? pathToRoot(selectedNode) : [];
      const options = {
        container: '#phylotreeContainer',
        'max-radius': 468,
        width: 500,
        /* zoom: true,
  'show-menu': false,
  align-tips: false
  annular-limit: 0.38196601125010515
  attribute-list: []
  binary-selectable: false
  bootstrap: false
  branches: "step"
  brush: true
  collapsible: true
  color-fill: true
  compression: 0.2
  container: "#tree_container"
  draw-size-bubbles: false
  edge-styler: null
  hide: true
  internal-names: false
  is-radial: false
  label-nodes-with-name: false
  layout: "left-to-right"
  left-offset: 0
  left-right-spacing: "fixed-step"
  logger: console {debug: ƒ, error: ƒ, info: ƒ, log: ƒ, warn: ƒ, …}
  max-radius: 768
  maximum-per-level-spacing: 100
  maximum-per-node-spacing: 100
  minimum-per-level-spacing: 10
  minimum-per-node-spacing: 2
  node-span: null
  node-styler: (element, data) => {…}
  node_circle_size: ƒ ()
  reroot: true
  restricted-selectable: false
  scaling: true
  selectable: true
  show-labels: true
  show-menu: true
  show-scale: "top"
  top-bottom-spacing: "fixed-step"
  transitions: null
  zoom: false */
        'show-menu': false,
        'left-right-spacing:': 'fit-to-size',
        'node-styler': function (
          element: {
            style: (arg0: string, arg1: string, arg2: string | undefined) => void;
            on: (arg0: string, arg1: (e: any) => void) => void;
          },
          data: {
            children: any;
            data: {
              name: {
                split: (arg0: string) => any;
                replaceAll: (arg0: string, arg1: string) => string;
              };
            };
          }
        ) {
          if (data?.data?.name && data?.data?.name?.replaceAll('_', ' ') === phyloTreeTipLabel) {
            element.style('fill', '#71b171', 'important');
          }
          if (data?.data?.name && !data.children) {
            element.style('cursor', 'pointer');
          }
          element.on('click', function (event: any) {
            if (data.data.name && !data.children) {
              let searchTerm = '';
              const parts = data.data.name.split('_');
              if (parts.length < 3) {
                searchTerm = data.data.name.replaceAll('_', ' ');
              } else {
                const firstEpithet = parts.find(startsWithLowerCase);
                const firstEpithetIndex = parts.indexOf(firstEpithet);
                if (firstEpithetIndex > 1) {
                  searchTerm = parts.slice(firstEpithetIndex - 1).join(' ');
                } else {
                  searchTerm = data.data.name.replaceAll('_', ' ');
                }
              }

              // the createlink fn do not handle redirecting to gbif.org, so in cases where we do not get a link back
              // we need to manually state the default url used. and then leave it to the router to redirect as needed.
              let { to } = createLink({
                pageId: 'occurrenceSearch',
                searchParams: { q: searchTerm, datasetKey, view: 'table' },
              });
              if (!to)
                to = `/occurrence/search?q=${searchTerm}&datasetKey=${datasetKey}&view=table`;
              navigate(to);
            }
          });
        },
        'edge-styler': function (
          element: { style: (arg0: string, arg1: string, arg2: string) => void },
          data: { target: never }
        ) {
          if (edgeSelection.includes(data.target)) {
            element.style('stroke', '#71b171', 'important');
          }
        },
      };

      // not optimal to call render twice, but the display object is not available before render is called, see https://github.com/veg/phylotree.js/issues/471
      tree.render(options);
      tree.display.css(css_classes).update();
      tree.render(options);
      tree.display.spacing_x(spacingX).update();
      tree.display.spacing_y(spacingY).update();
      const svgContent = tree.display.show();
      if (ref?.current && !ref.current?.shadowRoot) {
        const shadowRoot = ref.current?.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = cssAsText;
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(svgContent);
      } else if (ref?.current && ref.current?.shadowRoot) {
        ref?.current?.shadowRoot.appendChild(svgContent);
      }

      return () => {
        const shadowRoot = ref?.current?.shadowRoot;
        if (shadowRoot) {
          while (shadowRoot.firstChild) {
            shadowRoot.removeChild(shadowRoot.firstChild);
          }
        }
      };
    }
  }, [datasetKey, treeData?.nwk]);

  return <div ref={ref} id="phylotreeContainer" className="g-overflow-x-scroll"></div>;
};

export default Phylogeny;
