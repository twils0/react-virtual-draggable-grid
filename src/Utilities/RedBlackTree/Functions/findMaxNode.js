// find the maximum node
const findMaxNode = (node) => {
  if (node.right) {
    return findMaxNode(node.right);
  }

  return node;
};

export default findMaxNode;
