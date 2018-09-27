import handlePosition from './handlePosition';

const updatePositions = ({
  order, width, height, indexX, indexY,
}) => {
  console.log('up pos 1', indexX, indexY);

  for (let iY = indexY; iY < order.length; iY += 1) {
    for (let iX = indexX; iX < order[iY].length; iX += 1) {
      const orderObject = iX === indexX && iY === indexY
        ? {
          ...order[iY][iX],
          width,
          height,
        }
        : order[iY][iX];

      const { left, top } = handlePosition({
        order,
        width: orderObject.width,
        height: orderObject.height,
        indexX: iX,
        indexY: iY,
      });

      order[iY][iX] = { ...orderObject, left, top }; // eslint-disable-line
    }
  }

  return order;
};

export default updatePositions;
