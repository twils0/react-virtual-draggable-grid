
const handleOrderObject = ({
  item, indexX, indexY, fixedWidthAll, fixedHeightAll,
}) => {
  let newOrderObject = null;

  // ignore any item object missing an ItemComponent,
  // key, fixedWidth, or fixedHeight prop
  if (
    item
    && typeof item === 'object'
    && typeof item.ItemComponent === 'function'
    && typeof item.key === 'string'
    && typeof item.fixedWidth === 'number'
    && typeof item.fixedHeight === 'number'
  ) {
    const { key, fixedWidth, fixedHeight } = item;

    const width = fixedWidthAll || fixedWidth;
    const height = fixedHeightAll || fixedHeight;

    newOrderObject = {
      key,
      itemX: indexX,
      itemY: indexY,
      orderX: indexX,
      orderY: indexY,
      width,
      height,
    };
  }

  return newOrderObject;
};

export default handleOrderObject;
