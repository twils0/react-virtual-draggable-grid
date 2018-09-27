import handlePosition from './handlePosition';

const handleOrder = (items) => {
  const keys = [];
  const order = [];

  items.forEach((itemY, indexY) => {
    if (itemY && typeof itemY === 'object' && itemY.constructor === Array) {
      const row = [];
      order.push(row);

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

          // use either fixedWidth, estimatedWidth, or the default value: 100
          const width = fixedWidth || estimatedWidth || 100;
          const height = fixedHeight || estimatedHeight || 100;

          // location of the top left corner of the item
          const { left, top } = handlePosition({
            order,
            width,
            height,
            indexX,
            indexY,
          });

          keys.push(key);
          row.push({
            key,
            itemIndexX: indexX,
            itemIndexY: indexY,
            width,
            height,
            left,
            top,
          });
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

      // use either fixedWidth, estimatedWidth, or the default value: 100
      const width = fixedWidth || estimatedWidth || 100;
      const height = fixedHeight || estimatedHeight || 100;

      const { left, top } = handlePosition({
        order,
        width,
        height,
        indexX: 0,
        indexY,
      });

      keys.push(key);
      order.push([
        {
          key,
          itemIndexX: 0,
          itemIndexY: indexY,
          width,
          height,
          left,
          top,
        },
      ]);
    }
  });

  return order;
};

export default handleOrder;
