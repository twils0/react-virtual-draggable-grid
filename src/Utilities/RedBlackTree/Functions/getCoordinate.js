/* eslint-disable no-param-reassign */

import Interval1D from '../Interval1D';

// return the interval and value of the node
// containing, or the node closest to,
// the coordinate provided
const getCoordinate = (coord, node) => {
  if (coord) {
    while (node) {
      const comparison = node.interval.compareCoordinate(coord);

      if (comparison === 1) {
        node = node.right;
      } else if (comparison === -1) {
        node = node.left;
      } else {
        return { interval: node.interval, value: node.value };
      }
    }
  }

  return { interval: node ? node.interval : new Interval1D(-1, -1), value: null };
};

export default getCoordinate;
