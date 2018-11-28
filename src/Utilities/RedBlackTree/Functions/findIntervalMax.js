/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';

// find max within interval; return max and key
const findIntervalMax = (interval, node) => {
  let max = -1;

  if (interval) {
    while (node) {
      if (interval.contains(node.interval) && max < node.interval.max) {
        ({ max } = node.interval);
      }

      const comparison = compareIntervalsEqual(interval, node);

      if (comparison === 1) {
        node = node.right;
      } else if (comparison === -1) {
        node = node.left;
      } else {
        break;
      }
    }
  }

  return max;
};

export default findIntervalMax;
