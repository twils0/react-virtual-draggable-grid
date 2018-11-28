/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';

// get an array of values for all nodes contained within
// X and Y intervals provided
const getValuesArray2D = (intervalX, intervalY, node) => {
  let arr = [];

  if (intervalX && intervalY) {
    while (node) {
      if (intervalY.intersects(node.interval)) {
        arr = arr.concat(node.value.getIntervalNodeValues(intervalX));
      }

      const comparison = compareIntervalsEqual(intervalY, node);

      if (comparison === 1) {
        if (node.left && intervalY.intersects(node.left.interval)) {
          arr = arr.concat(getValuesArray2D(intervalX, intervalY, node.left));
        }

        node = node.right;
      } else if (comparison === -1) {
        if (node.right && intervalY.intersects(node.right.interval)) {
          arr = arr.concat(getValuesArray2D(intervalX, intervalY, node.right));
        }

        node = node.left;
      } else {
        break;
      }
    }
  }

  return arr;
};

export default getValuesArray2D;
