const copyArray2d = (array2d, copyObjects) => {
  const copy = [];

  array2d.forEach((row) => {
    if (row && typeof row === 'object' && row.constructor === Array) {
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
