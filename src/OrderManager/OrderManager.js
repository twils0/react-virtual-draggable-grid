
import handleOrder from './OrderManagerFunctions/handleOrder';
import getMouseIndex from './OrderManagerFunctions/getMouseIndex';
import changeOrder from './OrderManagerFunctions/changeOrder';
import handleVirtualization from './OrderManagerFunctions/handleVirtualization';
import testItemsUpdate from './OrderManagerFunctions/testItemsUpdate';
import findMaxPosition from './OrderManagerFunctions/findMaxPosition';

class Order {
  constructor(
    getPropsCallback,
    getStateCallback,
    updateStateCallback,
  ) {
    this.getProps = getPropsCallback;
    this.getState = getStateCallback;
    this.updateState = updateStateCallback;
  }

  setOrder = () => {
    const {
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    } = this.getProps();

    const { order, keys } = handleOrder({
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    return { order, keys };
  };

  testItemsUpdate = () => {
    const {
      items,
      fixedWidthAll,
      fixedHeightAll,
    } = this.getProps();
    const {
      order,
      keys,
    } = this.getState();

    return Array.isArray(items)
    && items.length > 0
    && testItemsUpdate({
      items,
      order,
      keys,
      fixedWidthAll,
      fixedHeightAll,
    });
  }

  // update the order 2D array, to change the position of items
  updateOrder = ({
    pressedItemKey,
    mouseX,
    mouseY,
    containerWidth,
    containerHeight,
    scrollLeft,
    scrollTop,
  }) => {
    const {
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    } = this.getProps();
    const {
      visibleOrder,
      order,
      keys,
    } = this.getState();

    const orderObject = keys[pressedItemKey];

    if (orderObject) {
      const { orderX, orderY } = orderObject;

      const { toIndexX, toIndexY } = getMouseIndex({
        order,
        visibleOrder,
        mouseX,
        mouseY,
      });

      if (
        toIndexX > -1 && toIndexY > -1
        && (toIndexX !== orderX || toIndexY !== orderY)
      ) {
        // changeOrder handles the actual repositioning;
        // it updates only the orderObjects it must,
        // based on the to and from indexes
        const newOrderKeysObject = changeOrder({
          order,
          keys,
          fixedRows,
          fixedColumns,
          fixedWidthAll,
          fixedHeightAll,
          gutterX,
          gutterY,
          fromIndexX: orderX,
          fromIndexY: orderY,
          toIndexX,
          toIndexY,
        });

        if (newOrderKeysObject.order
          && newOrderKeysObject.keys
        ) {
          // callback to update state on VirtualDraggableGrid component
          this.updateState(newOrderKeysObject);

          // need to update visible order if order has changed
          this.updateVisibleOrderNoState({
            containerWidth,
            containerHeight,
            scrollLeft,
            scrollTop,
            ...newOrderKeysObject,
          });
        }
      }
    }
  };

  // calls updateVisibleOrderNoState; provides order and keys
  // arguments from state
  updateVisibleOrder = ({
    containerWidth,
    containerHeight,
    scrollLeft,
    scrollTop,
  }) => {
    const {
      order,
      keys,
    } = this.getState();

    this.updateVisibleOrderNoState({
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
      order,
      keys,
    });
  }

  // call handleVirtualization to render visible and buffer grid items;
  // provide visible and buffer grid items to getVisibleItems callback;
  // must provide order and keys as arguments
  updateVisibleOrderNoState = ({
    containerWidth,
    containerHeight,
    scrollLeft,
    scrollTop,
    order,
    keys,
  }) => {
    const {
      items,
      leeway,
      scrollBufferX,
      scrollBufferY,
      getVisibleItems,
    } = this.getProps();

    // get only the orderObjects corresponding to visible grid items and
    // a limited number of unseen grid items, as a buffer for scrolling
    const visibleOrder = handleVirtualization({
      order,
      keys,
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
      leeway,
      scrollBufferX,
      scrollBufferY,
    });

    // callback to update state on VirtualDraggableGrid component
    this.updateState({ visibleOrder });

    if (
      typeof getVisibleItems === 'function'
        && Array.isArray(items)
        && items.length > 0
        && visibleOrder
    ) {
      const visibleItems = visibleOrder.map(
        ({ itemX, itemY }) => (
          Array.isArray(items[itemY])
            ? items[itemY][itemX]
            : items[itemY]
        ),
      );

      // callback returning current visibleItems, when visibleOrder changes
      getVisibleItems(visibleItems);
    }
  }

  findMaxPosition = () => {
    const {
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    } = this.getProps();
    const {
      order,
    } = this.getState();

    console.log('test');

    return findMaxPosition({
      order,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });
  }

  // callback to return a 1D or 2D array of reordered items;
  // some items may have been ignored when initially processed
  // by handleOrder above, and these items will not be included below
  updateItems = () => {
    const { items, getItems } = this.getProps();
    const { order } = this.getState();
    const newItems = [];

    order.forEach((orderRow, orderY) => {
      const orderRowLen = orderRow.length;

      orderRow.forEach((orderObject, orderX) => {
        const { itemX, itemY } = orderObject;
        const item = Array.isArray(items[itemY])
          ? items[itemY][itemX]
          : items[itemY];

        if (orderRowLen === 1) {
          newItems[orderY] = item;
        } else if (!newItems[orderY]) {
          newItems[orderY] = [];
          newItems[orderY][orderX] = item;
        } else {
          newItems[orderY][orderX] = item;
        }
      });
    });

    if (typeof getItems === 'function') {
      getItems(newItems);
    }
  };
}

export default Order;
