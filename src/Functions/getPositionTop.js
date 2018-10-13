const getPositionTop = ({
  order, orderX, orderY, gutterY, leftBound, rightBound,
}) => {
  if (orderY === 0) {
    return 0;
  }

  let top = -1;
  const currentRow = order[orderY];
  const currentObject = currentRow && order[orderY][orderX];
  const upRow = order[orderY - 1];

  if (upRow && (currentObject || (leftBound && rightBound))) {
    const currentPosLeft = leftBound || currentObject.left;
    const currentPosRight = rightBound || currentPosLeft + currentObject.width;

    upRow.forEach((orderObject) => {
      const upPosLeft = orderObject.left;
      const upPosRight = upPosLeft + orderObject.width;

      if (
        (upPosLeft >= currentPosLeft && upPosLeft < currentPosRight)
        || (upPosRight > currentPosLeft && upPosRight <= currentPosRight)
        || (upPosLeft <= currentPosLeft && upPosRight >= currentPosRight)
      ) {
        const upPosTop = orderObject.top;
        const upPosBottom = upPosTop + orderObject.height;

        if (upPosBottom > top) {
          top = upPosBottom + gutterY;
        }
      }
    });

    if (top === -1) {
      const result = getPositionTop({
        order,
        orderX,
        orderY: orderY - 1,
        gutterY,
        leftBound: currentPosLeft,
        rightBound: currentPosRight,
      });

      top = result > -1 ? result : 0;
    }
  }

  return top;
};

export default getPositionTop;
