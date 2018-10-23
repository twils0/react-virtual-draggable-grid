import findMaxPosition from '../findMaxPosition';

global.addEventListener = jest.fn();
global.removeEventListener = jest.fn();

const order = [
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
    {
      key: 'test-4',
      itemX: 2,
      itemY: 1,
      orderX: 2,
      orderY: 1,
      width: 500,
      height: 500,
      left: 700,
      top: 0,
    },
  ],
  [
    {
      key: 'test-5',
      itemX: 0,
      itemY: 2,
      orderX: 0,
      orderY: 2,
      width: 600,
      height: 600,
      left: 0,
      top: 500,
    },
  ],
];

describe('findMaxPosition', () => {
  it('findMaxPosition executes correctly 1', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const expectedResult = {
      maxRight: 1200,
      maxBottom: 1100,
    };

    const result = findMaxPosition({
      order: copyOrder,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('findMaxPosition executes correctly 2', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const orderObject = copyOrder[0][1];
    copyOrder[0][1] = { ...orderObject, width: 1100 };

    const expectedResult = {
      maxRight: 1200,
      maxBottom: 1100,
    };

    const result = findMaxPosition({
      order: copyOrder,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('findMaxPosition executes correctly 3', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const orderObject20 = copyOrder[2][0];
    copyOrder[2][0] = { ...orderObject20, height: 1100 };

    const expectedResult = {
      maxRight: 1200,
      maxBottom: 1600,
    };

    const result = findMaxPosition({
      order: copyOrder,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('findMaxPosition executes correctly, with fixedWidthAll, fixedHeightAll, gutterX, and gutterY', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const fixedWidthAll = 200;
    const fixedHeightAll = 100;
    const gutterX = 50;
    const gutterY = 25;

    const expectedResult = {
      maxRight: 700,
      maxBottom: 350,
    };

    const result = findMaxPosition({
      order: copyOrder,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });
});
