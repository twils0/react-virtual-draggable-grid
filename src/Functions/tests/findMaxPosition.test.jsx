import findMaxPosition from '../findMaxPosition';

import updatePositions from '../updatePositions';
import updateKeys from '../updateKeys';

global.addEventListener = jest.fn();
global.removeEventListener = jest.fn();

jest.mock('../updatePositions', () => jest.fn());
jest.mock('../updateKeys', () => jest.fn());

updatePositions.mockImplementation(({ order }) => order);
updateKeys.mockImplementation(({ keys }) => keys);

const order = [
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
];

describe('findMaxPosition', () => {
  it('findMaxPosition executes correctly 1', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);

    const expectedResult = {
      maxRight: 700,
      maxBottom: 1000,
    };

    const result = findMaxPosition(copyOrder);

    expect(result).toEqual(expectedResult);
  });

  it('findMaxPosition executes correctly 2', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const orderObject = copyOrder[0][1];
    copyOrder[0][1] = { ...orderObject, width: 1000 };

    const expectedResult = {
      maxRight: 1100,
      maxBottom: 1000,
    };

    const result = findMaxPosition(copyOrder);

    expect(result).toEqual(expectedResult);
  });

  it('findMaxPosition executes correctly 3', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const orderObject11 = copyOrder[1][1];
    const orderObject20 = copyOrder[2][0];
    copyOrder[1][1] = { ...orderObject11, height: 1100 };
    copyOrder[2][0] = { ...orderObject20, width: 200 };

    const expectedResult = {
      maxRight: 700,
      maxBottom: 1100,
    };

    const result = findMaxPosition(copyOrder);

    expect(result).toEqual(expectedResult);
  });
});
