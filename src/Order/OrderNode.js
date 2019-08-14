class OrderNode {
  constructor(itemX, itemY, item) {
    if (item) {
      const { key, fixedWidth, fixedHeight } = item;
      
      this.key = key;
      this.width = fixedWidth;
      this.height = fixedHeight;
    }

    this.itemX = itemX;
    this.itemY = itemY;
    this.orderX = itemX;
    this.orderY = itemY;
    this.left = null;
    this.top = null;

  }
}

export default OrderNode;
