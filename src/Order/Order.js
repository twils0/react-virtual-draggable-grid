/* eslint-disable no-underscore-dangle, no-param-reassign */
import RBT from '../Utilities/RedBlackTree/RedBlackTree2D';
import OrderNode from './OrderNode';
import Interval1D from '../Utilities/RedBlackTree/Interval1D';

import newItemsArray2D from './Functions/newItemsArray2D';

// red-black tree with methods to handle nodes
class Order {
  constructor(items) {
    this.rbt = null;
    this.hashTable = null;

    this.fixedRows = false;
    this.gutterX = 0;
    this.gutterY = 0;

    this.setItems(items);
  }

  get size() {
    return this.rbt ? this.rbt.size : 0;
  }

  get maxX() {
    return this.rbt && this.rbt.maxX;
  }

  get maxY() {
    return this.rbt && this.rbt.maxY;
  }

  get newItems() {
    return newItemsArray2D(this.items, this.hashTable);
  }

  get array() {
    return this.hashTable ? Object.values(this.hashTable) : [];
  }

  exchange = (intervalX, intervalY, fromNode) => {
    if (intervalX && intervalY && fromNode) {
      const {
        itemX, itemY, item, left, top, width, height,
      } = fromNode;
      const toNode = new OrderNode(itemX, itemY, item);

      toNode.left = intervalX.min;
      toNode.top = intervalY.min;

      const fromIntervalX = new Interval1D(left, left + width);
      const fromIntervalY = new Interval1D(top, top + height);

      this.rbt.delete(fromIntervalX, fromIntervalY);
      this.rbt.add(fromNode.intervalX, fromNode.intervalY, toNode);

      const toIntervalX = new Interval1D(toNode.left, toNode.left + toNode.width);
      const toIntervalY = new Interval1D(toNode.top, toNode.top + toNode.height);

      const fromXDiff = toNode.width - fromNode.width;
      const fromYDiff = toNode.height - fromNode.height;
      const fromRowShift = -1;
      const toXDiff = toNode.width - fromNode.width;
      const toYDiff = toNode.height - fromNode.height;
      const toRowShift = 1;

      const { getIntervalsNodeValues } = this.rbt;

      this.shiftKeysValues(
        getIntervalsNodeValues(fromIntervalX, fromIntervalY),
        fromXDiff,
        fromYDiff,
        fromRowShift,
      );
      this.shiftKeysValues(
        getIntervalsNodeValues(toIntervalX, toIntervalY),
        toXDiff,
        toYDiff,
        toRowShift,
      );
    }
  }

  getKey = key => this.hashTable && this.hashTable[key];

  getCoordinates = (x, y) => {
    if (this.rbt) {
      const { value } = this.rbt.getCoordinates(x, y);

      return new OrderNode(value.itemX, value.itemY, value);
    }

    return new OrderNode();
  }

  getIntervalsArray = (intervalX, intervalY) => (
    this.rbt
      ? this.rbt.getIntervalsNodeValues(intervalX, intervalY)
      : []
  );

  add = (intervalX, intervalY, value) => {
    if (intervalX && intervalY && value && value.key) {
      this.hashTable[value.key] = value;
      this.rbt.add(intervalX, intervalY, value);
    }
  }

  shiftKeysValues = (valuesArray, xDiff, yDiff) => {
    if (valuesArray && valuesArray.length > 0) {
      valuesArray.forEach((value) => {
        const {
          left, top, width, height,
        } = value;
        const right = left + width;
        const bottom = top + height;

        value.left += xDiff;
        value.top += yDiff;

        const intervalX = new Interval1D(left, right);
        const intervalY = new Interval1D(top, bottom);
        // const newIntervalX = new Interval1D(value.left, right + xDiff);
        // const newIntervalY = new Interval1D(value.top, bottom + yDiff);

        this.rbt.shiftKeys(intervalX, intervalY, xDiff, yDiff);
      });
    }
  }

  // adds items 1D or 2D array
  // to rbt and hash table
  setItems = (items) => {
    if (items) {
      this.rbt = new RBT();
      this.hashTable = {};

      let maxBottom = null;

      if (this.fixedRows) {
        maxBottom = 0;
      }

      items.forEach((itemsRow, iY) => {
        const row = !Array.isArray(itemsRow) ? [itemsRow] : itemsRow;
        let lastRight = 0;

        if (this.fixedRows && iY > 0) {
          const lastBottom = this.rbt.maxY;

          if (lastBottom > 0) {
            maxBottom = lastBottom + this.gutterY;
          }
        }

        row.forEach((item, iX) => {
          // ignore any item missing an ItemComponent,
          // key, fixedWidth, or fixedHeight prop
          if (
            item
            && typeof item === 'object'
            && typeof item.ItemComponent === 'function'
            && typeof item.key === 'string'
            && typeof item.fixedWidth === 'number'
            && typeof item.fixedHeight === 'number'
          ) {
            let left = 0;

            if (iX > 0 && lastRight > 0) {
              left = lastRight + this.gutterX;
            }

            const right = left + item.fixedWidth;
            lastRight = right;

            const intervalX = new Interval1D(left, right);
            let top = 0;

            if (iY > 0) {
              if (this.fixedRows) {
                top = maxBottom;
              } else {
                const lastBottom = this.rbt.findIntervalXMaxY(intervalX);

                if (lastBottom > 0) {
                  top = lastBottom + this.gutterY;
                }
              }
            }

            const bottom = top + item.fixedHeight;

            const intervalY = new Interval1D(top, bottom);
            const orderNode = new OrderNode(iX, iY, item);
            orderNode.left = left;
            orderNode.top = top;

            this.add(intervalX, intervalY, orderNode);
          }
        });
      });
    }
  }

  delete = (intervalX, intervalY, value) => {
    if (intervalX && intervalY && value && value.key) {
      delete this.hashTable[value.key];
      this.rbt.delete(intervalX, intervalY);
    }
  }
}

export default Order;
