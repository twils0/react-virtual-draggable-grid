import changeOrder from '../changeOrder';

// also tests handlePositions and handleKeys

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

const keys = {
  'test-0': { orderX: 0, orderY: 0 },
  'test-1': { orderX: 1, orderY: 0 },
  'test-2': { orderX: 0, orderY: 1 },
  'test-3': { orderX: 1, orderY: 1 },
  'test-4': { orderX: 0, orderY: 2 },
};

describe('changeOrder', () => {
  it('changeOrder executes correctly, no from row', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);

    const result = changeOrder({
      order: copyOrder,
      keys,
      fromIndexX: 0,
      fromIndexY: 3,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual(null);
  });

  it('changeOrder executes correctly, no from x index', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);

    const result = changeOrder({
      order: copyOrder,
      keys,
      fromIndexX: 3,
      fromIndexY: 1,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual(null);
  });

  it('changeOrder executes correctly 1', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject00 = order[0][0];
    const orderObject01 = order[0][1];
    const orderObject10 = order[1][0];
    const orderObject11 = order[1][1];
    expectedOrder[0].splice(0, 1);
    expectedOrder[1].splice(1, 0, orderObject00);

    expectedKeys[orderObject01.key] = { orderX: 0, orderY: 0 };
    expectedKeys[orderObject00.key] = { orderX: 1, orderY: 1 };
    expectedKeys[orderObject10.key] = { orderX: 0, orderY: 1 };
    expectedKeys[orderObject11.key] = { orderX: 2, orderY: 1 };

    expectedOrder[0][0] = { ...orderObject01, left: 0, top: 0 };
    expectedOrder[1][0] = { ...orderObject10, left: 0, top: 200 };
    expectedOrder[1][1] = { ...orderObject00, left: 300, top: 0 };
    expectedOrder[1][2] = { ...orderObject11, left: 400, top: 0 };

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      fromIndexX: 0,
      fromIndexY: 0,
      toIndexX: 1,
      toIndexY: 1,
    });

    expect(result).toEqual(expectedResult);
  });

  it('changeOrder executes correctly 2', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject10 = order[1][0];
    const orderObject11 = order[1][1];
    const orderObject20 = order[2][0];
    expectedOrder[1].splice(0, 1);
    expectedOrder.push([orderObject10]);

    expectedKeys[orderObject10.key] = { orderX: 0, orderY: 3 };
    expectedKeys[orderObject11.key] = { orderX: 0, orderY: 1 };

    expectedOrder[1][0] = { ...orderObject11, left: 0, top: 200 };
    expectedOrder[2][0] = { ...orderObject20, left: 0, top: 600 };
    expectedOrder[3][0] = { ...orderObject10, left: 0, top: 1100 };

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      fromIndexX: 0,
      fromIndexY: 1,
      toIndexX: 0,
      toIndexY: 3,
    });

    expect(result).toEqual(expectedResult);
  });

  it('changeOrder executes correctly 3', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject20 = order[2][0];
    const orderObject11 = order[1][1];
    expectedOrder.splice(2, 1);

    expectedKeys[orderObject20.key] = { orderX: 2, orderY: 0 };

    expectedOrder[0][2] = { ...orderObject20, left: 300, top: 0 };
    expectedOrder[1][1] = { ...orderObject11, top: 500 };

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      fromIndexX: 0,
      fromIndexY: 2,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual(expectedResult);
  });
});
