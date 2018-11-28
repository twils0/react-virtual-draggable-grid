/* eslint-disable no-param-reassign */

const findMaxX = (max, node) => {
  if (!node) {
    return -1;
  }
  if (!max) {
    max = -1;
  }

  if (node.value.max > max) {
    ({ max } = node.value);
  }

  if (node.left) {
    const leftMax = findMaxX(max, node.left);

    if (leftMax > max) {
      max = leftMax;
    }
  }
  if (node.right) {
    const rightMax = findMaxX(max, node.right);

    if (rightMax > max) {
      max = rightMax;
    }
  }

  return max;
};

export default findMaxX;
