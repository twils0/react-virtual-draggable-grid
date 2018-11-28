/* eslint-disable no-underscore-dangle */

// used as a node in RBT;
// value can be another RBT or grid item
class interval1DNode {
  constructor(interval, value) {
    this.interval = interval;
    this.value = value;
    this.left = null;
    this.right = null;
    this.color = true;
    this.size = 1;
  }
}

export default interval1DNode;
