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

  getCoordinates(x, y) {
    return this.rbt.getCoordinates(x, y);
  }

  exchange(intervalX, intervalY, fromValue) {
    if (intervalX && intervalY && fromValue) {
      const { left, top, width, height } = fromValue;

      const fromIntervalX = new Interval1D(left, left + width);
      const fromIntervalY = new Interval1D(top, top + height);

      toValue.left = left;
      toValue.top = top;

      this.rbt.delete(fromIntervalX);
      this.rbt.add(fromValue.intervalX, fromValue.intervalY, toValue);

      const toIntervalX = new Interval1D(toValue.left, toValue.left + toValue.width);
      const toIntervalY = new Interval1D(toValue.top, toValue.top + toValue.height);

      const fromXDiff = toValue.width - fromValue.width;
      const fromYDiff = toValue.height - fromValue.height;
      const fromRowShift = -1;
      const toXDiff = toValue.width - fromValue.width;
      const toYDiff = toValue.height - fromValue.height;
      const toRowShift = 1;

      const { getIntervalsNodeValues } = this.rbt;

      this.updateKeysValues(
        getIntervalsNodeValues(fromIntervalX, fromIntervalY),
        fromXDiff,
        fromYDiff,
        fromRowShift,
      );
      this.updateKeysValues(getIntervalsNodeValues(toIntervalX, toIntervalY), toXDiff, toYDiff, toRowShift);
    }
  }

  getKey(key) {
    return this.hashTable && this.hashTable[key];
  }

  getCoordinates(x, y) {
    return this.rbt && this.rbt.getCoordinates(x, y);
  }

  getIntervalsArray(intervalX, intervalY) {
    return this.rbt ? this.rbt.getIntervalsNodeValues(intervalX, intervalY) : [];
  }

  add(intervalX, intervalY, value) {
    if (intervalX && intervalY && value && value.key) {
      this.hashTable[value.key] = value;
      this.rbt.add(intervalX, intervalY, value);
    }
  }

  // adds items 1D or 2D array
  // to rbt and hash table
  setItems(items) {
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

  delete(intervalX, intervalY, value) {
    if (intervalX && intervalY && value && value.key) {
      delete this.hashTable[value.key];
      this.rbt.delete(intervalX, intervalY);
    }
  }
}

export default Order;
