// test if items 1D or 2D array has changed
const testItemsUpdate = ({ items, order }) => {
  if (!order) {
    return true;
  }

  const { size } = order;
  let count = 0;

  const someItemsBool = items.some((itemsRow, indexY) => {
    const row = !Array.isArray(itemsRow) ? [itemsRow] : itemsRow;

    const someRowBool = row.some((item, indexX) => {
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
        const orderNode = order.getKey(item.key);

        // if there's not an orderNode for the item,
        // an update has occurred
        if (!orderNode) {
          console.log(1);
          return true;
        }

        const {
          itemX, itemY, width, height,
        } = orderNode;

        // if the orderNode's item indexes do not
        // match the indexes from the items 1D or 2D array,
        // an update has occurred
        if (itemX !== indexX || itemY !== indexY) {
          console.log(2);
          return true;
        }

        // if the orderNode width and height values do
        // not match the item's fixedWidth or fixedHeight
        // values, an update has occurred
        if (width !== item.fixedWidth || height !== item.fixedHeight) {
          console.log(3);
          return true;
        }

        // count the number of items
        count += 1;
      }

      return false;
    });

    return someRowBool;
  });

  console.log('count', count, size);

  // if the number of items provided doesn't match the
  // size of the RBT, an update has occurred
  if (count !== size) {
    console.log(4);
    // return true;
  }

  return someItemsBool;
};

export default testItemsUpdate;
