const getPositionLeft = ({
  order, orderX, orderY, gutterX,
}) => {
  if (orderX === 0) {
    return 0;
  }

  let left = -1;
  const orderRow = order[orderY];
  const orderObject = orderRow && orderRow[orderX];

  if (orderObject) {
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
