import updatePositions from './updatePositions';

// move an orderObject from one position in the order 2D array
// to another
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

  if (fromRow && fromRow[fromIndexX]) {
    const orderObject = { ...fromRow[fromIndexX] };

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

    // find the lowest index potentially affected by the change
    const lowestX = fromIndexX >= toIndexX ? toIndexX : fromIndexX;
    const lowestY = fromIndexY >= toIndexY ? toIndexY : fromIndexY;

    // update left and top positions and orderX and orderY indexes
    // for all affected orderObjects (all indexes at or above the
    // lowest indexes above)
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

  return {};
};

export default changeOrder;
