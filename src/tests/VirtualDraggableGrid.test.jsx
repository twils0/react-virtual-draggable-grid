import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import VirtualDraggableGrid from '../VirtualDraggableGrid';

import handleOrder from '../Functions/handleOrder';
import updatePositions from '../Functions/updatePositions';
import testItemsUpdate from '../Functions/testItemsUpdate';
import handleVirtualization from '../Functions/handleVirtualization';
import preventDrag from '../Utilities/preventDrag';

jest.mock('../Functions/handleOrder', () => jest.fn());
jest.mock('../Functions/updatePositions', () => jest.fn());
jest.mock('../Functions/testItemsUpdate', () => jest.fn());
jest.mock('../Functions/handleVirtualization', () => jest.fn());
jest.mock('../Utilities/preventDrag', () => jest.fn());

const shallowComponent = (props, options) => shallow(<VirtualDraggableGrid {...props} />, options);

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
  items: [
    [
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
    ],
    [
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
    },
  ],
  WrapperStyles: {},
  GridStyles: {},
  GridItemStyles: {},
  springSettings: { stiffness: 300, damping: 50 },
  getItems: jest.fn(),
};

const constructorState = {
  order: [
    [
      {
        key: 'test-0',
        itemX: 0,
        itemY: 0,
        width: 100,
        height: 100,
        left: 0,
        top: 0,
      },
      {
        key: 'test-1',
        itemX: 1,
        itemY: 0,
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
        width: 300,
        height: 300,
        left: 0,
        top: 200,
      },
      {
        key: 'test-3',
        itemX: 1,
        itemY: 1,
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
        width: 500,
        height: 500,
        left: 0,
        top: 500,
      },
    ],
  ],
  keys: {
    'test-0': { orderX: 0, orderY: 0 },
    'test-1': { orderX: 1, orderY: 0 },
    'test-2': { orderX: 0, orderY: 1 },
    'test-3': { orderX: 1, orderY: 1 },
    'test-4': { orderX: 0, orderY: 2 },
  },
};

const updatedItems = [
  ...defaultProps.items,
  {
    key: 'test-5',
    ItemComponent: TestComp,
    itemProps: {
      name: 'test-5',
      style: { userSelect: 'none', width: 600, height: 600 },
    },
  },
];
const updatedOrder = [
  ...constructorState.order,
  [
    {
      key: 'test-5',
      itemX: 0,
      itemY: 3,
      width: 600,
      height: 600,
      left: 0,
      top: 1000,
    },
  ],
];
const updatedKeys = {
  ...constructorState.keys,
  'test-5': { orderX: 0, orderY: 3 },
};

