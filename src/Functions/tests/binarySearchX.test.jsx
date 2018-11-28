import binarySearchX from '../binarySearchX';

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

describe('binarySearchX', () => {
  it('binarySearchX executes correctly, indexY at 0, leftCutoff equal to 100, rightCutoff equal to 200', () => {
    const indexY = 0;
    const leftCutoff = 100;
    const rightCutoff = 200;

    const expectedResult = { leftIndex: -1, rightIndex: -1 };

    const result = binarySearchX({
      order,
      indexY,
      leftCutoff,
      rightCutoff,
    });

    expect(result).toEqual(expectedResult);
  });

  it('binarySearchX executes correctly, indexY at 0, leftCutoff equal to 0, rightCutoff equal to 50', () => {
    const indexY = 0;
    const leftCutoff = 0;
    const rightCutoff = 50;

    const expectedResult = { leftIndex: -1, rightIndex: -1 };

    const result = binarySearchX({
      order,
      indexY,
      leftCutoff,
      rightCutoff,
    });

    expect(result).toEqual(expectedResult);
  });

  it('binarySearchX executes correctly, indexY at 1, leftCutoff equal to 0, rightCutoff equal to 1000', () => {
    const indexY = 1;
    const leftCutoff = 0;
    const rightCutoff = 1000;

    const expectedResult = { leftIndex: 0, rightIndex: 1 };

    const result = binarySearchX({
      order,
      indexY,
      leftCutoff,
      rightCutoff,
    });

    expect(result).toEqual(expectedResult);
  });

  it('binarySearchX executes correctly, start at 1, indexY at 1, leftCutoff equal to 0, rightCutoff equal to 1000', () => {
    const start = 1;
    const indexY = 1;
    const leftCutoff = 0;
    const rightCutoff = 1000;

    const expectedResult = { leftIndex: 1, rightIndex: 1 };

    const result = binarySearchX({
      order,
      start,
      indexY,
      leftCutoff,
      rightCutoff,
    });

    expect(result).toEqual(expectedResult);
  });

  it('binarySearchX executes correctly, start at 1, end at 2, indexY at 1, leftCutoff equal to 0, rightCutoff equal to 2000', () => {
    const start = 1;
    const end = 2;
    const indexY = 1;
    const leftCutoff = 0;
    const rightCutoff = 2000;

    const expectedResult = { leftIndex: 1, rightIndex: 2 };

    const result = binarySearchX({
      order,
      start,
      end,
      indexY,
      leftCutoff,
      rightCutoff,
    });

    expect(result).toEqual(expectedResult);
  });

  it('binarySearchX executes correctly, start at 0, end at 1, indexY at 1, leftCutoff equal to 0, rightCutoff equal to 2000', () => {
    const start = 0;
    const end = 1;
    const indexY = 1;
    const leftCutoff = 0;
    const rightCutoff = 2000;

    const expectedResult = { leftIndex: 0, rightIndex: 1 };

    const result = binarySearchX({
      order,
      start,
      end,
      indexY,
      leftCutoff,
      rightCutoff,
    });

    expect(result).toEqual(expectedResult);
  });
});
