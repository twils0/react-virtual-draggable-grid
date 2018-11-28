import getSize from './getSize';

// get the size of node using
// left and right nodes and rbt
const getNodeSize = (node) => {
  if (!node) {
    return 0;
  }

  if (node.value && node.value.size) {
    // left and right node plus one for current node plus nodes in rbt
    return getSize(node.left) + getSize(node.right) + node.value.size;
  }

  return getSize(node.left) + getSize(node.right) + 1;
};

export default getNodeSize;
