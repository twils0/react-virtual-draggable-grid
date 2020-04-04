import changeOrder from '../changeOrder';

// also tests handlePositions

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

const keys = {
  'test-0': order[0][0],
  'test-1': order[0][1],
  'test-2': order[1][0],
  'test-3': order[1][1],
  'test-4': order[2][0],
};

describe('changeOrder', () => {
  it('changeOrder executes correctly, no from row', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 3,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual({});
  });

  it('changeOrder executes correctly, fromIndexX references undefined', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 3,
      fromIndexY: 1,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual({});
  });

  it('changeOrder executes correctly 1', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject00 = {
      ...order[0][0],
      orderX: 1,
      orderY: 1,
      left: 300,
      top: 0,
    };
    const orderObject01 = {
      ...order[0][1],
      orderX: 0,
      orderY: 0,
      left: 0,
      top: 0,
    };
    const orderObject10 = {
      ...order[1][0],
      orderX: 0,
      orderY: 1,
      left: 0,
      top: 200,
    };
    const orderObject11 = {
      ...order[1][1],
      orderX: 2,
      orderY: 1,
      left: 400,
      top: 0,
    };
    expectedOrder[0].splice(0, 1);
    expectedOrder[1].splice(1, 0, orderObject00);

    expectedKeys[orderObject00.key] = orderObject00;
    expectedKeys[orderObject01.key] = orderObject01;
    expectedKeys[orderObject10.key] = orderObject10;
    expectedKeys[orderObject11.key] = orderObject11;

    expectedOrder[0][0] = orderObject01;
    expectedOrder[1][0] = orderObject10;
    expectedOrder[1][1] = orderObject00;
    expectedOrder[1][2] = orderObject11;

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 0,
      toIndexX: 1,
      toIndexY: 1,
    });

    expect(result).toEqual(expectedResult);
  });

  it('changeOrder executes correctly 2', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject10 = {
      ...order[1][0],
      orderX: 0,
      orderY: 3,
      left: 0,
      top: 1100,
    };
    const orderObject11 = {
      ...order[1][1],
      orderX: 0,
      orderY: 1,
      left: 0,
      top: 200,
    };
    const orderObject20 = { ...order[2][0], left: 0, top: 600 };
    expectedOrder[1].splice(0, 1);
    expectedOrder.push([orderObject10]);

    expectedKeys[orderObject10.key] = orderObject10;
    expectedKeys[orderObject11.key] = orderObject11;
    expectedKeys[orderObject20.key] = orderObject20;

    expectedOrder[1][0] = orderObject11;
    expectedOrder[2][0] = orderObject20;
    expectedOrder[3][0] = orderObject10;

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 1,
      toIndexX: 0,
      toIndexY: 3,
    });

    expect(result).toEqual(expectedResult);
  });

  it('changeOrder executes correctly 3', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject20 = {
      ...order[2][0],
      orderX: 2,
      orderY: 0,
      left: 300,
      top: 0,
    };
    const orderObject11 = { ...order[1][1], top: 500 };

    expectedOrder[0][2] = orderObject20;
    expectedOrder[1][1] = orderObject11;
    expectedKeys[orderObject20.key] = orderObject20;
    expectedKeys[orderObject11.key] = orderObject11;

    expectedOrder.splice(2, 1);

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 2,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual(expectedResult);
  });

  it('changeOrder executes correctly, with rowLimit and columnLimit', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = 3;
    const columnLimit = 3;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject20 = {
      ...order[2][0],
      orderX: 2,
      orderY: 0,
      left: 300,
      top: 0,
    };
    const orderObject11 = { ...order[1][1], top: 500 };

    expectedOrder[0][2] = orderObject20;
    expectedOrder[1][1] = orderObject11;
    expectedKeys[orderObject20.key] = orderObject20;
    expectedKeys[orderObject11.key] = orderObject11;

    expectedOrder.splice(2, 1);

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 2,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual(expectedResult);
  });

  it('changeOrder executes correctly; does not expand past row limit', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = 3;
    const columnLimit = -1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 1,
      fromIndexY: 1,
      toIndexX: 0,
      toIndexY: 3,
    });

    expect(result).toEqual({});
  });

  it('changeOrder executes correctly; does not expand past column limit', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = 2;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 2,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual({});
  });

  it('changeOrder executes correctly, with fixedRows and fixedColumns', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = true;
    const fixedColumns = true;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject20 = {
      ...order[2][0],
      orderX: 2,
      orderY: 0,
      left: 300,
      top: 0,
    };
    const orderObject11 = { ...order[1][1], top: 500 };

    expectedOrder[0][2] = orderObject20;
    expectedOrder[1][1] = orderObject11;

    expectedOrder.splice(2, 1);

    const updatedOrder = expectedOrder.map((row, iY) => row.map((orderObject, iX) => {
      const newOrderObject = { ...orderObject };

      if (iY === 1) {
        newOrderObject.top = 500;
      }
      if (iX === 1) {
        newOrderObject.left = 300;
      }
      if (iX === 2) {
        newOrderObject.left = 700;
      }

      expectedKeys[orderObject.key] = newOrderObject;

      return newOrderObject;
    }));

    const expectedResult = {
      order: updatedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 2,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual(expectedResult);
  });

  it('changeOrder executes correctly, with gutterX and gutterY', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 25;
    const gutterY = 50;

    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject20 = {
      ...order[2][0],
      orderX: 2,
      orderY: 0,
      left: 300,
      top: 0,
    };
    const orderObject11 = { ...order[1][1], top: 500 };

    expectedOrder[0][2] = orderObject20;
    expectedOrder[1][1] = orderObject11;

    expectedOrder.splice(2, 1);

    const updatedOrder = expectedOrder.map((row, iY) => row.map((orderObject, iX) => {
      const newOrderObject = { ...orderObject };
      const { left, top } = orderObject;

      newOrderObject.top = top + iY * gutterY;
      newOrderObject.left = left + iX * gutterX;

      expectedKeys[orderObject.key] = newOrderObject;

      return newOrderObject;
    }));

    const expectedResult = {
      order: updatedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 2,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual(expectedResult);
  });

  it('changeOrder executes correctly, with fixedRows, fixedColumns, fixedWidthAll, fixedHeightAll, gutterX, and gutterY', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = true;
    const fixedColumns = true;
    const fixedWidthAll = 100;
    const fixedHeightAll = 200;
    const gutterX = 50;
    const gutterY = 25;

    const expectedOrder = order.map(orderRow => [...orderRow]);
    const expectedKeys = { ...keys };

    const orderObject20 = {
      ...order[2][0],
      orderX: 2,
      orderY: 0,
    };

    expectedOrder[0][2] = orderObject20;
    expectedKeys[orderObject20.key] = orderObject20;

    expectedOrder.splice(2, 1);

    const updatedOrder = expectedOrder.map((row, iY) => row.map((orderObject, iX) => {
      const newOrderObject = { ...orderObject };

      newOrderObject.left = iX * (fixedWidthAll + gutterX);
      newOrderObject.top = iY * (fixedHeightAll + gutterY);

      expectedKeys[orderObject.key] = newOrderObject;

      return newOrderObject;
    }));

    const expectedResult = {
      order: updatedOrder,
      keys: expectedKeys,
    };

    const result = changeOrder({
      order: copyOrder,
      keys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      fromIndexX: 0,
      fromIndexY: 2,
      toIndexX: 2,
      toIndexY: 0,
    });

    expect(result).toEqual(expectedResult);
  });
});
