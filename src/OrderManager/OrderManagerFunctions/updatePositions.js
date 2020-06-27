import getPositionLeft from './getPositionLeft';
import getPositionTop from './getPositionTop';

// update the left and top positions of orderObjects
// in the order 2D array
const updatePositions = ({
  order,
  keys,
  fixedRows,
  fixedColumns,
  fixedWidthAll,
  fixedHeightAll,
  orderX,
  orderY,
  gutterX,
  gutterY,
}) => {
  const newOrder = [...order];
  const newKeys = { ...keys };
  const cleanedOrderY = orderY > 0 ? orderY - 1 : 0;
  const startingY = fixedRows ? 0 : cleanedOrderY;
  const firstStartingX = fixedColumns ? 0 : orderX;
  const maxWidthArr = [];
  let maxBottom = 0;

  for (let iY = startingY; iY < newOrder.length; iY += 1) {
    const orderRow = newOrder[iY];
    const startingX = iY === startingY ? firstStartingX : 0;
    const newOrderRow = [...orderRow];
    let maxHeight = 0;

    newOrder[iY] = newOrderRow;

    for (let iX = startingX; iX < newOrderRow.length; iX += 1) {
      const orderObject = newOrderRow[iX];
      const newOrderObject = { ...orderObject };

      newOrderRow[iX] = newOrderObject;
      newKeys[newOrderObject.key] = newOrderObject;
      newOrderObject.orderX = iX;
      newOrderObject.orderY = iY;

      // === Columns === //

      if (fixedColumns) {
        if (fixedWidthAll) {
          newOrderObject.left = iX * (fixedWidthAll + gutterX);
        } else {
          if (!maxWidthArr[iX]) maxWidthArr[iX] = 0;
          if (newOrderObject.width > maxWidthArr[iX]) maxWidthArr[iX] = orderObject.width;
        }
      } else {
        newOrderObject.left = getPositionLeft({
          order: newOrder,
          orderX: iX,
          orderY: iY,
          gutterX,
        });
      }

      // === Rows === //

      if (fixedRows) {
        if (fixedHeightAll) {
          newOrderObject.top = iY * (fixedHeightAll + gutterY);
        } else {
          if (orderObject.height > maxHeight) maxHeight = orderObject.height;

          newOrderObject.top = maxBottom;
        }
        // newOrderObject.left may not be set, if fixedColumns and !fixedWidthAll
      } else if (typeof orderObject.left === 'number') {
        newOrderObject.top = getPositionTop({
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

  if (fixedColumns && !fixedWidthAll) {
    const leftArr = [0];
    maxBottom = 0;

    // unfortunately, need to loop through again
    // to set orderObject.left
    for (let iY = 0; iY < newOrder.length; iY += 1) {
      const newOrderRow = newOrder[iY];
      let maxHeight = 0;

      for (let iX = 0; iX < newOrderRow.length; iX += 1) {
        const newOrderObject = newOrderRow[iX];

        if (!leftArr[iX] && iX > 0) leftArr[iX] = leftArr[iX - 1] + maxWidthArr[iX - 1] + gutterX;

        newOrderObject.left = leftArr[iX];

        if (fixedRows) {
          if (fixedHeightAll) {
            newOrderObject.top = iY * (fixedHeightAll + gutterY);
          } else {
            if (newOrderObject.height > maxHeight) maxHeight = newOrderObject.height;

            newOrderObject.top = maxBottom;
          }
          // newOrderObject.left may not be set, if fixedColumns and !fixedWidthAll
        } else if (typeof newOrderObject.left === 'number') {
          newOrderObject.top = getPositionTop({
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

  return { order: newOrder, keys: newKeys };
};

export default updatePositions;
