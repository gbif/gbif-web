import { css } from '@emotion/react';

export const sites = ({ noOfSites=10, noOfYears=10, showMonth, theme, ...props }) => css`

.grid-container {
  padding: 0;
  margin: 0;
}

.grid {
  display: inline-grid;
  grid-template-areas: "legend header"
    "sidebar main-grid";
  grid-template-columns: 150px auto;
  grid-column-gap: 0px;
}

.header {
  grid-area: header;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 5;    
  align-self: start;
  background-color: #FFF;  
  padding-bottom: 5px; 
}

.header ul {
  list-style-type: none; 
}

.header li {
  display: inline-block;
}

.sidebar {
  grid-area: sidebar;
  list-style-type: none; 
  list-style-position: outside;  
  display: inline-block;  
  position: sticky;
  left: 0;
  top: 0;
  z-index: 2;  
  background-color: #FFF;
  padding-left: 5px;
  align-self: start;
}

.legend {
  grid-area: legend;
  padding: 15px 5px 5px 10px; 
  position: sticky;
  top: 0;
  left: 0;
  z-index: 6;
  background-color: #FFF;
  align-self: start;
}

.main-grid {
  grid-area: main-grid;
}

.header-grid {
  display: grid;
  grid-template-columns: repeat(${noOfYears}, ${showMonth ? '150px': '16px'} );
  grid-column-gap: 0px;
  padding: 15px 5px 5px 5px;
}

.header-grid ul {
  list-style-type: none; 
  margin: 0;
  padding: 0;
}

.header-grid li {
  display: inline-block;
  -webkit-transform: rotate(${showMonth ? '0deg' :  '-60deg'}); 
  -moz-transform: rotate(${showMonth ? '0deg' :  '-60deg'});   
}

.sidebar-grid {
  display: grid;
  grid-template-columns: repeat(1, 150px);
  grid-column-gap: 0px;
  padding: 5px;
}

.sidebar-grid ul {
  list-style-type: none; 
  margin: 0;
  padding: 0 0 3px 0;
  line-height: 18px;
}

.sidebar-grid li {
  display: inline-block;

}

.sidebar-grid li:hover { cursor: pointer; }

.data-grid {
  display: grid;
  grid-template-columns: repeat(${noOfYears}, ${showMonth ? '150px': '16px'});
  grid-column-gap: 0;
  padding: 5px;
  grid-auto-columns: 3px;  
}

.year-grid {
  --square-width: 3px;
  --square-height: 18px;
  --square-gap-width: 3px;
  --square-gap-height: 5px; 
  display: grid;
  grid-template-columns: repeat(12, ${showMonth ? '9px': '14px'});
  padding: 0 0 3px 0;
  list-style-type: none;
  margin: 0;
  grid-gap: var(--square-gap-height) var(--square-gap-width);
  grid-template-rows: repeat(1, var(--square-height));
}

.year-grid li {
  background-color: #ebedf0;
  display: inline-block;
  position: relative;
  border: 1px solid #A9A9A9;  
}

.year-grid li[data-level="1"] {
  background-color: ${theme.primary};
  cursor: pointer;
}

.year-grid li[data-level="2"] {
  background-color: ${theme.primary};
  cursor: pointer;
}

.year-grid li[data-level="3"] {
  background-color: ${theme.primary};
  cursor: pointer;
}

.year-grid li .tooltiptext {
  visibility: hidden;
  filter: alpha(opacity=80);
  opacity: 0.8;
  width: 90px;
  background-color: ${theme.primary};
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  margin-top: -48px;
}

.year-grid li:hover .tooltiptext {
  visibility: visible;
} 

`;

export default {
    sites
}