const recursiveFind = (array, key, value) => {
  const arrayLen = array.length;
  const halfArrayLen = Math.floor(arrayLen);
  const halfValue = array[halfArrayLen][key];

  if (array.length === 1) {
    return array[0];
  }

  if (halfValue === value) {
    return array[halfArrayLen];
  }

  if (halfValue > value) {
    const halfArray = array.slice(halfArrayLen);
    return recursiveFind(halfArray, key, value);
  }

  const halfArray = array.slice(0, halfArrayLen);
  return recursiveFind(halfArray, key, value);
};
