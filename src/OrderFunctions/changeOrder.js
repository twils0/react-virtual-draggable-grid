import updatePositions from './updatePositions';

// order must be copied before it is passed to this function
const changeOrder = ({
  order,
  maxRowCount,
  maxColCount,
  fromIndexX,
  fromIndexY,
  toIndexX,
  toIndexY,
  side,
}) => {
  const fromRow = order[fromIndexY];

  if (fromRow) {
    const orderObject = fromRow[fromIndexX];

    if (orderObject) {
      const newFromRow = order[fromIndexY];

      if (newFromRow.length === 1) {
        if (!maxColCount) {
          order.splice(fromIndexY, 1);
        } else {
          newFromRow[fromIndexX] = null;
        }
      } else if (!maxColCount) {
        newFromRow.splice(fromIndexX, 1);
      } else {
        newFromRow[fromIndexX] = null;
      }

      const toRow = order[toIndexY];

      if (!toRow) {
        // maxRowCount and maxColCount props default to 0 (falsy)
        const orderLen = order.length;
        const maxIndexY = !maxRowCount ? orderLen : maxRowCount;
        const limitedIndexY = toIndexY > maxIndexY ? maxIndexY : toIndexY;
        const maxIndexX = maxColCount;
        const limitedIndexX = toIndexX > maxIndexX ? maxIndexX : toIndexX;

        if (!maxRowCount) {
          order[limitedIndexY] = [orderObject]; // eslint-disable-line
        } else {
          order[limitedIndexY] = []; // eslint-disable-line
          order[limitedIndexY][limitedIndexX] = orderObject; // eslint-disable-line
        }
      } else if (maxRowCount && toRow[toIndexX]) {
        // may eventually shift components up and down
        if (side === 'left' || side === 'right') {
          toRow.splice(toIndexX, 0, orderObject);
        }
      } else if (maxRowCount) {
        toRow[toIndexX] = orderObject;
      } else {
        toRow.splice(toIndexX, 0, orderObject);
      }

      const { width, height } = orderObject;
      let indexX = 0;
      let indexY = 0;

      console.log('order', order);

      if (fromIndexX >= toIndexX) {
        indexX = toIndexX;
      } else {
        indexX = fromIndexX;
      }
      if (fromIndexY >= toIndexY) {
        indexY = toIndexY;
      } else {
        indexY = fromIndexY;
      }
      console.log('from', fromIndexX, fromIndexY);
      console.log('to', toIndexX, toIndexY);
      console.log('index', indexX, indexY);

      const updatedOrder = updatePositions({
        order,
        width,
        height,
        indexX,
        indexY,
      });

      return updatedOrder;
    }
  }

  return order;
};

export default changeOrder;
