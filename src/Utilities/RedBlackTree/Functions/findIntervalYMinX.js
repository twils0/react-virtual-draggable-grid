/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';

// get minX of all intervals that intersect intervalY
// return min and grid item key
const findIntervalYMinX = (intervalY, node) => {
  if (!intervalY || !node) {
    return -1;
  }

  let min = -1;

  while (node) {
    if (intervalY.intersects(node.interval) && (min === -1 || min > node.value.min)) {
      ({ min } = node.value);
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

  return min;
};

export default findIntervalYMinX;
