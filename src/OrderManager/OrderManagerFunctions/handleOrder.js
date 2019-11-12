import findMaxHeight from './findMaxHeight';
import findMaxWidth from './findMaxWidth';
import handleOrderObject from './handleOrderObject';
import getPositionLeft from './getPositionLeft';
import getPositionTop from './getPositionTop';

// create an order 2D array and a key object, based on
// an items 1D or 2D array
const handleOrder = ({
  items,
  fixedRows,
  fixedColumns,
  fixedWidthAll,
  fixedHeightAll,
  gutterX,
  gutterY,
}) => {
  const newOrder = [];
  const newKeys = {};
  let maxBottom = null;
  const maxRightArray = [];

  if (fixedColumns && !fixedWidthAll) {
    maxRightArray[0] = 0;
  }
  if (fixedRows && !fixedHeightAll) {
    maxBottom = 0;
  }

  items.forEach((itemsRow, iY) => {
    // if fixedRows is true and fixedHeightAll is falsy,
    // set a maxBottom value from the previous row, to use
    // as the top value for all orderObjects in the current row
    if (fixedRows && !fixedHeightAll && iY > 0) {
      maxBottom += findMaxHeight({ order: newOrder, indexY: iY - 1 }) + gutterY;
    }

    // test if itemsRow is an array, or simply a solitary item
    if (itemsRow && Array.isArray(itemsRow)) {
      const row = [];

      newOrder.push(row);

      itemsRow.forEach((item, iX) => {
        // generate a new orderObject
        const orderObject = handleOrderObject({
          item,
          indexX: iX,
          indexY: iY,
          fixedWidthAll,
          fixedHeightAll,
        });

        if (orderObject) {
          row.push(orderObject);
          newKeys[item.key] = orderObject;

          // quickly calculate left position if fixedColumns is true and
          // fixedWidthAll is set to a number greater than 0
          if (fixedColumns && fixedWidthAll) {
            orderObject.left = iX * (fixedWidthAll + gutterX);
            // if fixedColumns is true and fixedWidthAll is falsy,
            // do nothing here; wait until all orderObjects have
            // width values
          } else if (!fixedColumns || fixedWidthAll) {
            orderObject.left = getPositionLeft({
              order: newOrder,
              orderX: iX,
              orderY: iY,
              gutterX,
            });
          }

          // quickly calculate top position if fixedRows is true and
          // fixedHeightAll is set to a number greater than 0
          if (fixedRows && fixedHeightAll) {
            orderObject.top = iY * (fixedHeightAll + gutterY);
          } else if (typeof maxBottom === 'number') {
            orderObject.top = maxBottom;
          } else {
            orderObject.top = getPositionTop({
              order: newOrder,
              orderX: iX,
              orderY: iY,
              gutterX,
              gutterY,
            });
          }
        }
      });
    } else {
      // generate a new orderObject
      const orderObject = handleOrderObject({
        item: itemsRow,
        indexX: 0,
        indexY: iY,
        fixedWidthAll,
        fixedHeightAll,
      });

      if (orderObject) {
        newOrder.push([orderObject]);
        newKeys[itemsRow.key] = orderObject;

        // when only one item is present in a row,
        // its left position is always 0
        orderObject.left = 0;

        if (fixedRows && fixedHeightAll) {
          orderObject.top = iY * (fixedHeightAll + gutterY);
        } else if (typeof maxBottom === 'number') {
          orderObject.top = maxBottom;
        } else {
          orderObject.top = getPositionTop({
            order: newOrder,
            keys: newKeys,
            orderX: 0,
            orderY: iY,
            gutterX,
            gutterY,
          });
        }
      }
    }
  });

  // must run at end, to ensure width values have been set for all
  // orderObjects in each column; if fixedColumns is truthy and
  // fixedWidthAll is falsy, set a maxRight value at the current
  // index in the maxRightArray, to use as the left value for all
  // orderObjects at that index
  if (fixedColumns && !fixedWidthAll) {
    newOrder.forEach((orderRow) => {
      orderRow.forEach((orderObject, iX) => {
        if (typeof maxRightArray[iX] !== 'number') {
          maxRightArray[iX] = maxRightArray[iX - 1]
            + findMaxWidth({
              order: newOrder,
              indexX: iX - 1,
            })
            + gutterX;
        }

        orderObject.left = maxRightArray[iX]; // eslint-disable-line no-param-reassign
      });
    });
  }

  return {
    order: newOrder,
    keys: newKeys,
  };
};

export default handleOrder;
