import React from 'react';
import PropTypes from 'prop-types';

import OrderManager from '../OrderManager';

const handleOrder = jest.fn();
const getMouseIndex = jest.fn();
const changeOrder = jest.fn();
const handleVirtualization = jest.fn();
const findMaxPosition = jest.fn();

require('../OrderManagerFunctions/handleOrder').default = handleOrder;
require('../OrderManagerFunctions/getMouseIndex').default = getMouseIndex;
require('../OrderManagerFunctions/changeOrder').default = changeOrder;
require('../OrderManagerFunctions/handleVirtualization').default = handleVirtualization;
require('../OrderManagerFunctions/findMaxPosition').default = findMaxPosition;

const TestComp = (props) => {
  const { styles, name } = props;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignText: 'center',
        userSelect: 'none',
        width: '50px',
        height: '50px',
        backgroundColor: 'lightblue',
        border: '1px solid black',
        ...styles,
      }}
    >
      {`Test ${name}`}
    </div>
  );
};

TestComp.propTypes = {
  styles: PropTypes.object,
  name: PropTypes.string.isRequired,
};

TestComp.defaultProps = {
  styles: {},
};

const defaultProps = {
  fixedRows: false,
  // fixedColumns: false,
  fixedWidthAll: null,
  fixedHeightAll: null,
  onlyDragElements: [],
  onlyDragIds: [],
  noDragElements: [],
  noDragIds: [],
  gutterX: 0,
  gutterY: 0,
  mouseUpdateTime: 100,
  mouseUpdateX: 50,
  mouseUpdateY: 50,
  leeway: 0.1,
  scrollBufferX: 200,
  scrollBufferY: 200,
  scrollUpdateX: 100,
  scrollUpdateY: 200,
  transitionDuration: '0.3s',
  transitionTimingFunction: 'ease',
  transitionDelay: '0.2s',
  shadowMultiple: 16,
  shadowHRatio: 1,
  shadowVRatio: 1,
  shadowBlur: null,
  shadowBlurRatio: 1.2,
  shadowSpread: null,
  shadowSpreadRatio: 0,
  shadowColor: 'rgba(0, 0, 0, 0.2)',
  WrapperStyles: {},
  GridStyles: {},
  GridItemStyles: {},
  getItems: jest.fn(),
  getVisibleItems: jest.fn(),
};

defaultProps.items = [
  [
    {
      key: 'test-0',
      ItemComponent: TestComp,
      fixedWidth: 100,
      fixedHeight: 100,
      itemProps: {
        name: 'test-0',
        style: { userSelect: 'none', width: 100, height: 100 },
      },
    },
    {
      key: 'test-1',
      ItemComponent: TestComp,
      fixedWidth: 200,
      fixedHeight: 200,
      itemProps: {
        name: 'test-1',
        style: { userSelect: 'none', width: 200, height: 200 },
      },
    },
  ],
  [
    {
      key: 'test-2',
      ItemComponent: TestComp,
      fixedWidth: 300,
      fixedHeight: 300,
      itemProps: {
        name: 'test-2',
        style: { userSelect: 'none', width: 300, height: 300 },
      },
    },
    {
      key: 'test-3',
      ItemComponent: TestComp,
      fixedWidth: 400,
      fixedHeight: 400,
      itemProps: {
        name: 'test-3',
        style: { userSelect: 'none', width: 400, height: 400 },
      },
    },
  ],
  {
    key: 'test-4',
    ItemComponent: TestComp,
    fixedWidth: 500,
    fixedHeight: 500,
    itemProps: {
      name: 'test-4',
      style: { userSelect: 'none', width: 500, height: 500 },
    },
  },
];

const vgdState = {
  fixedColumns: false,
  fixedHeightAll: null,
  fixedRows: false,
  fixedWidthAll: null,
  gutterX: 0,
  gutterY: 0,
  leeway: 0.1,
  scrollBufferX: 200,
  scrollBufferY: 200,
};

vgdState.order = [
  [
    {
      key: 'test-0',
      itemX: 0,
      itemY: 0,
      orderX: 0,
      orderY: 0,
      width: 100,
      height: 100,
      left: 0,
      top: 0,
    },
    {
      key: 'test-1',
      itemX: 1,
      itemY: 0,
      orderX: 1,
      orderY: 0,
      width: 200,
      height: 200,
      left: 100,
      top: 0,
    },
  ],
  [
    {
      key: 'test-2',
      itemX: 0,
      itemY: 1,
      orderX: 0,
      orderY: 1,
      width: 300,
      height: 300,
      left: 0,
      top: 200,
    },
    {
      key: 'test-3',
      itemX: 1,
      itemY: 1,
      orderX: 1,
      orderY: 1,
      width: 400,
      height: 400,
      left: 300,
      top: 0,
    },
  ],
  [
    {
      key: 'test-4',
      itemX: 0,
      itemY: 2,
      orderX: 0,
      orderY: 2,
      width: 500,
      height: 500,
      left: 0,
      top: 500,
    },
  ],
];

