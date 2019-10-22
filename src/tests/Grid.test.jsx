import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import Grid from '../Grid';


global.addEventListener = jest.fn();
global.removeEventListener = jest.fn();

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
  name: PropTypes.string,
};

TestComp.defaultProps = {
  styles: {},
  name: '',
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
  GridStyles: {},
  GridItemStyles: {},
};

defaultProps.items = [[
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
}];

defaultProps.order = [[
  {
    key: 'test-0', itemX: 0, itemY: 0, orderX: 0, orderY: 0, width: 100, height: 100, left: 0, top: 0,
  },
  {
    key: 'test-1', itemX: 1, itemY: 0, orderX: 1, orderY: 0, width: 200, height: 200, left: 100, top: 0,
  },
], [
  {
    key: 'test-2', itemX: 0, itemY: 1, orderX: 0, orderY: 1, width: 300, height: 300, left: 0, top: 200,
  },
  {
    key: 'test-3', itemX: 1, itemY: 1, orderX: 1, orderY: 1, width: 400, height: 400, left: 300, top: 0,
  },
], [{
  key: 'test-4', itemX: 0, itemY: 2, orderX: 0, orderY: 2, width: 500, height: 500, left: 0, top: 500,
}]];

defaultProps.keys = {
  'test-0': defaultProps.order[0][0],
  'test-1': defaultProps.order[0][1],
  'test-2': defaultProps.order[1][0],
  'test-3': defaultProps.order[1][1],
  'test-4': defaultProps.order[2][0],
};

defaultProps.visibleOrder = Object.keys(defaultProps.keys)
  .map(key => defaultProps.keys[key]);

defaultProps.orderManager = {
  setGridStateCallback: jest.fn(),
  updateVisibleOrder: jest.fn(),
  updateOrder: jest.fn(),
  updateItems: jest.fn(),
  findMaxPosition: jest.fn(),
};


const defaultState = {
  containerWidth: -1,
  containerHeight: -1,
  scrollLeft: -1,
  scrollTop: -1,
  prevScrollLeft: -1,
  prevScrollTop: -1,
  isPressed: false,
  pressedItemKey: '',
  prevPressedItemKey: '',
  leftDeltaX: -1,
  topDeltaY: -1,
  mouseX: -1,
  mouseY: -1,
};

