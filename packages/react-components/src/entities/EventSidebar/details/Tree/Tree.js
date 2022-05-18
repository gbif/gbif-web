import React, {Component, useContext} from 'react';
import styles from './styles';
import {Row} from "../../../../components";
import ThemeContext from "../../../../style/themes/ThemeContext";

class TreeNode {
  constructor(key, value = key, count, parent = null, ch) {
    this.key = key;
    this.value = value;
    this.count = count;
    this.parent = parent;
    this.children = [];
  }
}

export function TreeN({ treeNode }) {
  const hasChildren = treeNode.children.length > 0;
  return <li>
      <a href="#">{ treeNode.value }</a>
    { hasChildren ?
        (<ul>
          {treeNode.children.map(childNode => <TreeN treeNode={childNode}/>)}
        </ul>) : ''
    }
    </li>
}

export function Tree({
  data = {},
  loading,
  error,
  className,
  ...props
}) {

  const rootNode = new TreeNode("Dataset", "Dataset", null, []);

  data.map(branch => {

    let currentNode = rootNode;

    const verticies = branch.key.split('/').map(s => s.trim());
    const count = branch.count;

    verticies.map((vertex, idx) => {

      // does node exist already in children ?
      let node = null;

      currentNode.children.forEach((childNode, i) => {
        if (childNode.value === vertex){
          // already exists
          node = childNode;
          node.count = node.count + childNode.count;
        }
      });

      if (node == null){
        // create new node, add to parent
        node = new TreeNode(vertex, vertex, count, currentNode, []);
        currentNode.children.push(node);
      }

      currentNode = node;
    })
  });

  const theme = useContext(ThemeContext);

  return <Row>
    <div css={styles.tree({ theme })}>
        <ul>
          <TreeN treeNode={rootNode} />
        </ul>
    </div>
  </Row>

};
