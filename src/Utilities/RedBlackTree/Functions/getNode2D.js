/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';

// return the node corresponding to
// the intervalX and intervalY provided
const getNode2D = (intervalX, intervalY, node) => {
  if (intervalX && intervalY) {
    while (node) {
      const comparison = compareIntervalsEqual(intervalY, node);

      if (comparison === 1) {
        node = node.right;
      } else if (comparison === -1) {
        node = node.left;
      } else {
        return node.value.getIntervalNode(intervalX);
      }
    }
  }

  return null;
};

export default getNode2D;
