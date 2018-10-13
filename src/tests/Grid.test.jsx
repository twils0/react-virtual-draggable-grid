import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import Grid from '../Grid';

import getMouseIndex from '../Functions/getMouseIndex';
import changeOrder from '../Functions/changeOrder';
import handleVirtualization from '../Functions/handleVirtualization';

global.addEventListener = jest.fn();
global.removeEventListener = jest.fn();

jest.mock('../Functions/getMouseIndex', () => jest.fn());
jest.mock('../Functions/changeOrder', () => jest.fn());
jest.mock('../Functions/handleVirtualization', () => jest.fn());

const shallowComponent = (props, options) => shallow(<Grid {...props} />, options);

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
  items: [[
    {
      key: 'test-0',
      ItemComponent: TestComp,
      itemProps: {
        name: 'test-0',
        style: { userSelect: 'none', width: 100, height: 100 },
      },
    },
    {
      key: 'test-1',
      ItemComponent: TestComp,
      itemProps: {
        name: 'test-1',
        style: { userSelect: 'none', width: 200, height: 200 },
      },
    },
  ], [
    {
      key: 'test-2',
      ItemComponent: TestComp,
      itemProps: {
        name: 'test-2',
        style: { userSelect: 'none', width: 300, height: 300 },
      },
    },
    {
      key: 'test-3',
      ItemComponent: TestComp,
      itemProps: {
        name: 'test-3',
        style: { userSelect: 'none', width: 400, height: 400 },
      },
    },
  ],
  {
    key: 'test-4',
    ItemComponent: TestComp,
    itemProps: {
      name: 'test-4',
      style: { userSelect: 'none', width: 500, height: 500 },
    },
  }],
  order: [[
    {
      key: 'test-0', itemX: 0, itemY: 0, width: 100, height: 100, left: 0, top: 0,
    },
    {
      key: 'test-1', itemX: 1, itemY: 0, width: 200, height: 200, left: 100, top: 0,
    },
  ], [
    {
      key: 'test-2', itemX: 0, itemY: 1, width: 300, height: 300, left: 0, top: 200,
    },
    {
      key: 'test-3', itemX: 1, itemY: 1, width: 400, height: 400, left: 300, top: 0,
    },
  ], [{
    key: 'test-4', itemX: 0, itemY: 2, width: 500, height: 500, left: 0, top: 500,
  }]],
  keys: {
    'test-0': { orderX: 0, orderY: 0 },
    'test-1': { orderX: 1, orderY: 0 },
    'test-2': { orderX: 0, orderY: 1 },
    'test-3': { orderX: 1, orderY: 1 },
    'test-4': { orderX: 0, orderY: 2 },
  },
  GridStyles: {},
  GridItemStyles: {},
  springSettings: { stiffness: 300, damping: 50 },
  updateSize: jest.fn(),
  updateOrderKeys: jest.fn(),
  updateItems: jest.fn(),
};

const defaultState = {
  isPressed: false,
  pressedItemKey: '',
  leftDeltaX: -1,
  topDeltaY: -1,
  mouseX: -1,
  mouseY: -1,
  visibleOrder: [],
};

