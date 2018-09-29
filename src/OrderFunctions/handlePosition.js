const handlePosition = ({
  order, orderIndexX, orderIndexY, leftBound, rightBound,
}) => {
  let left = -1;
  let top = -1;
  const recursiveCall = typeof leftBound === 'number' || typeof rightBound === 'number';

  const currentRow = order[orderIndexY];

  if (currentRow) {
    const currentRowLen = currentRow.length - 1;
    const limitedIndexX = orderIndexX > currentRowLen ? currentRowLen : orderIndexX;
    const currentObject = currentRow[limitedIndexX];

    if (!recursiveCall && limitedIndexX === 0 && orderIndexY === 0) {
      return {
        left: 0,
        top: 0,
      };
    }

    const upRow = order[orderIndexY - 1];
    const leftObject = currentRow[limitedIndexX - 1];
    const leftPosRight = leftObject ? leftObject.left + leftObject.width : 0;

    if (upRow) {
      const currentPosLeft = leftBound || leftPosRight;
      const currentPosRight = rightBound || leftPosRight + currentObject.width;
      let upPosBottom = -1;

      upRow.forEach((orderObject) => {
        const objectPosRight = orderObject.left + orderObject.width;
        const objectPosBottom = orderObject.top + orderObject.height;

        if (
          ((orderObject.left >= currentPosLeft && orderObject.left < currentPosRight)
            || (objectPosRight > currentPosLeft && objectPosRight <= currentPosRight)
            || (orderObject.left <= currentPosLeft && objectPosRight >= currentPosRight))
          && objectPosBottom >= upPosBottom
        ) {
          upPosBottom = objectPosBottom;
        }
      });

      if (upPosBottom === -1) {
        const result = handlePosition({
          order,
          orderIndexX: limitedIndexX,
          orderIndexY: orderIndexY - 1,
          leftBound: currentPosLeft,
          rightBound: currentPosRight,
        });

        upPosBottom = result.top !== -1 ? result.top : 0;
      }

      left = leftPosRight;
      top = upPosBottom;
    } else if (!recursiveCall) {
      left = leftPosRight;
      top = 0;
    }
  }

  return {
    left,
    top,
  };
};

export default handlePosition;
