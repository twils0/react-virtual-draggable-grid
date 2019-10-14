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
  fixedColumns: false,
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

const constructorState = {
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

constructorState.order = [
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

constructorState.keys = {
  'test-0': constructorState.order[0][0],
  'test-1': constructorState.order[0][1],
  'test-2': constructorState.order[1][0],
  'test-3': constructorState.order[1][1],
  'test-4': constructorState.order[2][0],
};

constructorState.visibleOrder = [
  ...constructorState.order[0],
  ...constructorState.order[1],
];

const updatedOrder = [
  [constructorState.order[0][1], constructorState.order[0][0]],
  constructorState.order[1],
  constructorState.order[2],
];
const updatedKeys = {
  ...constructorState.keys,
  'test-0': constructorState.order[0][1],
  'test-1': constructorState.order[0][0],
};
const updatedVisibleOrder = [
  constructorState.order[0][1],
  constructorState.order[0][0],
  ...constructorState.order[1],
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

const pressedItemKey = 'test-0';
const orderX = 0;
const orderY = 0;
const mouseX = 555;
const mouseY = 666;
const containerWidth = 777;
const containerHeight = 888;
const toIndexX = 9;
const toIndexY = 10;
const scrollLeft = 111;
const scrollTop = 112;


const getProps = jest.fn(() => defaultProps);
const getState = jest.fn(() => constructorState);
const updateState = jest.fn();

const orderManager = new OrderManager(
  getProps,
  getState,
  updateState,
);

describe('OrderManager', () => {
  afterEach(() => {
    getProps.mockClear();
    getState.mockClear();
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
      toIndexX,
      toIndexY,
    });
    changeOrder.mockReturnValue({
      order: updatedOrder,
      keys: updatedKeys,
    });
    handleVirtualization.mockReturnValue(updatedVisibleOrder);

    orderManager.updateOrder({
      pressedItemKey,
      mouseX,
      mouseY,
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
    });

    expect(getMouseIndex).toBeCalledWith({
      order: constructorState.order,
      visibleOrder: constructorState.visibleOrder,
      mouseX,
      mouseY,
    });
    expect(changeOrder).toBeCalledWith({
      order: constructorState.order,
      keys: constructorState.keys,
      fixedRows: defaultProps.fixedRows,
      fixedColumns: defaultProps.fixedColumns,
      fixedWidthAll: defaultProps.fixedWidthAll,
      fixedHeightAll: defaultProps.fixedHeightAll,
      gutterX: defaultProps.gutterX,
      gutterY: defaultProps.gutterY,
      fromIndexX: orderX,
      fromIndexY: orderY,
      toIndexX,
      toIndexY,
    });
    expect(updateState).toBeCalledWith({
      order: updatedOrder,
      keys: updatedKeys,
    });
    expect(handleVirtualization).toBeCalledWith({
      order: updatedOrder,
      keys: updatedKeys,
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
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
  it('updateOrder executes correctly; '
      + 'no order 2D array or keys object returned from changeOrder', () => {
    getMouseIndex.mockReturnValue({
      toIndexX,
      toIndexY,
    });
    changeOrder.mockReturnValue({});
    handleVirtualization.mockReturnValue(updatedVisibleOrder);

    orderManager.updateOrder({
      pressedItemKey,
      mouseX,
      mouseY,
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
    });

    expect(getMouseIndex).toBeCalledWith({
      order: constructorState.order,
      visibleOrder: constructorState.visibleOrder,
      mouseX,
      mouseY,
    });
    expect(changeOrder).toBeCalledWith({
      order: constructorState.order,
      keys: constructorState.keys,
      fixedRows: defaultProps.fixedRows,
      fixedColumns: defaultProps.fixedColumns,
      fixedWidthAll: defaultProps.fixedWidthAll,
      fixedHeightAll: defaultProps.fixedHeightAll,
      gutterX: defaultProps.gutterX,
      gutterY: defaultProps.gutterY,
      fromIndexX: orderX,
      fromIndexY: orderY,
      toIndexX,
      toIndexY,
    });
    expect(updateState).not.toBeCalledWith();
    expect(handleVirtualization).not.toBeCalledWith();
    expect(updateState).not.toBeCalled();
    expect(defaultProps.getVisibleItems).not.toBeCalled();
  });

  // also tests updateVisibleOrderNoState
  it('updateVisibleOrder executes correctly', () => {
    getState.mockReturnValueOnce({
      ...constructorState,
      order: updatedOrder,
      keys: updatedKeys,
    });

    handleVirtualization.mockReturnValue(updatedVisibleOrder);

    orderManager.updateVisibleOrder({
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
    });

    expect(handleVirtualization).toBeCalledWith({
      order: updatedOrder,
      keys: updatedKeys,
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
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
  it('updateVisibleOrder executes correctly; '
      + 'items array is empty', () => {
    getState.mockReturnValueOnce({
      ...constructorState,
      order: updatedOrder,
      keys: updatedKeys,
    });
    getProps.mockReturnValueOnce({
      ...defaultProps,
      items: [],
    });

    handleVirtualization.mockReturnValue(updatedVisibleOrder);

    orderManager.updateVisibleOrder({
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
    });

    expect(handleVirtualization).toBeCalledWith({
      order: updatedOrder,
      keys: updatedKeys,
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
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
      order: constructorState.order,
      fixedWidthAll: defaultProps.fixedWidthAll,
      fixedHeightAll: defaultProps.fixedHeightAll,
      gutterX: defaultProps.gutterX,
      gutterY: defaultProps.gutterY,
    });
    expect(actualResult.maxRight).toEqual(maxRight);
    expect(actualResult.maxBottom).toEqual(maxBottom);
  });

  it('updateItems executes correctly', () => {
    getState.mockReturnValueOnce({
      ...constructorState,
      order: updatedOrder,
      keys: updatedKeys,
    });

    orderManager.updateItems();

    expect(defaultProps.getItems).toBeCalledWith(updatedItems);
  });

  it('updateItems executes correctly; '
      + 'order 2D array and keys object is empty', () => {
    getState.mockReturnValueOnce({
      ...constructorState,
      order: [],
      keys: {},
    });

    orderManager.updateItems();

    expect(defaultProps.getItems).toBeCalledWith([]);
  });
});
