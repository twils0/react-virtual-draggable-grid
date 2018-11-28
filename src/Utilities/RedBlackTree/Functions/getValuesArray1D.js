/* eslint-disable no-param-reassign */

import compareIntervalsEqual from './compareIntervalsEqual';

// get an array of values for all nodes contained within
// X and Y intervals provided
const getValuesArray1D = (interval, node) => {
  let arr = [];

  if (interval) {
    while (node) {
      if (interval.intersects(node.interval)) {
        arr.push(node.value);
      }

      const comparison = compareIntervalsEqual(interval, node);

      if (comparison === 1) {
        if (node.left && interval.intersects(node.left.interval)) {
          arr = arr.concat(getValuesArray1D(interval, node.left));
        }

        node = node.right;
      } else if (comparison === -1) {
        if (node.right && interval.intersects(node.right.interval)) {
          arr = arr.concat(getValuesArray1D(interval, node.right));
        }

        node = node.left;
      } else {
        break;
      }
    }
  }

  return arr;
};

export default getValuesArray1D;
