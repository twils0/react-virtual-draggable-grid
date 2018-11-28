// compare interval and the interval of node;
// return 0, if intervals are equal
const compareIntervalsEqual = (interval, node) => {
  if (interval.equals(node.interval)) {
    return 0;
  }

  if (interval.intersects(node.interval)) {
    return interval.compareMax(node.interval);
  }

  // if no left node, return 1 (go right)
  if (!node.left) {
    return 1;
  }

  // if the min of interval is greater than the maxEndpoint
  // of the left node, return 1 (go right)
  if (node.left.interval.maxEndpoint <= interval.min) {
    return 1;
  }

  return -1;
};

export default compareIntervalsEqual;
