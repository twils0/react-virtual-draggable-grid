/* eslint-disable no-param-reassign */

import isRed from './isRed';
import rotateRedRight from './rotateRedRight';
import rotateRedLeft from './rotateRedLeft';
import flipColors from './flipColors';

// helper function to balance the red-black tree
// and to maintain the correct size and maxEndpoint
const redBlackBalance = (node) => {
  if (node) {
    if (isRed(node.right)) {
      node = rotateRedLeft(node);
    }
    if (node.left && isRed(node.left) && isRed(node.left.left)) {
      node = rotateRedRight(node);
    }
    if (isRed(node.right) && isRed(node.left)) {
      flipColors(node);
    }
  }

  return node;
};

export default redBlackBalance;
