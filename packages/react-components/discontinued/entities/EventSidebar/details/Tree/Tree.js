import React, {Component, useContext} from 'react';
import styles from './styles';
import {Row} from "../../../../components";
import ThemeContext from "../../../../style/themes/ThemeContext";

class TreeNode {
  constructor(key, value, count, isSelected, parent) {
    this.key = key;
    this.value = value;
    this.count = count;
    this.isSelected = isSelected
    this.parent = parent;
    this.children = [];
  }
}

export function TreeN({ treeNode }) {
  const hasChildren = treeNode.children.length > 0;
  return <li>
      <span className={ treeNode.isSelected ? 'selected' : ''}>{ treeNode.value }</span>
    { hasChildren &&
        <ul>
          {treeNode.children.map(childNode => <TreeN key={childNode.key} treeNode={childNode} />)}
        </ul>
    }
    </li>
}

export function Tree({
  data = {},
  selected,
  loading,
  error,
  className,
  highlightRootNode = false,
  ...props
}) {

  const rootNode = new TreeNode("Dataset", "Dataset", null, highlightRootNode, null);

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
        let isSelected = vertex == selected;
        node = new TreeNode(vertex, vertex, count, isSelected, currentNode);
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
