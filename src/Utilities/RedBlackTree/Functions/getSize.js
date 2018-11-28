// return the node size or 0
const getSize = (node) => {
  if (!node) {
    return 0;
  }

  return node.size;
};

export default getSize;
