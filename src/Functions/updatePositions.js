import findMaxHeight from './findMaxHeight';
import findMaxWidth from './findMaxWidth';
import getPositionLeft from './getPositionLeft';
import getPositionTop from './getPositionTop';

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
  const limitedOrderY = orderY > 0 ? orderY - 1 : 0;
  const startingY = fixedRows ? 0 : limitedOrderY;
  const firstStartingX = fixedColumns ? 0 : orderX;
  let maxBottom = null;
  const maxRightArray = [];

  if (fixedColumns && (!fixedWidthAll || !fixedHeightAll)) {
    maxRightArray[0] = 0;
  }

  if (fixedRows && (!fixedWidthAll || !fixedHeightAll)) {
    maxBottom = 0;
  }

  for (let iY = startingY; iY < newOrder.length; iY += 1) {
    const orderRow = newOrder[iY];
    const newOrderRow = [...orderRow];
    const startingX = iY === startingY ? firstStartingX : 0;

    newOrder[iY] = newOrderRow;

    if (fixedRows && iY > 0 && (!fixedWidthAll || !fixedHeightAll)) {
      maxBottom += fixedHeightAll || findMaxHeight({ order: newOrder, indexY: iY - 1 });
    }

    for (let iX = startingX; iX < newOrderRow.length; iX += 1) {
      const orderObject = newOrderRow[iX];
      const newOrderObject = { ...orderObject };

      if (
        fixedColumns
        && typeof maxRightArray[iX] !== 'number'
        && (!fixedWidthAll || !fixedHeightAll)
      ) {
        maxRightArray[iX] = maxRightArray[iX - 1]
          + (fixedWidthAll
            || findMaxWidth({
              order: newOrder,
              indexX: iX - 1,
            }));
      }

      newOrderRow[iX] = newOrderObject;
      newKeys[newOrderObject.key] = newOrderObject;

      newOrderObject.orderX = iX;
      newOrderObject.orderY = iY;

      if (!fixedWidthAll || !fixedHeightAll) {
        if (!fixedWidthAll) {
          if (typeof maxRightArray[iX] === 'number') {
            newOrderObject.left = maxRightArray[iX] > 0 ? maxRightArray[iX] + gutterX : maxRightArray[iX];
          } else {
            newOrderObject.left = getPositionLeft({
              order: newOrder,
              orderX: iX,
              orderY: iY,
              gutterX,
            });
          }
        } else {
          newOrderObject.left = iX * (fixedWidthAll + gutterX);
        }
      }

      if (!fixedWidthAll || !fixedHeightAll) {
        if (!fixedHeightAll) {
          if (typeof maxBottom === 'number') {
            newOrderObject.top = maxBottom > 0 ? maxBottom + gutterY : maxBottom;
          } else {
            newOrderObject.top = getPositionTop({
              order: newOrder,
              keys: newKeys,
              orderX: iX,
              orderY: iY,
              gutterX,
              gutterY,
            });
          }
        } else {
          newOrderObject.top = iY * (fixedHeightAll + gutterY);
        }
      }
    }
  }

  return { order: newOrder, keys: newKeys };
};

export default updatePositions;
