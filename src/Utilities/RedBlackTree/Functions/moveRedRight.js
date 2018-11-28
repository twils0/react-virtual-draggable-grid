/* eslint-disable no-param-reassign */

import flipColors from './flipColors';
import isRed from './isRed';
import rotateRedRight from './rotateRedRight';

// helper function for delete method
const moveRedRight = (node) => {
  if (node && isRed(node) && (!node.right || !isRed(node.right && !isRed(node.right.left)))) {
    flipColors(node);

    if (node.left && isRed(node.left.left)) {
      node = rotateRedRight(node);
      flipColors(node);
    }
  }

  return node;
};

export default moveRedRight;
