/* eslint-disable no-param-reassign */

const shiftKeys1D = (shift, node) => {
  if (node && shift) {
    node.interval.min += shift;
    node.interval.max += shift;

    if (node.right) {
      shiftKeys1D(shift, node.right);
    }
  }
};

export default shiftKeys1D;
