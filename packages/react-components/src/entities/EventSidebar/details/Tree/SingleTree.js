import React, {Component, useContext} from 'react';
import styles from './styles';
import {Row} from "../../../../components";
import ThemeContext from "../../../../style/themes/ThemeContext";

export function SingleTreeN({ hierarchy }) {

  let node = hierarchy.shift();
  if (!node){
    return null;
  }

  const keyValueSame = node.key == node.name ;

  return <ul>
    <li>
      <span className={ node.isSelected ? 'selected' : ''}>
        { node.name }
        <br/>
        {!keyValueSame &&
            <small>ID: {node.key}</small>
        }
        {keyValueSame &&
            <small>{node.count.toLocaleString()} {node.key.toLowerCase()}</small>
        }
      </span>
      <SingleTreeN hierarchy={ hierarchy }/>
    </li>
  </ul>;
}

export function SingleTree({
  hierarchy = [],
  ...props
}) {
  const theme = useContext(ThemeContext);
  return <Row>
    <div css={styles.tree({ theme })}>
      { hierarchy.map(node => <SingleTreeN hierarchy={hierarchy}/>) }
    </div>
  </Row>

};
