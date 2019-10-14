import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import VirtualDraggableGrid from '../VirtualDraggableGrid';

import preventDrag from '../Functions/preventDrag';

const orderManager = {
  testItemsUpdate: jest.fn(),
  setOrder: jest.fn(),
};

require('../Functions/preventDrag').default = jest.fn();
require('../OrderManager/OrderManager').default = jest.fn(() => orderManager);

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
  visibleOrder: [],
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


describe('VirtualDraggableGrid', () => {
  afterEach(() => {
    preventDrag.mockReset();
    orderManager.testItemsUpdate.mockReset();
    orderManager.setOrder.mockReset();
    defaultProps.getItems.mockReset();
  });

  it('renders correctly', () => {
    const {
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    } = defaultProps;
    const {
      order,
      keys,
    } = constructorState;

    orderManager.testItemsUpdate.mockReturnValue(false);
    orderManager.setOrder.mockReturnValueOnce({ order, keys });

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();

    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(constructorState);
    expect(orderManager.setOrder).toHaveBeenCalledTimes(1);
    expect(orderManager.setOrder).toBeCalledWith({
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('componentDidUpdate executes correctly, items not updated', () => {
    const {
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    } = defaultProps;
    const { order, keys } = constructorState;

    orderManager.testItemsUpdate.mockReturnValue(false);
    orderManager.setOrder.mockReturnValueOnce({ order, keys });

    const wrapper = shallowComponent(defaultProps);

    const instance = wrapper.instance();
    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(constructorState);
    expect(orderManager.setOrder).toHaveBeenCalledTimes(1);
    expect(orderManager.setOrder).toBeCalledWith({
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });
  });

  it('componentDidUpdate executes correctly; items updated', () => {
    const {
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    } = defaultProps;
    const { order, keys } = constructorState;
    const updatedState = {
      ...constructorState,
      order: updatedOrder,
      keys: updatedKeys,
    };

    orderManager.testItemsUpdate.mockReturnValueOnce(true);
    orderManager.testItemsUpdate.mockReturnValue(false);
    orderManager.setOrder.mockReturnValueOnce({ order, keys });
    orderManager.setOrder.mockReturnValue({
      order: updatedOrder,
      keys: updatedKeys,
    });

    const wrapper = shallowComponent(defaultProps);

    const instance = wrapper.instance();

    wrapper.setState(updatedState);

    const instanceProps = instance.props;
    const instanceState = instance.state;

    expect(instanceProps).toEqual(defaultProps);
    expect(instanceState).toEqual(updatedState);
    expect(orderManager.testItemsUpdate).toHaveBeenCalledTimes(2);
    expect(orderManager.setOrder).toHaveBeenCalledTimes(2);
    expect(orderManager.setOrder).toHaveBeenCalledWith({
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });
  });
});
