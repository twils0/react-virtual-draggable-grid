import binarySearchX from './binarySearchX';

// get the top position of an orderNode, by recursively checking
// the top position and the height of any orderNodes directly above;
// basically, a gravity effect toward the top of the screen
const getPositionTop = ({
  order, orderX, orderY, gutterY, leftBound, rightBound,
}) => {
  if (orderY === 0) {
    return 0;
  }

  let top = -1;
  const currentRow = order[orderY];
  const currentObject = currentRow && order[orderY][orderX];

  if (orderY - 1 >= 0 && (currentObject || (leftBound && rightBound))) {
    const currentPosLeft = leftBound || currentObject.left;
    const currentPosRight = rightBound || currentPosLeft + currentObject.width;

    const { leftIndex, rightIndex } = binarySearchX({
      order,
      indexY: orderY - 1,
      leftCutoff: currentPosLeft,
      rightCutoff: currentPosRight,
    });

    if (leftIndex > -1) {
      for (let iX = leftIndex; iX <= rightIndex; iX += 1) {
        const orderNode = order[orderY - 1][iX];
        const upPosLeft = orderNode.left;
        const upPosRight = upPosLeft + orderNode.width;

        if (
          (upPosLeft >= currentPosLeft && upPosLeft < currentPosRight)
          || (upPosRight > currentPosLeft && upPosRight <= currentPosRight)
          || (upPosLeft <= currentPosLeft && upPosRight >= currentPosRight)
        ) {
          const upPosTop = orderNode.top;
          const upPosBottom = upPosTop + orderNode.height;

          if (upPosBottom > top) {
            top = upPosBottom + gutterY;
          }
        }
      }
    }

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
