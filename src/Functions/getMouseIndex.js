// get the order 2D array x and y index over which a pressed
// item is hovering
const getMouseIndex = ({ order, mouseX, mouseY }) => {
  let toIndexX = -1;
  let toIndexY = -1;

  const result = order.getCoordinates(mouseX, mouseY);
  const { value } = result;

  if (value) {
    toIndexX = value.orderX;
    toIndexY = value.orderY;
  }

  return {
    toIndexX,
    toIndexY,
  };
};

export default getMouseIndex;
