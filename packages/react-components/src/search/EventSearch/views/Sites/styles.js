import { css } from '@emotion/react';

export const sites = ({ noOfSites= 10, noOfYears, showMonth, theme, ...props }) => css`

    .graph {
      background-color: white;   
      --square-size: ${showMonth ? '15px;' : '15px'}; ;
      --square-width: ${showMonth ? '5px;' : '  3px'};
      --square-height: 15px;
      --square-gap-width: ${showMonth ? '3px' : '0px'};
      --square-gap-height: 3px;
      --month-width: calc(var(--square-width) + var(--square-gap-width));
      --year-width: calc(var(--month-width) * 12)
    }

    .time { grid-area: months; list-style-type: none; padding-left:10px;}
    .sites { grid-area: days; list-style-type: none; list-style-position: outside; }
    .squares { grid-area: squares; list-style-type: none;}
    
    .sites li {
       white-space:nowrap;
    }
    
    .sites li:hover {
       cursor:pointer;
    }    
    
    .sites {
       padding-inline-start: 20px;
       display:inline-block;
    }    
        
    .graph {
      display: inline-grid;
      grid-template-areas: "empty months"
                           "days squares";
      grid-template-columns: auto 1fr;
      grid-gap: 0px;
      padding: 0px;
    }
    
    .time {
      margin-bottom: 5px;
      display: grid;
      grid-template-columns: repeat(${noOfYears}, var(--year-width));
    }
    
    .sites,
    .squares {
      margin-top: 2px; 
      display: grid;
      grid-gap: var(--square-gap-height) var(--square-gap-width);
      grid-template-rows: repeat(${noOfSites}, var(--square-size));
    }
    
    .squares {
      padding-left:10px;
      grid-auto-flow: column;
      grid-auto-columns: var(--square-width);
    }
    
    .squares li {
      background-color: #ebedf0;
    }
    
    .squares li[data-level="1"] {
      background-color: #c6e48b;
    }
    
    .squares li[data-level="2"] {
      background-color: #7bc96f;
    }
    
    .squares li[data-level="3"] {
      background-color: #196127;
    }
    
    .squares li  {
      position: relative;
      display: inline-block;
    }
    
    .squares li  .tooltiptext {
      visibility: hidden;
      filter: alpha(opacity=50);
      opacity: 0.5;
      width: 90px;
      background-color:  #196127;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;
      position: absolute;
      z-index: 1;
      margin-top: -28px;
    }
    
    .squares li:hover .tooltiptext {
      visibility: visible;
    }    
    
`;

export default {
    sites
}