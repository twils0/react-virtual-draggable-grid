const handleOrderObject = ({
  keys, item, indexX, indexY, fixedWidthAll, fixedHeightAll,
}) => {
  let orderObject = null;

  if (
    item
    && typeof item === 'object'
    && typeof item.ItemComponent === 'function'
    && item.key
    && typeof item.key === 'string'
  ) {
    orderObject = keys && keys[item.key] ? { ...keys[item.key] } : null;

    if (orderObject) {
      orderObject.itemX = indexX;
      orderObject.itemY = indexY;
    } else {
      const {
        key, fixedWidth, fixedHeight, estimatedWidth, estimatedHeight,
      } = item;

      // use either fixed size, estimated size, or the default value: 100
      const width = fixedWidthAll || fixedWidth || estimatedWidth || 100;
      const height = fixedHeightAll || fixedHeight || estimatedHeight || 100;

      orderObject = {
        key,
        itemX: indexX,
        itemY: indexY,
        orderX: indexX,
        orderY: indexY,
        width,
        height,
      };
    }
  }

  return orderObject;
};

export default handleOrderObject;
