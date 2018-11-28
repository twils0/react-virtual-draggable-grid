/* eslint-disable no-param-reassign */

import isRed from './isRed';
import moveRedLeft from './moveRedLeft';
import runMaintenance from './runMaintenance';

// helper function to delete min node in RBT
const deleteMinNode = (node) => {
  if (!node || !node.left) {
    return null;
  }

  if (!isRed(node.left) && !isRed(node.left.left)) {
    node = moveRedLeft(node);
  }

  node.left = deleteMinNode(node.left);

  node = runMaintenance(node);

  return node;
};

export default deleteMinNode;
