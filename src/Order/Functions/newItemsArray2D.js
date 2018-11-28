const newItemsArray2D = (items, hashTable) => {
  const newItems = [];
  const valuesArray = Object.values(hashTable);

  valuesArray.forEach((orderNode) => {
    const {
      itemX, itemY, orderX, orderY,
    } = orderNode;
    const arrayBool = Array.isArray(items[itemY]);
    const item = arrayBool ? items[itemY][itemX] : items[itemY];

    if (!arrayBool) {
      newItems[orderY] = item;
    } else if (!newItems[orderY]) {
      newItems[orderY] = [];
      newItems[orderY][orderX] = item;
    } else {
      newItems[orderY][orderX] = item;
    }
  });

  return newItems;
};

export default newItemsArray2D;
