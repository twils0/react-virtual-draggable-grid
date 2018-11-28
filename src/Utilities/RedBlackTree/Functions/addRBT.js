/* eslint-disable no-param-reassign */

import Node from '../Interval1DNode';
import RBT1D from '../RedBlackTree1D';
import compareIntervalsEqual from './compareIntervalsEqual';
import runMaintenance from './runMaintenance';

// helper function to add node to RBT
const addRBT = (intervalX, intervalY, value, node) => {
  if (!intervalX || !intervalY || !value) {
    return null;
  }
  if (!node) {
    const newRBT1D = new RBT1D();
    const newNodeY = new Node(intervalY, newRBT1D);

    newNodeY.value.add(intervalX, value);

    return newNodeY;
  }

  const comparisonY = compareIntervalsEqual(intervalY, node);

  if (comparisonY === 1) {
    node.right = addRBT(intervalX, intervalY, value, node.right);
  } else if (comparisonY === -1) {
    node.left = addRBT(intervalX, intervalY, value, node.left);
  } else {
    node.value.add(intervalX, value);
  }

  node = runMaintenance(node);

  return node;
};

export default addRBT;
