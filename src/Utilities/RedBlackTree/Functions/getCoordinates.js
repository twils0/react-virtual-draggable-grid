/* eslint-disable no-param-reassign */

import Interval1D from '../Interval1D';

// return the node containing, or the node closests to,
// the coordinate provided
const getCoordinates = (x, y, node) => {
  if (x && y) {
    while (node) {
      const comparison = node.interval.compareCoordinate(y);

      if (comparison === 1) {
        node = node.right;
      } else if (comparison === -1) {
        node = node.left;
      } else {
        break;
      }
    }

    if (node) {
      const { interval, value } = node.value.getCoordinate(x);

      return {
        intervalX: interval,
        intervalY: node.interval,
        value,
      };
    }
  }

  return {
    intervalX: new Interval1D(-1, -1),
    intervalY: new Interval1D(-1, -1),
    value: null,
  };
};

export default getCoordinates;
