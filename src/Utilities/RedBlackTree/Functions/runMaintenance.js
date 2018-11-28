/* eslint-disable no-param-reassign */

import redBlackBalance from './redBlackBalance';
import getNodeSize from './getNodeSize';
import updateMaxEndpoint from './updateMaxEndpoint';

const runMaintenance = (node) => {
  if (node) {
    node = redBlackBalance(node);
    node.size = getNodeSize(node);
    updateMaxEndpoint(node);
  }

  return node;
};

export default runMaintenance;
