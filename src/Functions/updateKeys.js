const updateKeys = ({
  order, keys, fromIndexX, fromIndexY, toIndexX, toIndexY,
}) => {
  const newKeys = { ...keys };
  const fromRow = order[fromIndexY];
  const fromX = fromIndexX - 1 > 0 ? fromIndexX - 1 : 0;

  if (fromRow) {
    for (let iX = fromX; iX < fromRow.length; iX += 1) {
      const orderObject = fromRow[iX];

      newKeys[orderObject.key] = { x: iX, y: fromIndexY };
    }
  } else {
    for (let iY = fromIndexY - 1; iY < order.length; iY += 1) {
      const row = order[iY];
      for (let iX = fromX; iX < row.length; iX += 1) {
        const orderObject = row[iX];

        newKeys[orderObject.key] = { x: iX, y: iY };
      }
    }
  }

  const toRow = order[toIndexY];
  const toX = toIndexX - 1 > 0 ? toIndexX - 1 : 0;

  for (let iX = toX; iX < toRow.length; iX += 1) {
    const orderObject = toRow[iX];

    newKeys[orderObject.key] = { x: iX, y: toIndexY };
  }

  return newKeys;
};

export default updateKeys;
