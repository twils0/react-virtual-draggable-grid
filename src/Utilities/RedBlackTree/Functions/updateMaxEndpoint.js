/* eslint-disable no-param-reassign */

// update maxEndpoint interval for node
const updateMaxEndpoint = (node) => {
  if (node) {
    if (node.right) {
      const { maxEndpoint } = node.right.interval;

      if (maxEndpoint > node.interval.max) {
        node.interval.maxEndpoint = maxEndpoint;
        return;
      }
    }
    if (node.interval.maxEndpoint !== node.interval.max) {
      node.interval.maxEndpoint = node.interval.max;
    }
  }
};

export default updateMaxEndpoint;
