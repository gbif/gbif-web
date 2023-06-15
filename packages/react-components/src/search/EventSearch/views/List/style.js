import { css } from '@emotion/react';
import {Button} from "../../../../components";
import React from "react";

export const datasetList = ({theme, ...props}) => css`
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    margin-bottom: 12px;
    max-width: 100%;
  }
`;

export const datasetSkeleton = ({theme, ...props}) => css`
  padding: 24px;
  background: white;
  border: 1px solid #eee;
  margin-bottom: 12px;
  h2 {
    color: none;
    line-height: 1;
    width: 300px;
    background: #888;
  }
  p {
    width: 200px;
    background: #888;
  }
`;

export const details = ({theme, ...props}) => css`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 1000px) {
    div {
      flex-basis: 100%; 
      padding-left: 0px;  
      margin-top: 10px;
      border-right: 0px;
    }
  }  
`;

export const details_col1 = ({theme, ...props}) => css`
   flex: 1 30%;
   box-sizing: border-box; 
   padding-right: 10px;
   border-right: 2px solid  #E6E6E6;
   margin-bottom: 0.4em;
   width: 100%;
   > div {
    font-size: 18px; 
    display: block;
    margin-bottom: 0.4em;
    > svg {
      vertical-align: bottom;
      margin-bottom: 2px;
    }
    > span {
      margin-left: 5px;
      font-weight: 500;
    }
  }  
`;

export const details_col2 = ({theme, ...props}) => css`
    flex: 1 40%;
    padding-left: 25px;    
    box-sizing: border-box;
    padding-right: 10px;
    border-right: 2px solid  #E6E6E6;
    margin-bottom: 0.4em;
`;

export const details_col3 = ({theme, ...props}) => css`
    flex: 1 30%;
    box-sizing: border-box;
    padding-right: 0;
    padding-left: 25px;
    margin-bottom: 0.4em;
`;

export const details_map = ({theme, ...props}) => css`
    @media (max-width: 1000px) {
      float: none;
    } 
    @media (max-width: 1400px) {
      > img {
         width:250px;   
      }
    }        
`;

export const filter_by = ({theme, ...props}) => css`
    margin-top: 20px;
    font-size: 14px;
    @media (max-width: 1400px) {
            
    }        
`;

export const discreet_link = ({theme, ...props}) => css`
  text-decoration: none;
  color: var(--linkColor);
  :hover {
    text-decoration: underline;
  }
`;

export const summary = ({theme, ...props}) => css`
  padding: 24px;
  background: white;
  border: 1px solid #eee;
  h2 {
    margin-top: 0;
    font-size: 1.2rem;
  }
`;

export const events = ({theme, ...props}) => css`
  background: #f8f8f8;
  padding: 12px 24px;
  margin: 0 4px 0 4px;
  border: 1px solid #eee;
  border-top-width: 0;
  border-radius: 0 0 4px 4px;
  /* max-height: 150px;
  overflow: auto; */
`;

export const tabularListItem = ({theme, ...props}) => css`
  display: flex;
  padding: 6px 24px;
  color: #888;
  > div {
    width: 25%;
    line-break: anywhere;
    margin-right: 8px;
  }
`;

export const eventList = ({theme, ...props}) => css`
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    margin-bottom: 8px;
    > div {
      ${tabularListItem({})}
      color: #333;
      background: white;
      border: 1px solid #eee;
      padding: 12px 24px;
    }
  }
`;