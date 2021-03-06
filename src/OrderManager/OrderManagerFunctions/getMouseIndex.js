// get the order 2D array x and y index over which a pressed
// item is hovering
const getMouseIndex = ({
  order, visibleOrder, mouseX, mouseY,
}) => {
  let toIndexX = -1;
  let toIndexY = -1;
  const orderLen = order.length;

  visibleOrder.some((orderObject) => {
    const {
      left, top, width, height, orderX, orderY,
    } = orderObject;
    const rowLen = order[orderY].length;

    // determine x-axis movement from the center of
    // the pressed item's width
    const centeredX = mouseX + width / 2;
    // determine y-axis movement from one third down
    // the pressed item's height
    const centeredY = mouseY + height / 3;

    const right = left + width;
    const widthLeeway = width * 0.1;
    const bottom = top + height;
    const heightLeeway = height * 0.1;

    // hovering to the left of the grid
    const leftBool = orderX === 0 && centeredX < 0;
    // hovering to the right of the grid
    const rightBool = orderX === rowLen - 1 && centeredX >= right;
    // hovering between left and right
    const leftRightBool = centeredX >= left + widthLeeway && centeredX < right - widthLeeway;

    // hovering above the grid
    const topBool = orderY === 0 && centeredY <= 0;
    // hovering below the grid
    const bottomBool = orderY === orderLen - 1 && centeredY >= bottom;
    // hovering between top and bottom
    const topBottomBool = centeredY >= top + heightLeeway && centeredY < bottom - heightLeeway;

    if (leftRightBool) {
      toIndexX = orderX;
    } else if (leftBool) {
      toIndexX = 0;
    } else if (rightBool) {
      toIndexX = rowLen;
    }

    if (toIndexX > -1) {
      if (topBottomBool) {
        toIndexY = orderY;

        return true;
      }
      if (topBool) {
        toIndexY = 0;

        return true;
      }
      if (bottomBool) {
        toIndexY = orderLen;

        return true;
      }
    }

    return false;
  });

  return {
    toIndexX,
    toIndexY,
  };
};

export default getMouseIndex;
