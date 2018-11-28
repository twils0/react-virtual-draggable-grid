/* eslint-disable no-param-reassign */

import isRed from './isRed';
import getNodeSize from './getNodeSize';
import updateMaxEndpoint from './updateMaxEndpoint';

// helper function to rotate a red
// left branch to the right
const rotateRedRight = (node) => {
  if (!node || !isRed(node.left)) {
    return node;
  }

  const tempNode = node.left;

  node.left = tempNode.right;
  tempNode.right = node;

  tempNode.color = tempNode.right.color;
  tempNode.right.color = true;

  // update sizes
  node.size = getNodeSize(node);
  tempNode.size = getNodeSize(tempNode);

  // update max endpoints
  updateMaxEndpoint(node);
  updateMaxEndpoint(tempNode);

  return tempNode;
};

export default rotateRedRight;
