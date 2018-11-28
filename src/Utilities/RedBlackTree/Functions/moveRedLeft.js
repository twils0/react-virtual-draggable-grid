/* eslint-disable no-param-reassign */

import flipColors from './flipColors';
import isRed from './isRed';
import rotateRedRight from './rotateRedRight';
import rotateRedLeft from './rotateRedLeft';

// helper function for delete method
const moveRedLeft = (node) => {
  if (node && isRed(node) && (!node.left || !isRed(node.left && !isRed(node.left.left)))) {
    flipColors(node);

    if (node.right && isRed(node.right.left)) {
      node.right = rotateRedRight(node.right);
      node = rotateRedLeft(node);
      flipColors(node);
    }
  }

  return node;
};

export default moveRedLeft;
