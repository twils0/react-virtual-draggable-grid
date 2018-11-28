/* eslint-disable no-param-reassign */

// shift all Y node keys for node provided an all sub-nodes;
// shift X node keys within intervalX
const shiftKeys2D = (intervalX, shiftX, shiftY, node) => {
  if (node && shiftY) {
    if (shiftX && intervalX) {
      node.value.shiftKeys(intervalX, shiftX);
    }

    if (node.right) {
      shiftKeys2D(intervalX, shiftX, shiftY, node.right);
    }
    if (node.left) {
      shiftKeys2D(intervalX, shiftX, shiftY, node.left);
    }
  }
};

export default shiftKeys2D;
