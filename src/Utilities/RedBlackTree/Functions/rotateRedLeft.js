/* eslint-disable no-param-reassign */

import isRed from './isRed';
import getNodeSize from './getNodeSize';
import updateMaxEndpoint from './updateMaxEndpoint';

// helper function to rotate a red
// right branch to the left
const rotateRedLeft = (node) => {
  if (!node || !isRed(node.right)) {
    return node;
  }

  const tempNode = node.right;

  node.right = tempNode.left;
  tempNode.left = node;

  tempNode.color = tempNode.left.color;
  tempNode.left.color = true;

  // update sizes
  node.size = getNodeSize(node);
  tempNode.size = getNodeSize(tempNode);

  // update max endpoints
  updateMaxEndpoint(node);
  updateMaxEndpoint(tempNode);

  return tempNode;
};

export default rotateRedLeft;
