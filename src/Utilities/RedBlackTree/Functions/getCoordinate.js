/* eslint-disable no-param-reassign */

import Interval1D from '../Interval1D';

// return the interval and value of the node
// containing, or the node closest to,
// the coordinate provided
const getCoordinate = (coord, node) => {
  if (coord) {
    while (node) {
      const comparison = node.interval.compareCoordinate(coord);

      console.log(comparison, node);

      if (comparison === 1 && node.right) {
        node = node.right;
      } else if (comparison === -1 && node.left) {
        node = node.left;
      } else {
        console.log('return node', { interval: node.interval, value: node.value });

        return { interval: node.interval, value: node.value };
      }
    }
  }

  return { interval: node ? node.interval : new Interval1D(-1, -1), value: null };
};

export default getCoordinate;
