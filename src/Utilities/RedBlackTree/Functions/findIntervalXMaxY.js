/* eslint-disable no-param-reassign */

// get maxY of all intervals that intersect intervalX
const findIntervalXMaxY = (max, intervalX, node) => {
  if (!intervalX || !node) {
    return -1;
  }
  if (!max) {
    max = -1;
  }

  if (node.value.intervalsIntersect(intervalX) && max < node.interval.max) {
    ({ max } = node.interval);
  }

  if (node.left) {
    const leftMax = findIntervalXMaxY(max, intervalX, node.left);

    if (max < leftMax) {
      max = leftMax;
    }
  }
  if (node.right) {
    const rightMax = findIntervalXMaxY(max, intervalX, node.right);

    if (max < rightMax) {
      max = rightMax;
    }
  }

  return max;
};

export default findIntervalXMaxY;
