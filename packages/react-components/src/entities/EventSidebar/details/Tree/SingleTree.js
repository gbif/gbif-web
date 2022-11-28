import React, {Component, useContext} from 'react';
import styles from './styles';
import {Row} from "../../../../components";
import ThemeContext from "../../../../style/themes/ThemeContext";

export function SingleTreeN({ node, setViewEvent, setSearch }) {

  if (!node){
    return null;
  }

  const keyValueSame = node.key == node.name ;
  const hasChildren = node.children && node.children.length > 0;

  function onClickNode(){
    if (!node.isSelected && node.isClickable ) {
      if (keyValueSame) {
        setSearch(node.key);
      } else {
        setViewEvent(node.key);
      }
    }
  }

  let className = ''
  if (node.isSelected){
    className = 'selected';
  } else if (node.isClickable){
    className = 'clickable';
  }

  return <li>
      <span className={ className } onClick={onClickNode}>
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
        {node.children.map((child) => (
          <SingleTreeN
            key={child.key}
            node={child}
            setViewEvent={setViewEvent}
            setSearch={setSearch}
          />
        ))}
      </ul>}
    </li>;
}

function abbrev(nodeStr){
  if (nodeStr.length < 30){
    return nodeStr;
  }
  return nodeStr.substring(30) + "...";
}

export function SingleTree({ rootNode, setViewEvent, setSearch }) {
  const theme = useContext(ThemeContext);
  return <Row>
    <div css={styles.tree({ theme })}>
      <ul>
       <SingleTreeN node={rootNode} setViewEvent={setViewEvent} setSearch={setSearch} />
      </ul>
    </div>
  </Row>
};
