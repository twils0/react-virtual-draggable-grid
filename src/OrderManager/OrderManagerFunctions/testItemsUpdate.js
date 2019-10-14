// test if items 1D or 2D array has changed
const testItemsUpdate = ({
  items,
  order,
  keys,
  fixedWidthAll,
  fixedHeightAll,
}) => {
  if (!order || !keys) {
    return true;
  }

  const keysLen = Object.keys(keys).length;
  let count = 0;

  const someBoolItems = items.some((itemsRow, indexY) => {
    if (itemsRow && Array.isArray(itemsRow)) {
      const someBoolRow = itemsRow.some((item, indexX) => {
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
          const orderObject = keys[item.key];

          // if there's not an orderObject for the item, it's new
          if (!orderObject) {
            return true;
          }

          const {
            itemX, itemY, width, height,
          } = orderObject;

          // if the orderObject's item indexes do not
          // match the indexes from the items 1D or 2D array,
          // something has changed
          if (itemX !== indexX || itemY !== indexY) {
            return true;
          }

          if (
            (width !== item.fixedWidth && width !== fixedWidthAll)
            || (height !== item.fixedHeight && height !== fixedHeightAll)
          ) {
            return true;
          }

          // count the number of items provided
          count += 1;
        }

        return false;
      });

      return someBoolRow;
    }

    // ignore items without a key prop
    if (itemsRow && itemsRow.key) {
      const orderObject = keys[itemsRow.key];

      // if there's not an orderObject for the item, it's new
      if (!orderObject) {
        return true;
      }

      const { itemX, itemY } = orderObject;

      // if the orderObject's item indexes do not
      // match the indexes from the items 1D or 2D array,
      // something has changed
      if (itemX !== 0 || itemY !== indexY) {
        return true;
      }

      // count the number of items provided
      count += 1;
    }

    return false;
  });

  // if the number of items provided doesn't match the
  // current number of object keys in the keys object, something
  // has changed
  if (!someBoolItems && count !== keysLen) {
    return true;
  }

  return someBoolItems;
};

export default testItemsUpdate;
