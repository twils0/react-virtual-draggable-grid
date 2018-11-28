/* eslint-disable no-param-reassign */

import compareIntervalsIntersect from './compareIntervalsIntersect';

// find max within interval
const intervalsIntersect = (interval, node) => {
  if (interval) {
    while (node) {
      const comparison = compareIntervalsIntersect(interval, node);

      if (comparison === 1) {
        node = node.right;
      } else if (comparison === -1) {
        node = node.left;
      } else {
        return true;
      }
    }
  }

  return false;
};

export default intervalsIntersect;
