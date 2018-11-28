class OrderNode {
  constructor(itemX, itemY, item) {
    const { key, fixedWidth, fixedHeight } = item;

    this.key = key;
    this.itemX = itemX;
    this.itemY = itemY;
    this.orderX = itemX;
    this.orderY = itemY;
    this.left = null;
    this.top = null;
    this.width = fixedWidth;
    this.height = fixedHeight;
  }
}

export default OrderNode;
