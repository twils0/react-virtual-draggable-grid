/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';

// return the node corresponding to the interval provided
const getNode1D = (interval, node) => {
  if (interval) {
    while (node) {
      const comparison = compareIntervalsEqual(interval, node);

      if (comparison === 1) {
        node = node.right;
      } else if (comparison === -1) {
        node = node.left;
      } else {
        return node;
      }
    }
  }

  return null;
};

export default getNode1D;
