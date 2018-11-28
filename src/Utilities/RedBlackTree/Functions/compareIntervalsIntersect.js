// compare interval and the interval of node;
// return 0, if intervals are intersect
const compareIntervalsIntersect = (interval, node) => {
  if (interval.intersects(node.interval)) {
    return 0;
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

export default compareIntervalsIntersect;
