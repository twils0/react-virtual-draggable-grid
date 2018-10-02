import updatePositions from './updatePositions';
import updateKeys from './updateKeys';

const changeOrder = ({
  order, keys, fromIndexX, fromIndexY, toIndexX, toIndexY,
}) => {
  const newOrder = [...order];
  const fromRow = newOrder[fromIndexY];

  if (fromRow) {
    const orderObject = fromRow[fromIndexX];

    if (orderObject) {
      if (fromRow.length === 1) {
        newOrder.splice(fromIndexY, 1);
      } else {
        fromRow.splice(fromIndexX, 1);
      }

      const toRow = newOrder[toIndexY];
      let orderIndexX = 0;
      let orderIndexY = 0;

      if (!toRow) {
        const newOrderLen = newOrder.length;

        newOrder[newOrderLen] = [orderObject];
      } else {
        const newToRow = [...toRow];

        newToRow.splice(toIndexX, 0, orderObject);

        newOrder[toIndexY] = newToRow;
      }

      if (fromIndexX >= toIndexX) {
        orderIndexX = toIndexX;
      } else {
        orderIndexX = fromIndexX;
      }
      if (fromIndexY >= toIndexY) {
        orderIndexY = toIndexY;
      } else {
        orderIndexY = fromIndexY;
      }

      const updatedOrder = updatePositions({
        order: newOrder,
        orderIndexX,
        orderIndexY,
      });

      const updatedKeys = updateKeys({
        order: newOrder,
        keys,
        fromIndexX,
        fromIndexY,
        toIndexX,
        toIndexY,
      });

      return { order: updatedOrder, keys: updatedKeys };
    }
  }

  return null;
};

export default changeOrder;
