/* eslint-disable no-param-reassign */

import getSize from './Functions/getSize';
import findMaxNode from './Functions/findMaxNode';
import findMinNode from './Functions/findMinNode';
import getValuesArray2D from './Functions/getValuesArray2D';
import getCoordinate from './Functions/getCoordinate';
import getCoordinates from './Functions/getCoordinates';
import findIntervalYMinX from './Functions/findIntervalYMinX';
import findIntervalYMaxX from './Functions/findIntervalYMaxX';
import findIntervalXMinY from './Functions/findIntervalXMinY';
import findIntervalXMaxY from './Functions/findIntervalXMaxY';
import shiftKeys2D from './Functions/shiftKeys2D';
import addRBT from './Functions/addRBT';
import findMinX from './Functions/findMinX';
import findMaxX from './Functions/findMaxX';
import isRed from './Functions/isRed';
import deleteNode2D from './Functions/deleteNode2D';
import Interval1D from './Interval1D';

// 2D, interval, and red-black binary search tree
class RedBlackTree2D {
  constructor() {
    this.root = null;
    this.minX = -1;
    this.maxX = -1;
  }

  get isEmpty() {
    return !this.root;
  }

  get size() {
    return getSize(this.root);
  }

  get minY() {
    if (this.root) {
      const minNode = findMinNode(this.root);

      return minNode.interval.min;
    }

    return -1;
  }

  get maxY() {
    return this.root ? this.root.interval.maxEndpoint : -1;
  }

  // if coordinates match a node, return left, right, top,
  // and bottom positions and the value of that node; if coordinate,
  // is below the grid, return null value and all positions except
  // top; if no match within the grid, return null value and
  // no positions; and, so on
  getCoordinates(x, y) {
    let intervalX = new Interval1D(-1, -1);
    let intervalY = new Interval1D(-1, -1);
    let value = null;

    if (x > this.maxX) {
      intervalX.min = this.maxX;
    } else if (x < this.minX) {
      intervalX.max = this.minX;
    }
    if (y > this.maxY) {
      intervalY.min = this.maxY;
    } else if (y < this.minY) {
      intervalY.max = this.minY;
    }

    if (
      (intervalY.min > -1 || intervalY.max > -1)
      && (intervalX.min === -1 && intervalX.max === -1)
    ) {
      let node = null;

      if (top > -1) {
        node = findMaxNode(this.root);
      } else {
        node = findMinNode(this.root);
      }

      if (node) {
        const { interval } = node.value.getCoordinate(x);

        intervalX = interval;
      }
    } else if (
      (intervalX.min > -1 || intervalX.max > -1)
      && (intervalY.min === -1 && intervalY.max === -1)
    ) {
      const { interval } = getCoordinate(y, this.root);

      intervalY = interval;
    } else if (
      intervalX.min === -1
      && intervalX.max === -1
      && intervalY.min === -1
      && intervalY.max === -1
    ) {
      ({ left, top, value } = getCoordinates(x, y, this.root));
    }

    return {
      intervalX,
      intervalY,
      value,
    };
  }

  getIntervalsNodes(intervalX, intervalY) {
    return getValuesArray2D(intervalX, intervalY, this.root);
  }

  getIntervalsNodeValues(intervalX, intervalY) {
    return getValuesArray2D(intervalX, intervalY, this.root);
  }

  findIntervalYMinX(intervalY) {
    return findIntervalYMinX(intervalY, this.root);
  }

  findIntervalYMaxX(intervalY) {
    return findIntervalYMaxX(intervalY, this.root);
  }

  findIntervalXMinY(intervalX) {
    return findIntervalXMinY(-1, intervalX, this.root);
  }

  findIntervalXMaxY(intervalX) {
    return findIntervalXMaxY(-1, intervalX, this.root);
  }

  // shift all keys larger than node at intervalY;
  // along the way, on sub-trees, shift all the keys
  // larger than node at intervalX
  shiftKeys(intervalX, intervalY, shiftX, shiftY) {
    const node = this.getNode1D(intervalY, this.root);

    if (node) {
      shiftKeys2D(intervalX, shiftX, shiftY, node);
    }
  }

  add(intervalX, intervalY, value) {
    this.root = addRBT(intervalX, intervalY, value, this.root);

    if (!this.isEmpty) {
      if (this.minX === -1 || intervalX.min < this.minX) {
        this.minX = intervalX.min;
      }
      if (intervalX.max > this.maxX) {
        this.maxX = intervalX.max;
      }

      this.root.color = false;
    }
  }

  delete(intervalX, intervalY) {
    if (!this.isEmpty) {
      if (!isRed(this.root.left) && !isRed(this.root.right)) {
        this.root.color = true;
      }

      this.root = deleteNode2D(intervalX, intervalY, this.root);

      if (!this.isEmpty) {
        if (this.minX === intervalX.min) {
          this.minX = findMinX(this.root.value.min, this.root);
        }
        if (this.maxX === intervalX.max) {
          this.maxX = findMaxX(-1, this.root);
        }

        this.root.color = false;
      } else {
        this.maxX = -1;
        this.minX = -1;
      }
    }
  }
}

export default RedBlackTree2D;
