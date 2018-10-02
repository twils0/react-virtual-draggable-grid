import handleOrderObject from './handleOrderObject';
import handlePosition from './handlePosition';

const handleOrder = ({ items, order, keys }) => {
  const newOrder = [];
  const newKeys = {};

  items.forEach((itemY, indexY) => {
    if (itemY && Array.isArray(itemY)) {
      const row = [];
      newOrder.push(row);

      itemY.forEach((itemX, indexX) => {
        const orderObject = handleOrderObject({
          order,
          keys,
          item: itemX,
          row,
          indexX,
          indexY,
        });

        row.push(orderObject);

        const { left, top } = handlePosition({
          order: newOrder,
          orderIndexX: indexX,
          orderIndexY: indexY,
        });

        orderObject.left = left;
        orderObject.top = top;

        newKeys[orderObject.key] = {
          x: indexX,
          y: indexY,
        };
      });
    } else {
      const orderObject = handleOrderObject({
        order,
        keys,
        item: itemY,
        indexX: 0,
        indexY,
      });

      newOrder.push([orderObject]);

      const { left, top } = handlePosition({
        order: newOrder,
        orderIndexX: 0,
        orderIndexY: indexY,
      });

      orderObject.left = left;
      orderObject.top = top;

      newKeys[orderObject.key] = {
        x: 0,
        y: indexY,
      };
    }
  });

  return { order: newOrder, keys: newKeys };
};

export default handleOrder;
