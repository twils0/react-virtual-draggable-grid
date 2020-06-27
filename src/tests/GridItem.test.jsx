import React from 'react';
import { shallow } from 'enzyme';

import GridItem from '../GridItem';

const shallowComponent = (props, options) => shallow(<GridItem {...props} />, options);

describe('GridItem', () => {
  let TestComp;
  let key;
  let itemProps;
  let defaultProps;

  beforeEach(() => {
    // eslint-disable-next-line react/prop-types
    TestComp = ({ styles, name }) => (
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

    key = 'test-1';
    itemProps = { name: key };

    defaultProps = {
      style: {
        isPressed: false,
        wasPressed: false,
        width: 200,
        height: 250,
        x: 100,
        y: 100,
      },
      data: {
        item: { key, ItemComponent: TestComp, itemProps },
      },
      fixedWidthAll: null,
      fixedHeightAll: null,
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
      GridItemStyles: {},
      handleMouseDown: jest.fn(),
      handleTouchStart: jest.fn(),
    };
  });

  afterEach(() => {
    defaultProps.handleMouseDown.mockReset();
    defaultProps.handleTouchStart.mockReset();
  });

  it('shouldComponentUpdate executes correctly, all props are the same', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate(defaultProps);

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(false);
  });

  it('shouldComponentUpdate executes correctly, different isPressed prop', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate({
      ...defaultProps,
      style: {
        ...defaultProps.style,
        isPressed: true,
      },
    });

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });

  it('shouldComponentUpdate executes correctly, different wasPressed prop', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate({
      ...defaultProps,
      style: {
        ...defaultProps.style,
        wasPressed: true,
      },
    });

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });

  it('shouldComponentUpdate executes correctly, different width prop', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate({
      ...defaultProps,
      style: {
        ...defaultProps.style,
        width: 300,
      },
    });

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });

  it('shouldComponentUpdate executes correctly, different height prop', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate({
      ...defaultProps,
      style: {
        ...defaultProps.style,
        height: 300,
      },
    });

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });

  it('shouldComponentUpdate executes correctly, different x prop', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate({
      ...defaultProps,
      style: {
        ...defaultProps.style,
        x: 300,
      },
    });

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });

  it('shouldComponentUpdate executes correctly, different y prop', () => {
    const wrapper = shallowComponent(defaultProps);
    const instance = wrapper.instance();
    const instanceProps = instance.props;

    const result = instance.shouldComponentUpdate({
      ...defaultProps,
      style: {
        ...defaultProps.style,
        y: 300,
      },
    });

    expect(instanceProps).toEqual(defaultProps);
    expect(result).toEqual(true);
  });
});
