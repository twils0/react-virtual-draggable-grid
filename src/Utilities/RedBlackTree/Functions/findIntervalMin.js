/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';

// find max within interval
const findIntervalMin = (interval, node) => {
  let { min } = node.interval;

  if (interval) {
    while (node) {
      if (interval.contains(node.interval) && min > node.interval.min) {
        ({ min } = node.interval);
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

  return min;
};

export default findIntervalMin;
