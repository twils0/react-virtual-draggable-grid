/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';
import isRed from './isRed';
import moveRedLeft from './moveRedLeft';
import moveRedRight from './moveRedRight';
import rotateRedRight from './rotateRedRight';
import findMinNode from './findMinNode';
import deleteMinNode from './deleteMinNode';
import runMaintenance from './runMaintenance';

// helper function to delete node from RBT2D
const deleteNode2D = (intervalX, intervalY, node) => {
  if (!intervalX || !intervalY || !node || node.value.isEmpty) {
    return null;
  }

  // TO DO: check if node is actually going to be
  // deleted (node.value.size === 1) before moving things around;
  // is the tree being thrown off balance, if not?
  if (compareIntervalsEqual(intervalY, node) === -1) {
    if (!node.left || (!isRed(node.left) && !isRed(node.left.left))) {
      node = moveRedLeft(node);
    }

    node.left = deleteNode2D(intervalX, intervalY, node.left);
  } else {
    if (isRed(node.left)) {
      node = rotateRedRight(node);
    }
    if (compareIntervalsEqual(intervalY, node) === 0 && !node.right) {
      node.value.delete(intervalX);

      if (node.value.isEmpty) {
        return null;
      }
    } else {
      if (!node.right || (!isRed(node.right) && !isRed(node.right.left))) {
        node = moveRedRight(node);
      }
      if (compareIntervalsEqual(intervalY, node) === 0) {
        node.value.delete(intervalX);

        if (node.value.isEmpty) {
          const tempNode = findMinNode(node.right);

          node.interval = tempNode.interval;
          node.value = tempNode.value;

          node.right = deleteMinNode(node.right);
        }
      } else {
        node.right = deleteNode2D(intervalX, intervalY, node.right);
      }
    }
  }

  node = runMaintenance(node);

  return node;
};

export default deleteNode2D;
