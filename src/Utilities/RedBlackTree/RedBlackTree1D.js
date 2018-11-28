/* eslint-disable no-param-reassign */

import getSize from './Functions/getSize';
import findMinNode from './Functions/findMinNode';
import isRed from './Functions/isRed';
import getValuesArray1D from './Functions/getValuesArray1D';
import getNode1D from './Functions/getNode1D';
import getCoordinate from './Functions/getCoordinate';
import intervalsIntersect from './Functions/intervalsIntersect';
import findIntervalMax from './Functions/findIntervalMax';
import shiftKeys1D from './Functions/shiftKeys1D';
import addNode from './Functions/addNode';
import deleteNode1D from './Functions/deleteNode1D';

// 2D, interval, and red-black binary search tree
class RedBlackTree1D {
  constructor() {
    this.root = null;
  }

  get isEmpty() {
    return !this.root;
  }

  get size() {
    return getSize(this.root);
  }

  get min() {
    if (this.root) {
      const minNode = findMinNode(this.root);

      return minNode.interval.min;
    }

    return -1;
  }

  get max() {
    return this.root ? this.root.interval.maxEndpoint : -1;
  }

  getCoordinate(x) {
    return getCoordinate(x, this.root);
  }

  getIntervalNode(interval) {
    return getNode1D(interval, this.root);
  }

  getIntervalNodeValues(interval) {
    return getValuesArray1D(interval, this.root);
  }

  intervalsIntersect(interval) {
    if (this.max < interval.min) {
      return false;
    }

    return intervalsIntersect(interval, this.root);
  }

  findIntervalMax(interval) {
    if (this.max < interval.min) {
      return -1;
    }

    return findIntervalMax(interval, this.root);
  }

  // shift all keys larger than node at interval
  shiftKeys(interval, shift) {
    const node = this.getNode1D(interval, this.root);

    if (node) {
      shiftKeys1D(shift, node.right);
    }
  }

  add(interval, value) {
    this.root = addNode(interval, value, this.root);

    if (!this.isEmpty) {
      this.root.color = false;
    }
  }

  delete(interval) {
    if (!this.isEmpty) {
      if (!isRed(this.root.left) && !isRed(this.root.right)) {
        this.root.color = true;
      }

      this.root = deleteNode1D(interval, this.root);

      if (!this.isEmpty) {
        this.root.color = false;
      }
    }
  }
}

export default RedBlackTree1D;
