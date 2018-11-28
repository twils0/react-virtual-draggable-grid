import findMaxHeight from './findMaxHeight';
import findMaxWidth from './findMaxWidth';
import getPositionLeft from './getPositionLeft';
import getPositionTop from './getPositionTop';

// update the left and top positions of orderNodes
// in the order 2D array
const updatePositions = ({
  order,
  keys,
  fixedRows,
  fixedWidthAll,
  fixedHeightAll,
  orderX,
  orderY,
  gutterX,
  gutterY,
}) => {
  const newOrder = [...order];
  const newKeys = { ...keys };
  const limitedOrderY = orderY > 0 ? orderY - 1 : 0;
  const startingY = fixedRows ? 0 : limitedOrderY;
  const firstStartingX = fixedCols ? 0 : orderX;
  let maxBottom = null;
  const maxRightArray = [];

  if (fixedCols && !fixedWidthAll) {
    maxRightArray[0] = 0;
  }
  if (fixedRows && !fixedHeightAll) {
    maxBottom = 0;
  }

  for (let iY = startingY; iY < newOrder.length; iY += 1) {
    const orderRow = newOrder[iY];
    const newOrderRow = [...orderRow];
    const startingX = iY === startingY ? firstStartingX : 0;

    newOrder[iY] = newOrderRow;

    // if fixedRows is true and fixedHeightAll is falsy,
    // set a maxBottom value from the previous row, to use
    // as the top value for all orderNodes in the current row
    if (fixedRows && !fixedHeightAll && iY > 0) {
      maxBottom += findMaxHeight({ order: newOrder, indexY: iY - 1 }) + gutterY;
    }

    for (let iX = startingX; iX < newOrderRow.length; iX += 1) {
      const orderNode = newOrderRow[iX];
      const newOrderObject = { ...orderNode };

      // if fixedCols is true and
      // fixedWidthAll is falsy, set a maxRight value at the current
      // index in the maxRightArray, to use as the left value for all
      // orderNodes at that index;
      if (fixedCols && !fixedWidthAll && typeof maxRightArray[iX] !== 'number') {
        maxRightArray[iX] = maxRightArray[iX - 1]
          + findMaxWidth({
            order: newOrder,
            indexX: iX - 1,
          })
          + gutterX;
      }

      // add new orderNode to the new order 2D array and
      // to the new keys object
      newOrderRow[iX] = newOrderObject;
      newKeys[newOrderObject.key] = newOrderObject;

      // update order indexes for new orderNode
      newOrderObject.orderX = iX;
      newOrderObject.orderY = iY;

      // quickly calculate left position if fixedCols is true and
      // fixedWidthAll is set to a number greater than 0;
      if (fixedCols && fixedWidthAll) {
        newOrderObject.left = iX * (fixedWidthAll + gutterX);
      } else if (typeof maxRightArray[iX] === 'number') {
        newOrderObject.left = maxRightArray[iX];
      } else {
        newOrderObject.left = getPositionLeft({
          order: newOrder,
          orderX: iX,
          orderY: iY,
          gutterX,
        });
      }

      // quickly calculate top position if fixedRows is true and
      // fixedHeightAll is set to a number greater than 0
      if (fixedRows && fixedHeightAll) {
        newOrderObject.top = iY * (fixedHeightAll + gutterY);
        // otherwise, use maxBottom, if set
      } else if (typeof maxBottom === 'number') {
        newOrderObject.top = maxBottom;
      } else {
        newOrderObject.top = getPositionTop({
          order: newOrder,
          orderX: iX,
          orderY: iY,
          gutterX,
          gutterY,
        });
      }
    }
  }

  return { order: newOrder, keys: newKeys };
};

export default updatePositions;
