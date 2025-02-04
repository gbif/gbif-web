const styles = `
.gbif-phylotree-tree-selection-brush .extent {
    fill-opacity: .05;
    stroke: #fff;
    shape-rendering: crispEdges;
}

.gbif-phylotree-tree-scale-bar text {
  font: sans-serif;
}

.gbif-phylotree-tree-scale-bar line,
.gbif-phylotree-tree-scale-bar path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.gbif-phylotree-node circle, .gbif-phylotree-node ellipse, .gbif-phylotree-node rect {
fill: steelblue;
stroke: black;
stroke-width: 0.5px;
}

.gbif-phylotree-internal-node circle, .gbif-phylotree-internal-node ellipse, .gbif-phylotree-internal-node rect{
fill: #CCC;
stroke: black;
stroke-width: 0.5px;
}

.gbif-phylotree-node {
font: 10px sans-serif;
}

.gbif-phylotree-node-selected {
fill: #f00 !important;     
}

.gbif-phylotree-node-collapsed circle, .gbif-phylotree-node-collapsed ellipse, .gbif-phylotree-node-collapsed rect{
fill: black !important;     
}

.gbif-phylotree-node-tagged {
fill: #00f; 
}

.gbif-phylotree-branch {
fill: none;
stroke: #999;
stroke-width: 2px;
}

.gbif-phylotree-clade {
fill: lightgrey;
stroke: #222;
stroke-width: 2px;
opacity: 0.5;
}

.gbif-phylotree-branch-selected {
stroke: #f00 !important; 
stroke-width: 3px;
}

.gbif-phylotree-branch-tagged {
stroke: #00f;
stroke-dasharray: 10,5;
stroke-width: 2px;
}

.gbif-phylotree-branch-tracer {
stroke: #bbb;
stroke-dasharray: 3,4;
stroke-width: 1px;
}


.branch-multiple {
stroke-dasharray: 5, 5, 1, 5;
stroke-width: 3px;
}

.gbif-phylotree-branch:hover {
stroke-width: 10px;
}

.gbif-phylotree-internal-node circle:hover, .gbif-phylotree-internal-node ellipse:hover, .gbif-phylotree-internal-node rect:hover {
fill: black;
stroke: #CCC;
}

.tree-widget {
}

.tree-selection-brush .extent {
    fill-opacity: .05;
    stroke: #fff;
    shape-rendering: crispEdges;
}

.tree-scale-bar text {
  font: sans-serif;
}

.tree-scale-bar line,
.tree-scale-bar path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.node circle, .node ellipse, .node rect {
fill: steelblue;
stroke: black;
stroke-width: 0.5px;
}

.internal-node circle, .internal-node ellipse, .internal-node rect{
fill: #CCC;
stroke: black;
stroke-width: 0.5px;
}

.node {
font: 10px sans-serif;
}

.node-selected {
fill: #f00 !important;     
}

.node-collapsed circle, .node-collapsed ellipse, .node-collapsed rect{
fill: black !important;     
}

.node-tagged {
fill: #00f; 
}

/* .branch {
fill: none;
stroke: #999;
stroke-width: 2px;
} */

.clade {
fill: lightgrey;
stroke: #222;
stroke-width: 2px;
opacity: 0.5;
}

.branch-selected {
stroke: #f00 !important; 
stroke-width: 3px;
}

.branch-tagged {
stroke: #00f;
stroke-dasharray: 10,5;
stroke-width: 2px;
}

.branch-tracer {
stroke: #bbb;
stroke-dasharray: 3,4;
stroke-width: 1px;
}


.branch-multiple {
stroke-dasharray: 5, 5, 1, 5;
stroke-width: 3px;
}

.branch:hover {
stroke-width: 10px;
}

.internal-node circle:hover, .internal-node ellipse:hover, .internal-node rect:hover {
fill: black;
stroke: #CCC;
}
`;
export default styles;
