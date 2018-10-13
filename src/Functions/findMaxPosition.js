const findMaxPosition = ({
  order, fixedWidthAll, fixedHeightAll, gutterX, gutterY,
}) => {
  let maxRight = -1;
  let maxBottom = -1;

  if (fixedHeightAll) {
    maxBottom = order.length * (fixedHeightAll + gutterY) - gutterY;
  }

  order.forEach((row) => {
    const rowLen = row.length;

    if (fixedWidthAll) {
      maxRight = rowLen * (fixedWidthAll + gutterX) - gutterX;
    } else {
      const { left, width } = row[rowLen - 1];
      const right = left + width;

      if (right > maxRight) {
        maxRight = right;
      }
    }

    if (!fixedHeightAll) {
      row.forEach((orderObject) => {
        const { top, height } = orderObject;
        const bottom = top + height;

        if (bottom > maxBottom) {
          maxBottom = bottom;
        }
      });
    }
  });

  return { maxRight, maxBottom };
};

export default findMaxPosition;
