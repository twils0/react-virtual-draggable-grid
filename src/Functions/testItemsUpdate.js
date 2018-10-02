const testItemsUpdate = ({ items, order, keys }) => {
  if (!order || !keys) {
    return true;
  }
  const keysLen = Object.keys(keys).length;
  let count = 0;

  const someBoolItems = items.some((itemY, indexY) => {
    if (itemY && Array.isArray(itemY)) {
      const someBoolRow = itemY.some((itemX, indexX) => {
        if (itemX && itemX.key) {
          const indexObject = keys[itemX.key];

          if (!indexObject) {
            return true;
          }

          const { x, y } = indexObject;
          const orderRow = order[y];

          if (!orderRow) {
            return true;
          }

          const orderObject = orderRow[x];

          if (!orderObject) {
            return true;
          }

          const { itemIndexX, itemIndexY } = orderObject;

          if (itemIndexX !== indexX || itemIndexY !== indexY) {
            return true;
          }

          count += 1;
        }

        return false;
      });

      return someBoolRow;
    }

    if (itemY && itemY.key) {
      const indexObject = keys[itemY.key];

      if (!indexObject) {
        return true;
      }

      const { x, y } = indexObject;
      const orderRow = order[y];

      if (!orderRow) {
        return true;
      }

      const orderObject = orderRow[x];

      if (!orderObject) {
        return true;
      }

      const { itemIndexX, itemIndexY } = orderObject;

      if (itemIndexX !== 0 || itemIndexY !== indexY) {
        return true;
      }

      count += 1;
    }

    return false;
  });

  if (count !== keysLen) {
    return true;
  }

  return someBoolItems;
};

export default testItemsUpdate;
