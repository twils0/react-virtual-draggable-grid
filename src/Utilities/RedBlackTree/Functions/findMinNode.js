// find the minimum node
const findMinNode = (node) => {
  if (node.left) {
    return findMinNode(node.left);
  }

  return node;
};

export default findMinNode;
