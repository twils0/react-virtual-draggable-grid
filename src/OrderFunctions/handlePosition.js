const handlePosition = ({
  order, indexX, indexY, leftBound, rightBound,
}) => {
  let left = -1;
  let top = -1;
  const recursiveCall = typeof leftBound === 'number' || typeof rightBound === 'number';

  const currentRow = order[indexY];

  if (currentRow) {
    const currentRowLen = currentRow.length - 1;
    const limitedIndexX = indexX > currentRowLen ? currentRowLen : indexX;
    const currentObject = currentRow[limitedIndexX];

    if (!recursiveCall && limitedIndexX === 0 && indexY === 0) {
      return {
        left: 0,
        top: 0,
      };
    }

    const upRow = order[indexY - 1];
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
          indexX: limitedIndexX,
          indexY: indexY - 1,
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
