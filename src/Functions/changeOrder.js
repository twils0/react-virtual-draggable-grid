import updatePositions from './updatePositions';

const changeOrder = ({
  order,
  keys,
  fixedRows,
  fixedColumns,
  fixedWidthAll,
  fixedHeightAll,
  gutterX,
  gutterY,
  fromIndexX,
  fromIndexY,
  toIndexX,
  toIndexY,
}) => {
  const newOrder = [...order];
  const fromRow = newOrder[fromIndexY] && [...newOrder[fromIndexY]];
  newOrder[fromIndexY] = fromRow;

  if (fromRow) {
    const orderObject = { ...fromRow[fromIndexX] };

    if (orderObject) {
      if (fromRow.length === 1) {
        newOrder.splice(fromIndexY, 1);
      } else {
        fromRow.splice(fromIndexX, 1);
      }

      const toRow = newOrder[toIndexY];

      if (!toRow) {
        const newOrderLen = newOrder.length;

        newOrder[newOrderLen] = [orderObject];
      } else {
        const newToRow = [...toRow];

        newToRow.splice(toIndexX, 0, orderObject);

        newOrder[toIndexY] = newToRow;
      }

      const lowestX = fromIndexX >= toIndexX ? toIndexX : fromIndexX;
      const lowestY = fromIndexY >= toIndexY ? toIndexY : fromIndexY;

      const orderKeysObject = updatePositions({
        order: newOrder,
        keys,
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        orderX: lowestX,
        orderY: lowestY,
        gutterX,
        gutterY,
      });

      return orderKeysObject;
    }
  }

  return null;
};

export default changeOrder;
