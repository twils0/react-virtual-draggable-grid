const findPosition = ({ order, left, top }) => {
  let minDiff = -1;
  const indexObject = { orderIndexX: -1, orderIndexY: -1 };

  order.forEach((row, orderIndexY) => {
    row.forEach((orderObject, orderIndexX) => {
      const leftDiff = orderObject.left - left;
      const topDiff = orderObject.top - top;

      if (leftDiff >= 0 && topDiff >= 0) {
        console.log(left, orderObject.left, top, orderObject.top);

        if (minDiff === -1 || minDiff < leftDiff + topDiff) {
          minDiff = leftDiff + topDiff;
          indexObject.orderIndexX = orderIndexX;
          indexObject.orderIndexY = orderIndexY;
        }
      }
    });
  });

  return indexObject;
};

export default findPosition;
