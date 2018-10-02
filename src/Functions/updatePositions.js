import handlePosition from './handlePosition';

const updatePositions = ({ order, orderIndexX, orderIndexY }) => {
  const newOrder = [...order];

  for (let iY = orderIndexY; iY < order.length; iY += 1) {
    const orderRow = newOrder[iY];

    if (orderRow) {
      const newOrderRow = [...orderRow];

      newOrder[iY] = newOrderRow;

      for (let iX = orderIndexX; iX < newOrderRow.length; iX += 1) {
        const orderObject = newOrderRow[iX];

        if (orderObject) {
          const { left, top } = handlePosition({
            order: newOrder,
            orderIndexX: iX,
            orderIndexY: iY,
          });

          newOrderRow[iX] = { ...orderObject, left, top };
        }
      }
    }
  }

  return newOrder;
};

export default updatePositions;