describe('Grid', () => {
  beforeAll(() => {
    TransitionMotion.mockClear();
  });

  afterEach(() => {
    global.addEventListener.mockReset();
    global.removeEventListener.mockReset();
    defaultProps.updateSize.mockReset();
    defaultProps.updateOrderKeys.mockReset();
    defaultProps.updateItems.mockReset();
    getMouseIndex.mockReset();
    changeOrder.mockReset();
    handleVirtualization.mockReset();
  });

  it('renders correctly', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    expect(instanceProps).toEqual(defaultProps);
    expect(wrapper).toMatchSnapshot();
  });

  it('componentDidMount, componentDidUpdate, and componentWillUnmount execute correctly', () => {
    const wrapper = shallowComponent(defaultProps, { disableLifecycleMethods: true });
    const instance = wrapper.instance();
    const instanceProps = instance.props;
    const {
      handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd,
    } = instance;

    instance.updateGridSize = jest.fn();

    instance.componentDidMount();
    instance.componentDidUpdate();
    instance.componentWillUnmount();

    expect(instanceProps).toEqual(defaultProps);

    expect(global.addEventListener).toHaveBeenCalledTimes(4);
    expect(global.addEventListener).toBeCalledWith('mousemove', handleMouseMove);
    expect(global.addEventListener).toBeCalledWith('touchmove', handleTouchMove, false);
    expect(global.addEventListener).toBeCalledWith('mouseup', handleMouseUp);
    expect(global.addEventListener).toBeCalledWith('touchend', handleTouchEnd, false);

    expect(global.removeEventListener).toHaveBeenCalledTimes(4);
    expect(global.removeEventListener).toBeCalledWith('mousemove', handleMouseMove);
    expect(global.removeEventListener).toBeCalledWith('touchmove', handleTouchMove);
    expect(global.removeEventListener).toBeCalledWith('mouseup', handleMouseUp);
    expect(global.removeEventListener).toBeCalledWith('touchend', handleTouchEnd);

    expect(instance.updateGridSize).toHaveBeenCalledTimes(2);
  });

  it('handleMouseDown executes correctly', () => {
    const id = defaultProps.items[0][0].key;
    const dataset = { x: '400', y: '500' };
    const mouseDownEvent = {
      pageX: 1000,
      pageY: 1500,
      target: {
        className: 'not-correct',
        parentElement: {
          className: 'not-correct',
          parentElement: {
            className: 'rvdl-grid-item',
            id,
            dataset,
          },
        },
      },
    };
    const x = parseFloat(dataset.x);
    const y = parseFloat(dataset.y);

    const updatedState = {
      ...defaultState,
      isPressed: true,
      pressedItemKey: id,
      leftDeltaX: mouseDownEvent.pageX - x,
      topDeltaY: mouseDownEvent.pageY - y,
      mouseX: x,
      mouseY: y,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.handleMouseDown(mouseDownEvent);

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
  });

  it('handleTouchStart executes correctly', () => {
    const touch = { test: 'touch' };
    const touchEvent = {
      preventDefault: jest.fn(),
      changedTouches: [touch],
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;
    instance.handleMouseDown = jest.fn();

    const result = instance.handleTouchStart(touchEvent);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(false);
    expect(touchEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(instance.handleMouseDown).toHaveBeenCalledTimes(1);
    expect(instance.handleMouseDown).toBeCalledWith(touch);
  });

  it('handleMouseMove executes correctly', () => {
    const id = defaultProps.items[0][0].key;
    const keyObject = defaultProps.keys[id];
    const toIndexX = 1;
    const toIndexY = 1;
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 1000;
    const containerHeight = 1000;

    const mouseMoveEvent = {
      pageX: 1010,
      pageY: 1520,
    };

    const startingState = {
      ...defaultState,
      isPressed: true,
      pressedItemKey: id,
      leftDeltaX: 600,
      topDeltaY: 1000,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
    };

    const orderKeysObject = {
      order: [
        [defaultProps.order[0][1]],
        [defaultProps.order[1][0], defaultProps.order[0][0], defaultProps.order[1][1]],
        [defaultProps.order[2][0]],
      ],
      keys: {
        [defaultProps.items[0][0].key]: { orderX: 1, orderY: 1 },
        [defaultProps.items[0][1].key]: { orderX: 0, orderY: 0 },
        [defaultProps.items[1][0].key]: { orderX: 0, orderY: 1 },
        [defaultProps.items[1][1].key]: { orderX: 2, orderY: 1 },
        [defaultProps.items[2].key]: { orderX: 0, orderY: 2 },
      },
    };
    const { keys } = orderKeysObject;

    const visibleOrder = Object.keys(keys).map(key => keys[key]);

    const updatedState = {
      ...startingState,
      mouseX: mouseMoveEvent.pageX - startingState.leftDeltaX,
      mouseY: mouseMoveEvent.pageY - startingState.topDeltaY,
      visibleOrder,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    getMouseIndex.mockReturnValue({ toIndexX, toIndexY });
    changeOrder.mockReturnValue(orderKeysObject);
    handleVirtualization.mockReturnValue(visibleOrder);

    instance.handleMouseMove(mouseMoveEvent);

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
    expect(getMouseIndex).toHaveBeenCalledTimes(1);
    expect(getMouseIndex).toBeCalledWith({
      order: defaultProps.order,
      mouseX: updatedState.mouseX,
      mouseY: updatedState.mouseY,
    });
    expect(changeOrder).toHaveBeenCalledTimes(1);
    expect(changeOrder).toBeCalledWith({
      order: defaultProps.order,
      keys: defaultProps.keys,
      fromIndexX: keyObject.orderX,
      fromIndexY: keyObject.orderY,
      toIndexX,
      toIndexY,
    });
    expect(handleVirtualization).toHaveBeenCalledTimes(1);
    expect(handleVirtualization).toBeCalledWith({
      ...orderKeysObject, scrollLeft, scrollTop, containerWidth, containerHeight,
    });
    expect(defaultProps.updateOrderKeys).toHaveBeenCalledTimes(1);
    expect(defaultProps.updateOrderKeys).toBeCalledWith(orderKeysObject);
  });

  it('handleTouchMove executes correctly, when isPressed is true', () => {
    const touch = { test: 'touch' };
    const touchEvent = {
      preventDefault: jest.fn(),
      changedTouches: [touch],
    };

    const startingState = {
      ...defaultState,
      isPressed: true,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleMouseMove = jest.fn();

    const result = instance.handleTouchMove(touchEvent);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(false);
    expect(touchEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(instance.handleMouseMove).toHaveBeenCalledTimes(1);
    expect(instance.handleMouseMove).toBeCalledWith(touch);
  });

  it('handleTouchMove executes correctly, when isPressed is false', () => {
    const touch = { test: 'touch' };
    const touchEvent = {
      preventDefault: jest.fn(),
      changedTouches: [touch],
    };

    const startingState = {
      ...defaultState,
      isPressed: false,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleMouseMove = jest.fn();

    const result = instance.handleTouchMove(touchEvent);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });

  it('handleMouseUp executes correctly', () => {
    const id = defaultProps.items[0][0].key;
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 1000;
    const containerHeight = 1000;

    const startingState = {
      ...defaultState,
      isPressed: true,
      pressedItemKey: id,
      leftDeltaX: 600,
      topDeltaY: 1000,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
    };

    const updatedState = {
      ...startingState,
      isPressed: false,
      leftDeltaX: 0,
      topDeltaY: 0,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleMouseUp();

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
    expect(defaultProps.updateItems).toHaveBeenCalledTimes(1);
  });

  it('handleTouchEnd executes correctly, when isPressed is true', () => {
    const touch = { test: 'touch' };
    const touchEvent = {
      preventDefault: jest.fn(),
      changedTouches: [touch],
    };

    const startingState = {
      ...defaultState,
      isPressed: true,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleMouseUp = jest.fn();

    const result = instance.handleTouchEnd(touchEvent);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(false);
    expect(touchEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(instance.handleMouseUp).toHaveBeenCalledTimes(1);
  });

  it('handleTouchEnd executes correctly, when isPressed is false', () => {
    const touchEvent = {
      preventDefault: jest.fn(),
    };

    const startingState = {
      ...defaultState,
      isPressed: false,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleMouseUp = jest.fn();

    const result = instance.handleTouchEnd(touchEvent);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });

  it('willEnter executes correctly', () => {
    const item = {
      style: {
        x: {
          val: 100,
        },
        y: {
          val: 200,
        },
        zIndex: 1,
      },
    };

    const expectedResult = {
      opacity: 0,
      x: item.style.x.val,
      y: item.style.y.val,
      zIndex: item.style.zIndex,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.willEnter(item);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(expectedResult);
  });

  it('willLeave executes correctly', () => {
    const item = {
      style: {
        x: 100,
        y: 200,
      },
    };

    const expectedResult = {
      opacity: 0,
      x: item.style.x,
      y: item.style.y,
    };


    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.willLeave(item);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(expectedResult);
  });

  it('handleStyle executes correctly, isPressed is false, row is an array', () => {
    const styles = [];
    const item = defaultProps.items[0][0];
    const orderObject = defaultProps.order[0][0];
    const {
      left, top,
    } = orderObject;

    const startingState = {
      ...defaultState,
      isPressed: false,
      mouseX: 200,
      mouseY: 300,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleStyle(styles, orderObject);

    expect(instanceProps).toEqual(defaultProps);
    expect(styles).toEqual([{
      key: `key-${item.key}`,
      data: {
        item,
        orderObject,
      },
      style: {
        opacity: 1,
        shadow: 0,
        x: left,
        y: top,
        zIndex: 1,
      },
    }]);
  });

  it('handleStyle executes correctly, isPressed is true, row is not an array', () => {
    const styles = [];
    const item = defaultProps.items[2];
    const pressedItemKey = item.key;
    const orderObject = defaultProps.order[2][0];

    const startingState = {
      ...defaultState,
      isPressed: true,
      pressedItemKey,
      mouseX: 200,
      mouseY: 300,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleStyle(styles, orderObject);

    expect(instanceProps).toEqual(defaultProps);
    expect(styles).toEqual([{
      key: `key-${item.key}`,
      data: {
        item,
        orderObject,
      },
      style: {
        opacity: 1,
        shadow: 16,
        x: startingState.mouseX,
        y: startingState.mouseY,
        zIndex: 99,
      },
    }]);
  });

  it('generateStyles executes correctly', () => {
    const { items, keys } = defaultProps;
    const item = items[2];
    const pressedItemKey = item.key;
    const visibleOrder = Object.keys(keys).map(key => keys[key]);


    const startingState = {
      ...defaultState,
      pressedItemKey,
      visibleOrder,
    };

    const expectedStyles = Object.keys(keys).map(key => key);
    const pop = expectedStyles.pop();
    expectedStyles.splice(0, 0, pop);

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleStyle = jest.fn(
      (styleArray, orderObject) => styleArray.push(orderObject.key),
    );

    const result = instance.generateStyles();

    expect(instanceProps).toEqual(defaultProps);
    expect(instance.handleStyle).toHaveBeenCalledTimes(5);
    expect(result).toEqual(expectedStyles);
  });

  it('renderList renders correctly', () => {
    const styles = [
      {
        key: 'test-0',
        data: { test: 'data0' },
        style: { test: 'style0' },
      },
      {
        key: 'test-1',
        data: { test: 'data1' },
        style: { test: 'style1' },
      },
    ];

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.renderList(styles);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toMatchSnapshot();
  });
});
