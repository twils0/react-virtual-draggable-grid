/* eslint-disable no-param-reassign */

const findMinX = (min, node) => {
  if (!node) {
    return -1;
  }
  if (!min || min === -1) {
    ({ min } = node.value);
  }

  if (node.value.min < min) {
    ({ min } = node.value);
  }

  if (node.left) {
    const leftMin = findMinX(min, node.left);

    if (leftMin < min) {
      min = leftMin;
    }
  }
  if (node.right) {
    const rightMin = findMinX(min, node.right);

    if (rightMin < min) {
      min = rightMin;
    }
  }

  return min;
};

export default findMinX;