describe('Grid', () => {
  afterEach(() => {
    global.addEventListener.mockReset();
    global.removeEventListener.mockReset();
    defaultProps.orderManager.setGridStateCallback.mockReset();
    defaultProps.orderManager.updateVisibleOrder.mockReset();
    defaultProps.orderManager.updateOrder.mockReset();
  });

  it('renders correctly', () => {
    const {
      order,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    } = defaultProps;
    const maxRight = 700;
    const maxBottom = 1000;

    defaultProps.orderManager.findMaxPosition
      .mockReturnValue({
        maxRight,
        maxBottom,
      });

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    expect(instanceProps).toEqual(defaultProps);
    expect(defaultProps.orderManager.setGridStateCallback)
      .toHaveBeenCalledWith(instance.getGridState);
    expect(defaultProps.orderManager.findMaxPosition)
      .toHaveBeenCalledWith({
        order,
        fixedWidthAll,
        fixedHeightAll,
        gutterX,
        gutterY,
      });
    expect(wrapper).toMatchSnapshot();
  });

  it('componentDidMount, componentDidUpdate, and componentWillUnmount execute correctly, no updates on componentDidUpdate', () => {
    const wrapper = shallowComponent(defaultProps, { disableLifecycleMethods: true });
    const instance = wrapper.instance();

    const {
      handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd,
    } = instance;

    instance.updateGridSize = jest.fn();

    instance.componentDidMount();
    instance.componentDidUpdate(defaultProps, defaultState);
    instance.componentWillUnmount();

    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(defaultState);

    expect(global.addEventListener).toHaveBeenCalledTimes(5);
    expect(global.addEventListener).toBeCalledWith('mousemove', handleMouseMove);
    expect(global.addEventListener).toBeCalledWith('touchmove', handleTouchMove, false);
    expect(global.addEventListener).toBeCalledWith('mouseup', handleMouseUp);
    expect(global.addEventListener).toBeCalledWith('touchend', handleTouchEnd, false);

    expect(global.removeEventListener).toHaveBeenCalledTimes(5);
    expect(global.removeEventListener).toBeCalledWith('mousemove', handleMouseMove);
    expect(global.removeEventListener).toBeCalledWith('touchmove', handleTouchMove);
    expect(global.removeEventListener).toBeCalledWith('mouseup', handleMouseUp);
    expect(global.removeEventListener).toBeCalledWith('touchend', handleTouchEnd);

    expect(instance.updateGridSize).toHaveBeenCalledTimes(2);
  });

  it('componentDidUpdate executes correctly, update needed', () => {
    const {
      scrollLeft,
      scrollTop,
    } = defaultState;
    const containerWidth = 100;
    const containerHeight = 200;
    const prevScrollLeft = 300;
    const prevScrollTop = 400;

    const updatedState = {
      ...defaultState,
      containerWidth,
      containerHeight,
      prevScrollLeft,
      prevScrollTop,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();

    instance.updateGridSize = jest.fn();

    instance.setState(updatedState);

    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
    expect(instance.updateGridSize).toHaveBeenCalledTimes(1);
    expect(defaultProps.orderManager.updateVisibleOrder)
      .toHaveBeenCalledTimes(1);
  });

  it('handleMouseDown executes correctly', () => {
    const id = defaultProps.items[0][0].key;
    const dataset = { x: '400', y: '500' };
    const mouseDownEvent = {
      pageX: 1000,
      pageY: 1500,
      target: {
        id: 'testId',
        nodeName: 'BUTTON',
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
        'test-0': defaultProps.order[0][1],
        'test-1': defaultProps.order[1][0],
        'test-2': defaultProps.order[0][0],
        'test-3': defaultProps.order[1][1],
        'test-4': defaultProps.order[2][0],
      },
    };

    const updatedState = {
      ...startingState,
      mouseX: mouseMoveEvent.pageX - startingState.leftDeltaX,
      mouseY: mouseMoveEvent.pageY - startingState.topDeltaY,
    };

    defaultProps.orderManager.updateOrder
      .mockReturnValue(orderKeysObject);

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleMouseMove(mouseMoveEvent);

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
    expect(defaultProps.orderManager.updateOrder)
      .toHaveBeenCalledTimes(1);
    expect(defaultProps.orderManager.updateOrder)
      .toBeCalledWith({
        mouseX: updatedState.mouseX,
        mouseY: updatedState.mouseY,
      });
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
      prevPressedItemKey: 'test-0',
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleMouseUp();

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
    expect(defaultProps.orderManager.updateItems)
      .toHaveBeenCalledTimes(1);
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

  it('handleScroll executes correctly', () => {
    const scrollLeft = 20;
    const scrollTop = 30;
    const event = {
      target: {
        scrollLeft,
        scrollTop,
      },
    };
    const update = {
      scrollLeft,
      scrollTop,
    };

    const expectedState = {
      ...defaultState,
      ...update,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.handleScroll(event);

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(expectedState);
  });

  it('updateGridSize executes correctly', () => {
    const offsetWidth = 100;
    const offsetHeight = 200;
    const update = {
      containerWidth: offsetWidth,
      containerHeight: offsetHeight,
    };

    const expectedState = {
      ...defaultState,
      ...update,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();

    instance.gridRef = { current: { offsetWidth, offsetHeight } };

    instance.updateGridSize();

    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(expectedState);
  });

  it('handleStyle executes correctly, isPressed is false, row is an array', () => {
    const styles = [];
    const item = defaultProps.items[0][0];
    const orderObject = defaultProps.order[0][0];
    const {
      left, top,
    } = orderObject;

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.handleStyle({ styles, orderObject });

    expect(instanceProps).toEqual(defaultProps);
    expect(styles).toEqual([{
      key: `key-${item.key}`,
      data: {
        item,
      },
      style: {
        isPressed: false,
        wasPressed: false,
        width: 100,
        height: 100,
        x: left,
        y: top,
      },
    }]);
  });

  it('handleStyle executes correctly, isPressed is true, row is not an array', () => {
    const styles = [];
    const item = defaultProps.items[2];
    const pressedItemKey = item.key;
    const orderObject = defaultProps.order[2][0];
    const mouseX = 200;
    const mouseY = 300;
    const isPressed = true;

    const startingState = {
      ...defaultState,
      isPressed,
      pressedItemKey,
      mouseX,
      mouseY,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleStyle({ styles, orderObject });

    expect(instanceProps).toEqual(defaultProps);
    expect(styles).toEqual([{
      key: `key-${item.key}`,
      data: {
        item,
      },
      style: {
        isPressed,
        wasPressed: false,
        width: 500,
        height: 500,
        x: mouseX,
        y: mouseY,
      },
    }]);
  });

  it('generateStyles executes correctly', () => {
    const { items, keys } = defaultProps;
    const item = items[2];
    const pressedItemKey = item.key;

    const startingState = {
      ...defaultState,
      pressedItemKey,
    };

    const expectedStyles = Object.keys(keys).map(key => key);
    const pop = expectedStyles.pop();
    expectedStyles.splice(0, 0, pop);

    const wrapper = shallowComponent(defaultProps, { disableLifecycleMethods: true });
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.setState(startingState);

    instance.handleStyle = jest.fn(
      ({ styles, orderObject }) => styles.push(orderObject.key),
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
