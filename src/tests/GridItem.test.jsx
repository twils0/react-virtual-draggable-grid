import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import GridItem from '../GridItem';

const shallowComponent = (props, options) => shallow(<GridItem {...props} />, options);

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

const key = 'test-1';
const itemProps = { test: 'prop' };

const defaultProps = {
  style: {
    opacity: 1,
    shadow: 0,
    x: 100,
    y: 100,
    zIndex: 1,
  },
  data: {
    item: { key, ItemComponent: TestComp, itemProps },
    orderObject: { key, width: 200, height: 200 },
  },
  GridItemStyles: {},
  updateSize: jest.fn(),
  handleMouseDown: jest.fn(),
  handleTouchStart: jest.fn(),
};

describe('GridItem', () => {
  afterEach(() => {
    defaultProps.updateSize.mockReset();
    defaultProps.handleMouseDown.mockReset();
    defaultProps.handleTouchStart.mockReset();
  });

  it('renders correctly and componentDidUpdate executes correctly', () => {
    const wrapper = shallowComponent(defaultProps, { disableLifecycleMethods: true });
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.updateGridItemSize = jest.fn();

    instance.componentDidMount();
    instance.componentDidUpdate();

    expect(instanceProps).toEqual(defaultProps);
    expect(wrapper).toMatchSnapshot();
    expect(instance.updateGridItemSize).toHaveBeenCalledTimes(2);
  });

  it('shouldComponentUpdate executes correctly, all props are the same', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate(defaultProps);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(false);
  });

  it('shouldComponentUpdate executes correctly, different prop', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate({
      ...defaultProps,
      data: {
        ...defaultProps.data,
        orderObject: {
          ...defaultProps.data.orderObject,
          width: 300,
        },
      },
    });

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });

  it('updateGridItemSize executes correctly', () => {
    const offsetWidth = 300;
    const offsetHeight = 300;

    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    instance.gridItemRef = { current: { offsetWidth, offsetHeight } };

    instance.updateGridItemSize();

    expect(instanceProps).toEqual(defaultProps);
    expect(defaultProps.updateSize).toHaveBeenCalledTimes(1);
    expect(defaultProps.updateSize).toBeCalledWith({
      key,
      width: offsetWidth,
      height: offsetHeight,
    });
  });
});
