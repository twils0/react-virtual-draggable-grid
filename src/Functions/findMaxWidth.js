const findMaxWidth = ({ order, indexX }) => {
  let maxWidth = -1;

  order.forEach((row) => {
    const orderObject = row[indexX];

    if (orderObject) {
      const { width } = orderObject;

      if (width > maxWidth) {
        maxWidth = width;
      }
    }
  });

  return maxWidth;
};

export default findMaxWidth;
