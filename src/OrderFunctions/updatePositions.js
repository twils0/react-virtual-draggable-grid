import handlePosition from './handlePosition';

const updatePositions = ({ order, orderIndexX, orderIndexY }) => {
  for (let iY = orderIndexY; iY < order.length; iY += 1) {
    const orderRow = order[iY];

    if (orderRow) {
      for (let iX = orderIndexX; iX < orderRow.length; iX += 1) {
        const orderObject = order[iY][iX];

        if (orderObject) {
          const { left, top } = handlePosition({ order, orderIndexX: iX, orderIndexY: iY });

          order[iY][iX] = { ...orderObject, left, top }; // eslint-disable-line
        }
      }
    }
  }

  return order;
};

export default updatePositions;
