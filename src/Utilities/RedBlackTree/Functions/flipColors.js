/* eslint-disable no-param-reassign */

// helper function to flip the colors
// of the node provided and its left
// and right nodes
const flipColors = (node) => {
  if (
    node
    && node.left
    && node.right
    && node.color !== node.left.color
    && node.color !== node.right.color
  ) {
    node.color = !node.color;
    node.left.color = !node.left.color;
    node.right.color = !node.right.color;
  }
};

export default flipColors;
