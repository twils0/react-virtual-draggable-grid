const getOrderIndex = ({ order, orderObject }) => {
  let orderX = -1;
  let orderY = -1;

  order.findIndex((row, iY) => {
    const found = row.findIndex((object, iX) => {
      if (object.key === orderObject.key) {
        orderX = iX;
        return true;
      }

      return false;
    });

    if (found > -1) {
      orderY = iY;
      return true;
    }

    return false;
  });

  return { orderX, orderY };
};

export default getOrderIndex;