vgdState.keys = {
  'test-0': vgdState.order[0][0],
  'test-1': vgdState.order[0][1],
  'test-2': vgdState.order[1][0],
  'test-3': vgdState.order[1][1],
  'test-4': vgdState.order[2][0],
};

vgdState.visibleOrder = [
  ...vgdState.order[0],
  ...vgdState.order[1],
];

const updatedOrder = [
  [vgdState.order[0][1], vgdState.order[0][0]],
  vgdState.order[1],
  vgdState.order[2],
];
const updatedKeys = {
  ...vgdState.keys,
  'test-0': vgdState.order[0][1],
  'test-1': vgdState.order[0][0],
};
const updatedVisibleOrder = [
  vgdState.order[0][1],
  vgdState.order[0][0],
  ...vgdState.order[1],
];
const updatedVisibleItems = [
  defaultProps.items[0][1],
  defaultProps.items[0][0],
  ...defaultProps.items[1],
];
const updatedItems = [
  [defaultProps.items[0][1], defaultProps.items[0][0]],
  defaultProps.items[1],
  defaultProps.items[2],
];

const gridState = {
  pressedItemKey: 'test-0',
  orderX: 0,
  orderY: 0,
  mouseX: 555,
  mouseY: 666,
  containerWidth: 777,
  containerHeight: 888,
  toIndexX: 9,
  toIndexY: 10,
  scrollLeft: 111,
  scrollTop: 112,
};


const getProps = jest.fn(() => defaultProps);
const getVDGState = jest.fn(() => vgdState);
const getGridState = jest.fn(() => gridState);
const updateState = jest.fn();

const orderManager = new OrderManager(
  getProps,
  getVDGState,
  updateState,
);
orderManager.setGridStateCallback(getGridState);

