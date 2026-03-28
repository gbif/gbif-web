import {
  TaxonData,
  Tree,
  TreeGroup,
  TreeHeader,
  TreeItem,
  TreeToggle,
} from './components/decomposed';
import { BaseTaxonNode, TaxonomicTree } from './components/TaxonomicTree';

interface SpeciesNode extends BaseTaxonNode {
  rank: 'Kingdom' | 'Phylum' | 'Class' | 'Order' | 'Family' | 'Genus' | 'Species';
  occurrences: number;
  hasSynonyms?: boolean;
}

const myTaxonomy: SpeciesNode[] = [
  {
    id: 'k-1',
    label: 'Animalia',
    rank: 'Kingdom',
    occurrences: 1500000,
    children: [
      {
        id: 'p-1',
        label: 'Chordata',
        rank: 'Phylum',
        occurrences: 65000,
        children: [
          {
            id: 'c-1',
            label: 'Mammalia',
            rank: 'Class',
            occurrences: 5500,
            hasSynonyms: true,
            children: [{ id: 'o-1', label: 'Carnivora', rank: 'Order', occurrences: 280 }],
          },
          {
            id: 'c-1',
            label: 'Somethingus',
            rank: 'Class',
            occurrences: 5500,
            children: [{ id: 'o-1', label: 'Carnivora', rank: 'Order', occurrences: 280 }],
          },
        ],
      },
      { id: 'p-2', label: 'Arthropoda', rank: 'Phylum', occurrences: 1100000 },
    ],
  },
  {
    id: 'k-2',
    label: 'Plantae',
    rank: 'Kingdom',
    occurrences: 390000,
    children: [
      { id: 'p-3', label: 'Angiosperms', rank: 'Phylum', occurrences: 300000 },
      { id: 'p-4', label: 'Bryophyta', rank: 'Phylum', occurrences: 20000 },
    ],
  },
  {
    id: 'k-3',
    label: 'Fungi',
    rank: 'Kingdom',
    occurrences: 144000,
    children: [
      { id: 'p-5', label: 'Ascomycota', rank: 'Phylum', occurrences: 64000 },
      { id: 'p-6', label: 'Basidiomycota', rank: 'Phylum', occurrences: 31000 },
    ],
  },
  {
    id: 'k-4',
    label: 'Protista',
    rank: 'Kingdom',
    occurrences: 200000,
    children: [],
  },
  {
    id: 'k-5',
    label: 'Chromista',
    rank: 'Kingdom',
    occurrences: 25000,
    children: [],
  },
  {
    id: 'k-6',
    label: 'Archaea',
    rank: 'Kingdom',
    occurrences: 500,
    children: [],
  },
  {
    id: 'k-7',
    label: 'Bacteria',
    rank: 'Kingdom',
    occurrences: 30000,
    children: [],
  },
  {
    id: 'k-8',
    label: 'Viruses', // Often treated as a separate kingdom-level group in bioinformatics
    rank: 'Kingdom',
    occurrences: 9000,
    children: [],
  },
];

export function TaxonTree() {
  return (
    <div className="g-p-8 g-bg-gray-50 g-min-h-screen">
      <h1 className="g-text-xl g-font-bold g-mb-4">Global Taxonomy Browser</h1>
      <Tree>
        {myTaxonomy.map((node) => (
          <TaxonomicNode key={node.id} data={node} />
        ))}
      </Tree>
    </div>
  );
  // return (
  //   <TaxonomicTree
  //     data={myTaxonomy}
  //     renderNode={({ node, toggle, hasChildren }) => (
  //       <div
  //         className="taxon-row-content"
  //         style={{ display: 'flex', justifyContent: 'space-between' }}
  //       >
  //         <div>
  //           <strong style={{ fontSize: '0.8em', color: '#666', marginRight: '8px' }}>
  //             {node.rank.toUpperCase()}
  //           </strong>
  //           <span>{node.label}</span>
  //         </div>

  //         <div className="action-buttons">
  //           {/* Action 1: External Link */}
  //           <button onClick={() => window.open(`/explore/${node.id}`)}>Explore</button>

  //           {/* Action 2: Show occurrences */}
  //           <button onClick={() => alert(`${node.occurrences} records found.`)}>
  //             {node.occurrences} Occurrences
  //           </button>

  //           {/* Action 3: Custom Toggle (optional extra trigger) */}
  //           {hasChildren && <button onClick={toggle}>{node.children?.length} Sub-taxa</button>}
  //         </div>
  //       </div>
  //     )}
  //   />
  // );
}

// export const TaxonomicNode = ({ data }: { data: TaxonData }) => {
//   const hasChildren = !!(data.children && data.children.length > 0);

//   return (
//     <TreeItem hasChildren={hasChildren}>
//       {/* The "Label" row */}
//       <TreeHeader>
//         <TreeToggle />
//         <div className="g-flex-1 g-flex g-items-center g-justify-between">
//           <div className="g-flex-1 g-flex g-items-start">
//             {/* <span className="g-font-bold g-text-gray-400 g-mr-2">{data.rank}</span> */}
//             <div>
//               {data.label}
//               {data.hasSynonyms && (
//                 <ul className="g-text-sm">
//                   <li><span className="g-text-red-600">=</span>synonym 1</li>
//                   <li><span className="g-text-red-600">=</span>synonym 2</li>
//                   <li><span className="g-text-red-600">=</span>synonym 3</li>
//                 </ul>
//               )}
//             </div>
//           </div>
//           <div className="g-flex g-gap-1">
//             <button className="g-text-[10px] g-bg-blue-50 g-px-2 g-py-0.5 g-rounded">
//               Explore
//             </button>
//             <button className="g-text-[10px] g-bg-gray-100 g-px-2 g-py-0.5 g-rounded">
//               {data.occurrences}
//             </button>
//           </div>
//         </div>
//       </TreeHeader>

//       {/* The "Sub-branch" list (nested inside the LI) */}
//       {hasChildren && (
//         <TreeGroup>
//           {data.children?.map((child) => (
//             <TaxonomicNode key={child.id} data={child} />
//           ))}
//         </TreeGroup>
//       )}
//     </TreeItem>
//   );
// };

export const TaxonomicNode = ({ data }: { data: any }) => {
  const hasChildren = !!(data.children && data.children.length > 0);

  return (
    <TreeItem hasChildren={hasChildren}>
      <TreeHeader
        label={data.label}
        count={data.occurrences}
        onSearch={() => console.log('Searching ID:', data.id)}
      />

      {hasChildren && (
        <TreeGroup>
          {data.children.map((child: any) => (
            <TaxonomicNode key={child.id} data={child} />
          ))}
        </TreeGroup>
      )}
    </TreeItem>
  );
};