describe('VirtualDraggableGrid', () => {
  afterEach(() => {
    defaultProps.getItems.mockReset();
    handleOrder.mockReset();
    updatePositions.mockReset();
    testItemsUpdate.mockReset();
    handleVirtualization.mockReset();
    preventDrag.mockReset();
  });

  it('renders correctly', () => {
    const { items } = defaultProps;
    const { order, keys } = constructorState;

    handleOrder.mockReturnValue({ order, keys });

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(constructorState);
    expect(handleOrder).toHaveBeenCalledTimes(1);
    expect(handleOrder).toBeCalledWith({ items });
    expect(wrapper).toMatchSnapshot();
  });

  it('getDerivedStateFromProps executes correctly, items not updated', () => {
    const { order, keys } = constructorState;

    testItemsUpdate.mockReturnValue(false);
    handleOrder.mockReturnValue({ order, keys });

    const wrapper = shallowComponent(defaultProps, { disableLifecycleMethods: true });

    const instance = wrapper.instance();
    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(constructorState);
    expect(handleOrder).toHaveBeenCalledTimes(1);
  });

  it('getDerivedStateFromProps executes correctly, items updated', () => {
    const { order, keys } = constructorState;
    const updatedProps = {
      ...defaultProps,
      items: updatedItems,
    };
    const orderKeysObject = { order: updatedOrder, keys: updatedKeys };
    const updatedState = {
      ...constructorState,
      order: updatedOrder,
      keys: updatedKeys,
    };

    testItemsUpdate.mockReturnValueOnce(false);
    handleOrder.mockReturnValueOnce({ order, keys });

    const wrapper = shallowComponent(defaultProps, { disableLifecycleMethods: true });

    testItemsUpdate.mockReturnValue(true);
    handleOrder.mockReturnValue(orderKeysObject);

    wrapper.setProps(updatedProps);

    const instance = wrapper.instance();
    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(updatedProps);
    expect(instanceState).toEqual(updatedState);
    expect(handleOrder).toHaveBeenCalledTimes(2);
    expect(handleOrder).toBeCalledWith({ items: updatedItems, order, keys });
  });

  it('updateGridSize executes correctly', () => {
    const { order, keys } = constructorState;
    const offsetWidth = 100;
    const offsetHeight = 200;
    const visibleOrder = Object.keys(keys).map(key => keys[key]);
    const update = {
      containerWidth: offsetWidth,
      containerHeight: offsetHeight,
    };

    const expectedState = {
      ...constructorState,
      ...update,
      visibleOrder,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const gridRef = { current: { offsetWidth, offsetHeight } };

    handleVirtualization.mockReturnValue(visibleOrder);

    instance.updateGridSize(gridRef);

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(handleVirtualization).toHaveBeenCalledTimes(1);
    expect(handleVirtualization).toBeCalledWith({ ...update, order, keys });
    expect(instanceState).toEqual(expectedState);
  });

  it('updateSize executes correctly', () => {
    const { order, keys } = constructorState;
    const resizedOrderObject = order[1][0];
    const { key } = resizedOrderObject;
    const width = 301;
    const height = 302;
    const resizedOrder = [...order];
    resizedOrder[1] = [...order[1]];

    resizedOrder[1][0] = { ...resizedOrderObject, width, height };

    const repositionedOrder = [...resizedOrder];
    const repositionedOrderObject = resizedOrder[2][0];
    repositionedOrder[2] = [...resizedOrder[2]];
    repositionedOrder[2][0] = { ...repositionedOrderObject, top: 502 };

    const updatedState = {
      ...constructorState,
      order: repositionedOrder,
    };

    handleOrder.mockReturnValue({ order, keys });

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    updatePositions.mockReturnValue(repositionedOrder);
    instance.updateSize({ key, width, height });

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
  });

  it('updateOrderKeys executes correctly', () => {
    const { order, keys } = constructorState;
    const updatedState = {
      ...constructorState,
      order: updatedOrder,
      keys: updatedKeys,
    };

    handleOrder.mockReturnValue({ order, keys });

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.updateOrderKeys({ order: updatedOrder, keys: updatedKeys });

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
  });

  it('updateItems executes correctly', () => {
    const { items } = defaultProps;
    const { order, keys } = constructorState;
    const movedItems = [...items];
    movedItems[1] = [...items[1]];
    movedItems[2] = [items[2]];
    const movedOrder = [...order];
    movedOrder[1] = [...order[1]];
    movedOrder[2] = [...order[2]];
    const movedKeys = { ...keys };

    const orderObject = movedOrder[1].pop();
    movedKeys[orderObject.key] = { orderX: 1, orderY: 2 };
    movedOrder[2].push(orderObject);

    const item = movedItems[1].pop();
    [, [movedItems[1]]] = movedItems;
    movedItems[2].push(item);

    const updatedState = {
      ...constructorState,
      order: movedOrder,
      keys: movedKeys,
    };

    testItemsUpdate.mockReturnValue(false);
    handleOrder.mockReturnValue({ order: movedOrder, keys: movedKeys });

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.updateItems();

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
    expect(defaultProps.getItems).toHaveBeenCalledTimes(1);
    expect(defaultProps.getItems).toBeCalledWith(movedItems);
  });


  it('handleScroll executes correctly', () => {
    const { order, keys } = constructorState;
    const offsetWidth = 100;
    const offsetHeight = 200;
    const scrollLeft = 20;
    const scrollTop = 30;
    const event = {
      target: {
        offsetWidth,
        offsetHeight,
        scrollLeft,
        scrollTop,
      },
    };
    const visibleOrder = Object.keys(keys).map(key => keys[key]);
    const update = {
      containerWidth: offsetWidth,
      containerHeight: offsetHeight,
      scrollLeft,
      scrollTop,
    };

    const expectedState = {
      ...constructorState,
      ...update,
      visibleOrder,
    };

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    handleVirtualization.mockReturnValue(visibleOrder);

    instance.handleScroll(event);

    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(handleVirtualization).toHaveBeenCalledTimes(1);
    expect(handleVirtualization).toBeCalledWith({ ...update, order, keys });
    expect(instanceState).toEqual(expectedState);
  });
});