describe('OrderManager', () => {
  afterEach(() => {
    getProps.mockClear();
    getVDGState.mockClear();
    updateState.mockClear();

    handleOrder.mockReset();
    getMouseIndex.mockReset();
    changeOrder.mockReset();
    handleVirtualization.mockReset();
    findMaxPosition.mockReset();

    defaultProps.getVisibleItems.mockReset();
    defaultProps.getItems.mockReset();
  });


  it('setOrder executes correctly', () => {
    handleOrder.mockReturnValue({
      order: defaultProps.order,
      keys: defaultProps.keys,
    });

    const { order, keys } = orderManager.setOrder();

    expect(order).toEqual(defaultProps.order);
    expect(keys).toEqual(defaultProps.keys);
    expect(handleOrder).toBeCalledWith({
      items: defaultProps.items,
      fixedRows: defaultProps.fixedRows,
      fixedColumns: defaultProps.fixedColumns,
      fixedWidthAll: defaultProps.fixedWidthAll,
      fixedHeightAll: defaultProps.fixedHeightAll,
      gutterX: defaultProps.gutterX,
      gutterY: defaultProps.gutterY,
    });
  });

  // also tests updateVisibleOrderNoState
  it('updateOrder executes correctly', () => {
    getMouseIndex.mockReturnValue({
      toIndexX: gridState.toIndexX,
      toIndexY: gridState.toIndexY,
    });
    changeOrder.mockReturnValue({
      order: updatedOrder,
      keys: updatedKeys,
    });
    handleVirtualization.mockReturnValue(updatedVisibleOrder);

    orderManager.updateOrder({
      mouseX: gridState.mouseX,
      mouseY: gridState.mouseY,
    });

    expect(getMouseIndex).toBeCalledWith({
      order: vgdState.order,
      visibleOrder: vgdState.visibleOrder,
      mouseX: gridState.mouseX,
      mouseY: gridState.mouseY,
    });
    expect(changeOrder).toBeCalledWith({
      order: vgdState.order,
      keys: vgdState.keys,
      fixedRows: defaultProps.fixedRows,
      fixedColumns: defaultProps.fixedColumns,
      fixedWidthAll: defaultProps.fixedWidthAll,
      fixedHeightAll: defaultProps.fixedHeightAll,
      gutterX: defaultProps.gutterX,
      gutterY: defaultProps.gutterY,
      fromIndexX: gridState.orderX,
      fromIndexY: gridState.orderY,
      toIndexX: gridState.toIndexX,
      toIndexY: gridState.toIndexY,
    });
    expect(updateState).toBeCalledWith({
      order: updatedOrder,
      keys: updatedKeys,
    });
    expect(handleVirtualization).toBeCalledWith({
      order: updatedOrder,
      keys: updatedKeys,
      containerWidth: gridState.containerWidth,
      containerHeight: gridState.containerHeight,
      scrollLeft: gridState.scrollLeft,
      scrollTop: gridState.scrollTop,
      leeway: defaultProps.leeway,
      scrollBufferX: defaultProps.scrollBufferX,
      scrollBufferY: defaultProps.scrollBufferY,
    });
    expect(updateState).toBeCalledWith({
      visibleOrder: updatedVisibleOrder,
    });
    expect(defaultProps.getVisibleItems).toBeCalledWith(
      updatedVisibleItems,
    );
  });

  // also tests updateVisibleOrderNoState
  it('updateOrder executes correctly; no order 2D array or keys object returned from changeOrder', () => {
    getMouseIndex.mockReturnValue({
      toIndexX: gridState.toIndexX,
      toIndexY: gridState.toIndexY,
    });
    changeOrder.mockReturnValue({});
    handleVirtualization.mockReturnValue(updatedVisibleOrder);

    orderManager.updateOrder({
      mouseX: gridState.mouseX,
      mouseY: gridState.mouseY,
    });

    expect(getMouseIndex).toBeCalledWith({
      order: vgdState.order,
      visibleOrder: vgdState.visibleOrder,
      mouseX: gridState.mouseX,
      mouseY: gridState.mouseY,
    });
    expect(changeOrder).toBeCalledWith({
      order: vgdState.order,
      keys: vgdState.keys,
      fixedRows: defaultProps.fixedRows,
      fixedColumns: defaultProps.fixedColumns,
      fixedWidthAll: defaultProps.fixedWidthAll,
      fixedHeightAll: defaultProps.fixedHeightAll,
      gutterX: defaultProps.gutterX,
      gutterY: defaultProps.gutterY,
      fromIndexX: gridState.orderX,
      fromIndexY: gridState.orderY,
      toIndexX: gridState.toIndexX,
      toIndexY: gridState.toIndexY,
    });
    expect(updateState).not.toBeCalledWith();
    expect(handleVirtualization).not.toBeCalledWith();
    expect(updateState).not.toBeCalled();
    expect(defaultProps.getVisibleItems).not.toBeCalled();
  });

  // also tests updateVisibleOrderNoState
  it('updateVisibleOrder executes correctly', () => {
    getVDGState.mockReturnValueOnce({
      ...vgdState,
      order: updatedOrder,
      keys: updatedKeys,
    });

    handleVirtualization.mockReturnValue(updatedVisibleOrder);

    orderManager.updateVisibleOrder();

    expect(handleVirtualization).toBeCalledWith({
      order: updatedOrder,
      keys: updatedKeys,
      containerWidth: gridState.containerWidth,
      containerHeight: gridState.containerHeight,
      scrollLeft: gridState.scrollLeft,
      scrollTop: gridState.scrollTop,
      leeway: defaultProps.leeway,
      scrollBufferX: defaultProps.scrollBufferX,
      scrollBufferY: defaultProps.scrollBufferY,
    });
    expect(updateState).toBeCalledWith({
      visibleOrder: updatedVisibleOrder,
    });
    expect(defaultProps.getVisibleItems).toBeCalledWith(
      updatedVisibleItems,
    );
  });

  // also tests updateVisibleOrderNoState
  it('updateVisibleOrder executes correctly; items array is empty', () => {
    getVDGState.mockReturnValueOnce({
      ...vgdState,
      order: updatedOrder,
      keys: updatedKeys,
    });
    getProps.mockReturnValueOnce({
      ...defaultProps,
      items: [],
    });

    handleVirtualization.mockReturnValue(updatedVisibleOrder);

    orderManager.updateVisibleOrder();

    expect(handleVirtualization).toBeCalledWith({
      order: updatedOrder,
      keys: updatedKeys,
      containerWidth: gridState.containerWidth,
      containerHeight: gridState.containerHeight,
      scrollLeft: gridState.scrollLeft,
      scrollTop: gridState.scrollTop,
      leeway: defaultProps.leeway,
      scrollBufferX: defaultProps.scrollBufferX,
      scrollBufferY: defaultProps.scrollBufferY,
    });
    expect(updateState).toBeCalledWith({
      visibleOrder: updatedVisibleOrder,
    });
    expect(defaultProps.getVisibleItems).not.toBeCalled();
  });

  it('findMaxPosition executes correctly', () => {
    const maxRight = 100;
    const maxBottom = 200;

    findMaxPosition.mockReturnValue({ maxRight, maxBottom });

    const actualResult = orderManager.findMaxPosition();

    expect(findMaxPosition).toBeCalledWith({
      order: vgdState.order,
      fixedWidthAll: defaultProps.fixedWidthAll,
      fixedHeightAll: defaultProps.fixedHeightAll,
      gutterX: defaultProps.gutterX,
      gutterY: defaultProps.gutterY,
    });
    expect(actualResult.maxRight).toEqual(maxRight);
    expect(actualResult.maxBottom).toEqual(maxBottom);
  });

  it('updateItems executes correctly', () => {
    getVDGState.mockReturnValueOnce({
      ...vgdState,
      order: updatedOrder,
      keys: updatedKeys,
    });

    orderManager.updateItems();

    expect(defaultProps.getItems).toBeCalledWith(updatedItems);
  });

  it('updateItems executes correctly; order 2D array and keys object is empty', () => {
    getVDGState.mockReturnValueOnce({
      ...vgdState,
      order: [],
      keys: {},
    });

    orderManager.updateItems();

    expect(defaultProps.getItems).toBeCalledWith([]);
  });
});
