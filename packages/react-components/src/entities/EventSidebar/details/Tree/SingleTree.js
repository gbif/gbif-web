import React, {Component, useContext} from 'react';
import styles from './styles';
import {Row} from "../../../../components";
import ThemeContext from "../../../../style/themes/ThemeContext";

export function SingleTreeN({ node }) {

  if (!node){
    return null;
  }

  const keyValueSame = node.key == node.name ;
  const hasChildren = node.children && node.children.length > 0;

  return <li>
      <span className={ node.isSelected ? 'selected' : ''}>
        { node.name }
        <br/>
        {!keyValueSame &&
            <small>ID: {abbrev(node.key)}</small>
        }
        {keyValueSame &&
            <small>{node.count.toLocaleString()} {node.key.toLowerCase()}</small>
        }
      </span>
    {hasChildren &&
      <ul>
        {node.children.map(child => <SingleTreeN node={ child }/>)}
      </ul>}
    </li>;
}

function abbrev(nodeStr){
  if (nodeStr.length < 30){
    return nodeStr;
  }
  return nodeStr.substring(30) + "...";
}

export function SingleTree({ rootNode }) {
  const theme = useContext(ThemeContext);
  return <Row>
    <div css={styles.tree({ theme })}>
      <ul>
       <SingleTreeN node={rootNode}/>
      </ul>
    </div>
  </Row>
};
