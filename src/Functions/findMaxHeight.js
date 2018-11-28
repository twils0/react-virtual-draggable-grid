// find the max height value in an array of orderNodes
// within the order 2D array
const findMaxHeight = ({ order, indexY }) => {
  let maxHeight = -1;
  const row = order[indexY];

  if (row) {
    row.forEach((orderNode) => {
      const { height } = orderNode;

      if (height > maxHeight) {
        maxHeight = height;
      }
    });
  }

  return maxHeight;
};

export default findMaxHeight;
