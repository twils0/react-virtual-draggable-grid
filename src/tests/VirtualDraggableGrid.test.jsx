import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import VirtualDraggableGrid from '../VirtualDraggableGrid';

import handleOrder from '../Functions/handleOrder';
import updatePositions from '../Functions/updatePositions';
import testItemsUpdate from '../Functions/testItemsUpdate';
import preventDrag from '../Utilities/preventDrag';

jest.mock('../Functions/handleOrder', () => jest.fn());
jest.mock('../Functions/updatePositions', () => jest.fn());
jest.mock('../Functions/testItemsUpdate', () => jest.fn());
jest.mock('../Utilities/preventDrag', () => jest.fn());

const shallowComponent = props => shallow(<VirtualDraggableGrid {...props} />);

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
  ],
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

const constructorState = {
  order: [
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
  ],
  itemsBool: true,
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

constructorState.keys = {
  'test-0': constructorState.order[0][0],
  'test-1': constructorState.order[0][1],
  'test-2': constructorState.order[1][0],
  'test-3': constructorState.order[1][1],
  'test-4': constructorState.order[2][0],
};

const updatedOrder = [
  ...constructorState.order,
  [
    {
      key: 'test-5',
      itemX: 0,
      itemY: 3,
      orderX: 0,
      orderY: 3,
      width: 600,
      height: 600,
      left: 0,
      top: 1000,
    },
  ],
];
const updatedKeys = {
  ...constructorState.keys,
  'test-5': updatedOrder[3][0],
};

describe('VirtualDraggableGrid', () => {
  afterEach(() => {
    defaultProps.getItems.mockReset();
    handleOrder.mockReset();
    updatePositions.mockReset();
    testItemsUpdate.mockReset();
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
    expect(handleOrder).toBeCalledWith({
      items,
      fixedRows: false,
      fixedColumns: false,
      fixedWidthAll: null,
      fixedHeightAll: null,
      gutterX: 0,
      gutterY: 0,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('getDerivedStateFromProps executes correctly, items not updated', () => {
    const { items } = defaultProps;
    const { order, keys } = constructorState;

    testItemsUpdate.mockReturnValue(false);
    handleOrder.mockReturnValueOnce({ order, keys });

    const wrapper = shallowComponent(defaultProps);

    const instance = wrapper.instance();
    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(constructorState);
    expect(handleOrder).toHaveBeenCalledTimes(1);
    expect(handleOrder).toBeCalledWith({
      items,
      fixedRows: false,
      fixedColumns: false,
      fixedWidthAll: null,
      fixedHeightAll: null,
      gutterX: 0,
      gutterY: 0,
    });
  });

  it('getDerivedStateFromProps executes correctly, items updated', () => {
    const { items } = defaultProps;
    const { order, keys } = constructorState;
    const updatedState = {
      ...constructorState,
      order: updatedOrder,
      keys: updatedKeys,
    };

    testItemsUpdate.mockReturnValueOnce(true);
    testItemsUpdate.mockReturnValue(false);
    handleOrder.mockReturnValueOnce({
      order,
      keys,
    });
    handleOrder.mockReturnValue({
      order: updatedOrder,
      keys: updatedKeys,
    });

    const wrapper = shallowComponent(defaultProps);

    const instance = wrapper.instance();
    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
    expect(handleOrder).toHaveBeenCalledTimes(2);
    expect(handleOrder).toHaveBeenNthCalledWith(1, {
      items,
      fixedRows: false,
      fixedColumns: false,
      fixedWidthAll: null,
      fixedHeightAll: null,
      gutterX: 0,
      gutterY: 0,
    });
    expect(handleOrder).toHaveBeenNthCalledWith(2, {
      items,
      fixedRows: false,
      fixedColumns: false,
      fixedWidthAll: null,
      fixedHeightAll: null,
      gutterX: 0,
      gutterY: 0,
    });
  });

  it('updateOrder executes correctly', () => {
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

    instance.updateOrder({ order: updatedOrder, keys: updatedKeys });

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
});
