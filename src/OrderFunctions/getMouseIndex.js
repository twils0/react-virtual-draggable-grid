// get the index over which a pressed item is hovering
const getMouseIndex = (order, mouseX, mouseY) => {
  let toIndexX = -1;
  let toIndexY = -1;
  const orderLen = order.length;

  for (let iY = 0; iY < orderLen && toIndexX === -1 && toIndexY === -1; iY += 1) {
    const rowLen = order[iY].length;

    for (let iX = 0; iX < rowLen && toIndexX === -1 && toIndexY === -1; iX += 1) {
      const orderObject = order[iY][iX];
      const {
        left, top, width, height,
      } = orderObject;
      const right = left + width;
      const bottom = top + height;

      // if hovering to the left of the grid
      const leftBool = iX === 0 && mouseX < 0;
      // if hovering to the right of the grid
      const rightBool = iX === rowLen - 1 && mouseX >= right;
      // boolean to check if hovering between left and right
      const leftRightBool = mouseX >= left && mouseX < right;

      // if hovering above the grid
      const topBool = iY === 0 && mouseY <= 0;
      // if hovering below the grid
      const bottomBool = iY === orderLen - 1 && mouseY >= bottom;
      // boolean to check if hovering between top and bottom
      const topBottomBool = mouseY >= top && mouseY < bottom;

      if (leftRightBool) {
        toIndexX = iX;
      } else if (leftBool) {
        toIndexX = 0;
      } else if (rightBool) {
        toIndexX = rowLen;
      }

      if (topBottomBool) {
        toIndexY = iY;
      } else if (topBool) {
        toIndexY = 0;
      } else if (bottomBool) {
        toIndexY = orderLen;
      }

      if (toIndexX === -1 || toIndexY === -1) {
        toIndexX = -1;
        toIndexY = -1;
      }
    }
  }

  return { toIndexX, toIndexY };
};

export default getMouseIndex;
