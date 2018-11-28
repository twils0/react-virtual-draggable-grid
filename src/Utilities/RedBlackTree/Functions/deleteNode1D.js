/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';
import isRed from './isRed';
import moveRedLeft from './moveRedLeft';
import moveRedRight from './moveRedRight';
import rotateRedRight from './rotateRedRight';
import findMinNode from './findMinNode';
import deleteMinNode from './deleteMinNode';
import runMaintenance from './runMaintenance';

// helper function to delete node from RBT1D
const deleteNode1D = (interval, node) => {
  if (!interval || !node) {
    return null;
  }

  if (compareIntervalsEqual(interval, node) === -1) {
    if (!node.left || (!isRed(node.left) && !isRed(node.left.left))) {
      node = moveRedLeft(node);
    }

    node.left = deleteNode1D(interval, node.left);
  } else {
    if (isRed(node.left)) {
      node = rotateRedRight(node);
    }
    if (compareIntervalsEqual(interval, node) === 0 && !node.right) {
      return null;
    }
    if (!node.right || (!isRed(node.right) && !isRed(node.right.left))) {
      node = moveRedRight(node);
    }

    if (compareIntervalsEqual(interval, node) === 0) {
      const tempNode = findMinNode(node.right);

      node.interval = tempNode.interval;
      node.value = tempNode.value;

      node.right = deleteMinNode(node.right);
    } else {
      node.right = deleteNode1D(interval, node.right);
    }
  }

  node = runMaintenance(node);

  return node;
};

export default deleteNode1D;
