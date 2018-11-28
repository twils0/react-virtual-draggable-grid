// get the left position of an orderNode, by recursively checking
// the left position and width of the orderNode to the left
const getPositionLeft = ({
  order, orderX, orderY, gutterX,
}) => {
  if (orderX === 0) {
    return 0;
  }

  let left = -1;
  const orderRow = order[orderY];
  const orderNode = orderRow && orderRow[orderX];

  if (orderNode) {
    const prevObject = orderRow[orderX - 1];
    const prevWidth = prevObject ? prevObject.width : 0;

    const prevLeft = getPositionLeft({
      order,
      orderX: orderX - 1,
      orderY,
      gutterX,
    });

    left = prevLeft + prevWidth + gutterX;
  }

  return left;
};

export default getPositionLeft;
