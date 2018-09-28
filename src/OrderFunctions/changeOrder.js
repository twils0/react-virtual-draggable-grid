import updatePositions from './updatePositions';

const changeOrder = ({
  order, newOrder, fromIndexX, fromIndexY, toIndexX, toIndexY,
}) => {
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
      let indexX = 0;
      let indexY = 0;

      if (!toRow) {
        const orderLen = newOrder.length;
        const limitedIndexY = orderLen || toIndexY;

        newOrder[limitedIndexY] = [orderObject]; // eslint-disable-line
      } else {
        toRow.splice(toIndexX, 0, orderObject);
      }

      if (fromIndexX >= toIndexX) {
        indexX = toIndexX;
      } else {
        indexX = fromIndexX;
      }
      if (fromIndexY >= toIndexY) {
        indexY = toIndexY;
      } else {
        indexY = fromIndexY;
      }

      const updatedOrder = updatePositions({
        order: newOrder,
        indexX,
        indexY,
      });

      return updatedOrder;
    }
  }

  return order;
};

export default changeOrder;
