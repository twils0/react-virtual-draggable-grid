/* eslint-disable no-param-reassign */

import Node from '../Interval1DNode';
import compareIntervalsEqual from './compareIntervalsEqual';
import runMaintenance from './runMaintenance';

// helper function to add node to RBT
const addNode = (interval, value, node) => {
  if (!interval || !value) {
    return null;
  }
  if (!node) {
    const newNodeX = new Node(interval, value);

    return newNodeX;
  }

  const comparisonX = compareIntervalsEqual(interval, node);

  if (comparisonX === 1) {
    node.right = addNode(interval, value, node.right);
  } else if (comparisonX === -1) {
    node.left = addNode(interval, value, node.left);
  } else {
    node.value = value;
  }

  node = runMaintenance(node);

  return node;
};

export default addNode;
