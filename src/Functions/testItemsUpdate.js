const testItemsUpdate = ({ items, order, keys }) => {
  if (!order || !keys) {
    return true;
  }

  const keysLen = Object.keys(keys).length;
  let count = 0;

  const someBoolItems = items.some((itemsRow, indexY) => {
    if (itemsRow && Array.isArray(itemsRow)) {
      const someBoolRow = itemsRow.some((item, indexX) => {
        if (item && item.key && typeof item.key === 'string') {
          const orderObject = keys[item.key];

          if (!orderObject) {
            return true;
          }

          const { itemX, itemY } = orderObject;

          if (itemX !== indexX || itemY !== indexY) {
            return true;
          }

          count += 1;
        }

        return false;
      });

      return someBoolRow;
    }

    if (itemsRow && itemsRow.key) {
      const orderObject = keys[itemsRow.key];

      if (!orderObject) {
        return true;
      }

      const { itemX, itemY } = orderObject;

      if (itemX !== 0 || itemY !== indexY) {
        return true;
      }

      count += 1;
    }

    return false;
  });

  if (!someBoolItems && count !== keysLen) {
    return true;
  }

  return someBoolItems;
};

export default testItemsUpdate;
