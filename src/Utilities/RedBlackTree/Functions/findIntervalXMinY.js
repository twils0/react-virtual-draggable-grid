/* eslint-disable no-param-reassign */

// get minY of all intervals that intersect intervalX
const findIntervalXMinY = (min, intervalX, node) => {
  if (!intervalX || !node) {
    return -1;
  }
  if (!min) {
    min = -1;
  }

  if (node.value.intervalsIntersect(intervalX) && (min === -1 || min < node.interval.min)) {
    ({ min } = node.interval);
  }

  if (node.left) {
    const leftMin = findIntervalXMinY(min, intervalX, node.left);

    if (min < leftMin) {
      min = leftMin;
    }
  }
  if (node.right) {
    const rightMin = findIntervalXMinY(min, intervalX, node.right);

    if (min < rightMin) {
      min = rightMin;
    }
  }

  return min;
};

export default findIntervalXMinY;
