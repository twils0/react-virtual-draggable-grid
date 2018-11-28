/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';

// get maxX of all intervals that intersect intervalY
// return max and grid item key
const findIntervalYMaxX = (intervalY, node) => {
  if (!intervalY || !node) {
    return -1;
  }

  let max = -1;

  while (node) {
    if (intervalY.intersects(node.interval) && max < node.value.max) {
      ({ max } = node.value);
    }

    const comparison = compareIntervalsEqual(intervalY, node);

    if (comparison === 1) {
      node = node.right;
    } else if (comparison === -1) {
      node = node.left;
    } else {
      break;
    }
  }

  return max;
};

export default findIntervalYMaxX;
