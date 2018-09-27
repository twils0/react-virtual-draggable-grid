// get the index over which a pressed item is hovering
const getMouseIndex = (order, mouseX, mouseY) => {
  let mouseIndexX = -1;
  let mouseIndexY = -1;
  const orderLen = order.length - 1;

  order.forEach((row, indexY) => {
    const rowLen = row.length - 1;

    row.forEach((orderObject, indexX) => {
      const {
        left, top, width, height,
      } = orderObject;
      const right = left + width;
      const bottom = top + height;
      // check if mouse is hovering between an item's left and right or top and bottom position
      // or above or to the left of the grid
      const xBool = mouseIndexX === -1 && ((mouseX > left && mouseX < right) || (indexX === 0 && mouseX <= 0));
      const yBool = mouseIndexY === -1 && ((mouseY > top && mouseY < bottom) || (indexY === 0 && mouseY <= 0));

      if (xBool) {
        mouseIndexX = indexX;
        // if an item is hovering to the right of a row
        // add it to the end of that row
      } else if (indexX === rowLen && mouseX >= right) {
        mouseIndexX = rowLen + 1;
      }
      if (yBool) {
        mouseIndexY = indexY;
        // if an item is hovering below the last row
        // add a new row and add it to that row
      } else if (indexY === orderLen && mouseY >= bottom) {
        mouseIndexY = orderLen + 1;
      }
    });
  });

  return { mouseIndexX, mouseIndexY };
};

export default getMouseIndex;
