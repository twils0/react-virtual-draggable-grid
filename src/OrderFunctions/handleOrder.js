import handlePosition from './handlePosition';
import getOrderIndex from './getOrderIndex';

const handleOrder = ({ items, order }) => {
  const keys = [];
  const newOrder = [];

  items.forEach((itemY, indexY) => {
    if (itemY && Array.isArray(itemY)) {
      const row = [];
      newOrder.push(row);

      // test if item exists, is an object, and has a key that's
      // not already been used
      itemY.forEach((itemX, indexX) => {
        if (
          itemX
          && typeof itemX === 'object'
          && typeof itemX.ItemComponent === 'function'
          && (itemX.key !== null || itemX.key !== undefined)
          && keys.indexOf(itemX.key) === -1
        ) {
          const {
            key, fixedWidth, fixedHeight, estimatedWidth, estimatedHeight,
          } = itemX;
          let orderWidth = null;
          let orderHeight = null;

          if (order) {
            const { orderIndexX, orderIndexY } = getOrderIndex(order, key);
            const orderRow = order[orderIndexY];

            if (orderRow) {
              const orderObject = orderRow[orderIndexX];

              if (orderObject) {
                orderWidth = orderObject.width;
                orderHeight = orderObject.height;
              }
            }
          }

          // use either fixed size, cached order object size,
          // estimated size, or the default value: 100
          const width = fixedWidth || orderWidth || estimatedWidth || 100;
          const height = fixedHeight || orderHeight || estimatedHeight || 100;
          const orderObject = {
            key,
            itemIndexX: indexX,
            itemIndexY: indexY,
            width,
            height,
          };

          row.push(orderObject);

          // location of the top left corner of the item
          const { left, top } = handlePosition({
            order: newOrder,
            orderIndexX: indexX,
            orderIndexY: indexY,
          });

          keys.push(key);
          orderObject.left = left;
          orderObject.top = top;
        }
      });

      // test if item exists, is an object, and has a key that's
      // not already been used
    } else if (
      itemY
      && typeof itemY === 'object'
      && typeof itemY.ItemComponent === 'function'
      && (itemY.key !== null || itemY.key !== undefined)
      && keys.indexOf(itemY.key) === -1
    ) {
      const {
        key, fixedWidth, fixedHeight, estimatedWidth, estimatedHeight,
      } = itemY;
      let orderWidth = null;
      let orderHeight = null;

      if (order) {
        const { orderIndexX, orderIndexY } = getOrderIndex(order, key);
        const orderRow = order[orderIndexY];

        if (orderRow) {
          const orderObject = orderRow[orderIndexX];

          if (orderObject) {
            orderWidth = orderObject.width;
            orderHeight = orderObject.height;
          }
        }
      }

      // use either fixedWidth, estimatedWidth, or the default value: 100
      const width = fixedWidth || orderWidth || estimatedWidth || 100;
      const height = fixedHeight || orderHeight || estimatedHeight || 100;
      const orderObject = {
        key,
        itemIndexX: 0,
        itemIndexY: indexY,
        width,
        height,
      };

      newOrder.push([orderObject]);

      const { left, top } = handlePosition({
        order: newOrder,
        orderIndexX: 0,
        orderIndexY: indexY,
      });

      keys.push(key);
      orderObject.left = left;
      orderObject.top = top;
    }
  });

  return newOrder;
};

export default handleOrder;
