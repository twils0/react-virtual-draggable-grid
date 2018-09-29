const findMaxPosition = (order) => {
  let maxRight = -1;
  let maxBottom = -1;
  const orderLen = order.length;

  order.forEach((row, indexY) => {
    const { left, width } = row[row.length - 1];
    const right = left + width;

    if (right > maxRight) {
      maxRight = right;
    }

    if (indexY === orderLen) {
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
