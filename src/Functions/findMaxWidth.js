// find the max width value at a certain index
// across all the arrays within the order 2D array
const findMaxWidth = ({ order, indexX }) => {
  let maxWidth = -1;

  order.forEach((row) => {
    const orderNode = row[indexX];

    if (orderNode) {
      const { width } = orderNode;

      if (width > maxWidth) {
        maxWidth = width;
      }
    }
  });

  return maxWidth;
};

export default findMaxWidth;
