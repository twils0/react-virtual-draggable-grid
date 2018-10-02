const handleOrderObject = ({
  order, keys, item, indexX, indexY,
}) => {
  const indexObject = keys && keys[item.key];
  let orderObject = null;

  if (
    item
    && typeof item === 'object'
    && typeof item.ItemComponent === 'function'
    && (item.key !== null || item.key !== undefined)
  ) {
    if (indexObject) {
      const { x, y } = indexObject;
      const orderRow = order[y];

      if (orderRow) {
        orderObject = orderRow[x];
      }
    }

    if (orderObject) {
      orderObject.itemIndexX = indexX;
      orderObject.itemIndexY = indexY;
    } else {
      const {
        key, fixedWidth, fixedHeight, estimatedWidth, estimatedHeight,
      } = item;

      // use either fixed size, estimated size, or the default value: 100
      const width = fixedWidth || estimatedWidth || 100;
      const height = fixedHeight || estimatedHeight || 100;

      orderObject = {
        key,
        itemIndexX: indexX,
        itemIndexY: indexY,
        width,
        height,
      };
    }
  }

  return orderObject;
};

export default handleOrderObject;
