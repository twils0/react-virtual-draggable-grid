import findMaxHeight from './findMaxHeight';
import findMaxWidth from './findMaxWidth';
import handleOrderObject from './handleOrderObject';
import getPositionLeft from './getPositionLeft';
import getPositionTop from './getPositionTop';

const handleOrder = ({
  items,
  order,
  keys,
  initialSizeBool,
  fixedRows,
  fixedColumns,
  fixedWidthAll,
  fixedHeightAll,
  gutterX,
  gutterY,
}) => {
  const newOrder = [];
  const newKeys = {};
  let resizeNeededCount = 0;
  let maxBottom = null;
  const maxRightArray = [];

  if (fixedColumns && (!fixedWidthAll || !fixedHeightAll)) {
    maxRightArray[0] = 0;
  }

  if (fixedRows && (!fixedWidthAll || !fixedHeightAll)) {
    maxBottom = 0;
  }

  for (let iY = 0; iY < items.length; iY += 1) {
    const itemsRow = items[iY];

    if (fixedRows && iY > 0 && (!fixedWidthAll || !fixedHeightAll)) {
      maxBottom += fixedHeightAll || findMaxHeight({ order: newOrder, indexY: iY - 1 });
    }

    if (itemsRow && Array.isArray(itemsRow)) {
      const row = [];

      newOrder.push(row);

      for (let iX = 0; iX < itemsRow.length; iX += 1) {
        const item = itemsRow[iX];

        const orderObject = handleOrderObject({
          order,
          keys,
          item,
          row,
          indexX: iX,
          indexY: iY,
          fixedWidthAll,
          fixedHeightAll,
        });

        row.push(orderObject);
        newKeys[item.key] = orderObject;

        if (
          fixedColumns
          && typeof maxRightArray[iX] !== 'number'
          && (!fixedWidthAll || !fixedHeightAll)
        ) {
          // previous order should be available, unless grid has just mounted;
          // need previous order to see the entire column
          maxRightArray[iX] = maxRightArray[iX - 1]
            + (fixedWidthAll
              || findMaxWidth({
                order: order || newOrder,
                indexX: iX - 1,
              }));
        }

        if (!initialSizeBool) {
          if (!fixedWidthAll || !fixedHeightAll) {
            if (!fixedWidthAll) {
              if (typeof maxRightArray[iX] === 'number') {
                orderObject.left = maxRightArray[iX] > 0 ? maxRightArray[iX] + gutterX : maxRightArray[iX];
              } else {
                orderObject.left = getPositionLeft({
                  order: newOrder,
                  orderX: iX,
                  orderY: iY,
                  gutterX,
                });
              }
            } else {
              orderObject.left = iX * (fixedWidthAll + gutterX);
            }
          }

          if (!fixedWidthAll || !fixedHeightAll) {
            if (!fixedHeightAll) {
              if (typeof maxBottom === 'number') {
                orderObject.top = maxBottom > 0 ? maxBottom + gutterY : maxBottom;
              } else {
                orderObject.top = getPositionTop({
                  order: newOrder,
                  keys: newKeys,
                  orderX: iX,
                  orderY: iY,
                  gutterX,
                  gutterY,
                });
              }
            } else {
              orderObject.top = iY * (fixedHeightAll + gutterY);
            }
          }
        } else {
          const { fixedWidth, fixedHeight } = item;

          if (!fixedWidth || !fixedHeight) {
            resizeNeededCount += 1;
          }
        }
      }
    } else {
      const orderObject = handleOrderObject({
        order,
        keys,
        item: itemsRow,
        indexX: 0,
        indexY: iY,
        fixedWidthAll,
        fixedHeightAll,
      });

      newOrder.push([orderObject]);
      newKeys[itemsRow.key] = orderObject;

      if (!initialSizeBool) {
        if (!fixedWidthAll || !fixedHeightAll) {
          orderObject.left = 0;
        }

        if (!fixedWidthAll || !fixedHeightAll) {
          if (!fixedHeightAll) {
            if (typeof maxBottom === 'number') {
              orderObject.top = maxBottom > 0 ? maxBottom + gutterY : maxBottom;
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
          } else {
            orderObject.top = iY * (fixedHeightAll + gutterY);
          }
        }
      }
    }
  }

  return { order: newOrder, keys: newKeys, resizeNeededCount };
};

export default handleOrder;
