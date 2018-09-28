import handlePosition from './handlePosition';

const updatePositions = ({ order, indexX, indexY }) => {
  for (let iY = indexY; iY < order.length; iY += 1) {
    for (let iX = indexX; iX < order[iY].length; iX += 1) {
      const orderObject = order[iY][iX];

      const { left, top } = handlePosition({ order, indexX: iX, indexY: iY });

      order[iY][iX] = { ...orderObject, left, top }; // eslint-disable-line
    }
  }

  return order;
};

export default updatePositions;
