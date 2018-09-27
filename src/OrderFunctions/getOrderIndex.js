const getOrderIndex = (order, itemKey) => {
  let orderIndexX = -1;
  let orderIndexY = -1;
  const orderLen = order.length;

  // may want to consider optimization options in the future
  for (let iY = 0; iY < orderLen && orderIndexY === -1; iY += 1) {
    const row = order[iY];
    const rowLen = row.length;

    for (let iX = 0; iX < rowLen && orderIndexX === -1; iX += 1) {
      if (order[iY][iX].key === itemKey) {
        orderIndexX = iX;
        orderIndexY = iY;
      }
    }
  }

  return { orderIndexX, orderIndexY };
};

export default getOrderIndex;
