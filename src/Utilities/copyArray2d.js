const copyArray2d = (array2d, indexY, copyObjects) => {
  const copy = [];

  array2d.forEach((row, iY) => {
    if (iY < indexY) {
      copy.push(row);
    } else if (row && Array.isArray(row)) {
      const newRow = [];

      row.forEach((object) => {
        newRow.push(copyObjects ? { ...object } : object);
      });

      copy.push(newRow);
    } else {
      copy.push({ ...row });
    }
  });

  return copy;
};

export default copyArray2d;
