
// find the max height value in an array of orderObjects
// within the order 2D array
const findMaxHeight = ({ order, indexY }) => {
  let maxHeight = -1;
  const row = order[indexY];

  if (row) {
    row.forEach((orderObject) => {
      const { height } = orderObject;

      if (height > maxHeight) {
        maxHeight = height;
      }
    });
  }

  return maxHeight;
};

export default findMaxHeight;
