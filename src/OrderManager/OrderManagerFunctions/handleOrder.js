import handleOrderObject from './handleOrderObject';
import getPositionLeft from './getPositionLeft';
import getPositionTop from './getPositionTop';

// create an order 2D array and a key object, based on
// an items 1D or 2D array
const handleOrder = ({
  items,
  rowLimit,
  columnLimit,
  fixedRows,
  fixedColumns,
  fixedWidthAll,
  fixedHeightAll,
  gutterX,
  gutterY,
}) => {
  const limitedRowLen = rowLimit > 0 ? rowLimit : items.length;
  const newOrder = new Array(limitedRowLen);
  const newKeys = {};
  const maxWidthArr = [];
  let maxBottom = 0;

  for (let iY = 0; iY < limitedRowLen; iY += 1) {
    const itemsRow = Array.isArray(items[iY]) ? items[iY] : [items[iY]];
    const limitedColLen = columnLimit > 0 ? columnLimit : itemsRow.length;
    const orderRow = new Array(limitedColLen);
    let maxHeight = 0;

    newOrder[iY] = orderRow;

    for (let iX = 0; iX < limitedColLen; iX += 1) {
      const item = itemsRow[iX];
      const orderObject = handleOrderObject({
        item,
        indexX: iX,
        indexY: iY,
        fixedWidthAll,
        fixedHeightAll,
      });

      if (orderObject) {
        orderRow[iX] = orderObject;
        newKeys[item.key] = orderObject;

        // === Columns === //

        if (fixedColumns) {
          if (fixedWidthAll) {
            orderObject.left = iX * (fixedWidthAll + gutterX);
          } else {
            if (!maxWidthArr[iX]) maxWidthArr[iX] = 0;
            if (orderObject.width > maxWidthArr[iX]) maxWidthArr[iX] = orderObject.width;
          }
        } else {
          orderObject.left = getPositionLeft({
            order: newOrder,
            orderX: iX,
            orderY: iY,
            gutterX,
          });
        }

        // === Rows === //

        if (fixedRows) {
          if (fixedHeightAll) {
            orderObject.top = iY * (fixedHeightAll + gutterY);
          } else {
            if (orderObject.height > maxHeight) maxHeight = orderObject.height;

            orderObject.top = maxBottom;
          }
          // objectObject.left may not be set, if fixedColumns and !fixedWidthAll
        } else if (typeof orderObject.left === 'number') {
          orderObject.top = getPositionTop({
            order: newOrder,
            orderX: iX,
            orderY: iY,
            gutterX,
            gutterY,
          });
        }
      }
    }

    if (fixedRows && !fixedHeightAll) {
      maxBottom += maxHeight + gutterY;
    }
  }
  // unfortunately, need to loop through again in this case
  // to set orderObject.left
  if (fixedColumns && !fixedWidthAll) {
    const leftArr = [0];
    maxBottom = 0;

    for (let iY = 0; iY < newOrder.length; iY += 1) {
      const orderRow = newOrder[iY];
      let maxHeight = 0;

      for (let iX = 0; iX < orderRow.length; iX += 1) {
        const orderObject = orderRow[iX];

        if (!leftArr[iX] && iX > 0) leftArr[iX] = leftArr[iX - 1] + maxWidthArr[iX - 1] + gutterX;

        orderObject.left = leftArr[iX];

        if (fixedRows) {
          if (fixedHeightAll) {
            orderObject.top = iY * (fixedHeightAll + gutterY);
          } else {
            if (orderObject.height > maxHeight) maxHeight = orderObject.height;

            orderObject.top = maxBottom;
          }
          // objectObject.left may not be set, if fixedColumns and !fixedWidthAll
        } else if (typeof orderObject.left === 'number') {
          orderObject.top = getPositionTop({
            order: newOrder,
            orderX: iX,
            orderY: iY,
            gutterX,
            gutterY,
          });
        }
      }

      if (fixedRows && !fixedHeightAll) {
        maxBottom += maxHeight + gutterY;
      }
    }
  }

  return {
    order: newOrder,
    keys: newKeys,
  };
};

export default handleOrder;
