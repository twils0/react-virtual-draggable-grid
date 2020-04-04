import React from 'react';
import PropTypes from 'prop-types';
import handleOrder from '../handleOrder';

// also tests handleOrderObject

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

const items = [
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

describe('handleOrder', () => {
  it('handleOrder executes correctly, without fixedWidth and fixedHeight and without order or keys', () => {
    const copyItems = order.map(itemsRow => (
      Array.isArray(itemsRow)
        ? itemsRow.map(item => ({
          ...item,
          fixedWidth: undefined,
          fixedHeight: undefined,
        })) : itemsRow));
    const copyOrder = order.map(orderRow => [...orderRow]);
    const initialSizeBool = false;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const updatedOrder = copyOrder.map(() => []);

    const expectedResult = {
      order: updatedOrder,
      keys: {},
    };

    const result = handleOrder({
      items: copyItems,
      initialSizeBool,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with fixedWidth and fixedHeight and with rowLimit and columnLimit', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const rowLimit = 2;
    const columnLimit = 1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const copyItems = [...items];
    const expectedOrder = copyOrder.slice(0, 2);
    expectedOrder[0].splice(1);
    expectedOrder[1].splice(1);
    expectedOrder[1][0] = { ...copyOrder[1][0], top: 100 };
    delete copyKeys['test-1'];
    delete copyKeys['test-3'];
    delete copyKeys['test-4'];
    copyKeys['test-2'] = { ...copyKeys['test-2'], top: 100 };

    const expectedResult = {
      order: expectedOrder,
      keys: copyKeys,
    };

    const result = handleOrder({
      items: copyItems,
      order: copyOrder,
      keys: copyKeys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with fixedWidth and fixedHeight and new item, order, and keys', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const updatedItems = [
      ...items,
      {
        key: 'test-5',
        ItemComponent: TestComp,
        fixedWidth: 500,
        fixedHeight: 500,
        itemProps: {
          name: 'test-5',
          style: { userSelect: 'none', width: 600, height: 600 },
        },
      },
    ];
    const expectedOrder = [
      ...order,
      [
        {
          key: 'test-5',
          itemX: 0,
          itemY: 3,
          orderX: 0,
          orderY: 3,
          width: 500,
          height: 500,
          left: 0,
          top: 1000,
        },
      ],
    ];
    const newOrderObject = expectedOrder[3][0];

    copyKeys[newOrderObject.key] = newOrderObject;

    const expectedResult = {
      order: expectedOrder,
      keys: copyKeys,
    };

    const result = handleOrder({
      items: updatedItems,
      order: copyOrder,
      keys: copyKeys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with fixedWidth, fixedHeight, fixedRows, and fixedColumns new item, order, and keys', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = true;
    const fixedColumns = true;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 0;
    const gutterY = 0;

    const updatedItems = [
      ...items,
      {
        key: 'test-5',
        ItemComponent: TestComp,
        fixedWidth: 500,
        fixedHeight: 500,
        itemProps: {
          name: 'test-5',
          style: { userSelect: 'none', width: 600, height: 600 },
        },
      },
    ];
    const expectedOrder = [
      ...order,
      [
        {
          key: 'test-5',
          itemX: 0,
          itemY: 3,
          orderX: 0,
          orderY: 3,
          width: 500,
          height: 500,
          left: 0,
          top: 1000,
        },
      ],
    ];

    const updatedKeys = {};

    const maxRight = [0, 500, 400];
    const maxBottom = [0, 200, 600, 1100];

    const updatedOrder = expectedOrder.map((row, iY) => row.map((object, iX) => {
      const newObject = {
        ...object,
        left: maxRight[iX],
        top: maxBottom[iY],
      };

      updatedKeys[newObject.key] = newObject;

      return newObject;
    }));

    const expectedResult = {
      order: updatedOrder,
      keys: updatedKeys,
    };

    const result = handleOrder({
      items: updatedItems,
      order: copyOrder,
      keys: copyKeys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with fixedWidthAll, fixedHeightAll, fixedRows, and fixedColumns new item, order, and keys', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = true;
    const fixedColumns = true;
    const fixedWidthAll = 100;
    const fixedHeightAll = 150;
    const gutterX = 0;
    const gutterY = 0;

    const updatedItems = [
      ...items,
      {
        key: 'test-5',
        ItemComponent: TestComp,
        fixedWidth: 500,
        fixedHeight: 500,
        itemProps: {
          name: 'test-5',
          style: { userSelect: 'none', width: 600, height: 600 },
        },
      },
    ];
    const expectedOrder = [
      ...order,
      [
        {
          key: 'test-5',
          itemX: 0,
          itemY: 3,
          orderX: 0,
          orderY: 3,
          width: 500,
          height: 500,
          left: 0,
          top: 1000,
        },
      ],
    ];

    const updatedKeys = {};

    const updatedOrder = expectedOrder.map((row, iY) => row.map((object, iX) => {
      const newObject = {
        ...object,
        left: fixedWidthAll * iX,
        top: fixedHeightAll * iY,
        width: fixedWidthAll,
        height: fixedHeightAll,
      };

      updatedKeys[newObject.key] = newObject;

      return newObject;
    }));

    const expectedResult = {
      order: updatedOrder,
      keys: updatedKeys,
    };

    const result = handleOrder({
      items: updatedItems,
      order: copyOrder,
      keys: copyKeys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with fixedWidthAll, fixedHeightAll, fixedRows, fixedColumns, gutterX, and gutterY', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = true;
    const fixedColumns = true;
    const fixedWidthAll = 100;
    const fixedHeightAll = 150;
    const gutterX = 10;
    const gutterY = 20;

    const updatedKeys = {};

    const updatedOrder = copyOrder.map((row, iY) => row.map((object, iX) => {
      const newObject = {
        ...object,
        left: (fixedWidthAll + gutterX) * iX,
        top: (fixedHeightAll + gutterY) * iY,
        width: fixedWidthAll,
        height: fixedHeightAll,
      };

      updatedKeys[newObject.key] = newObject;

      return newObject;
    }));

    const expectedResult = {
      order: updatedOrder,
      keys: updatedKeys,
    };

    const result = handleOrder({
      items,
      order: copyOrder,
      keys: copyKeys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with fixedRows, fixedColumns, gutterX, and gutterY', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = true;
    const fixedColumns = true;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 10;
    const gutterY = 20;

    const updatedKeys = {};

    const maxRight = [0, 500, 400];
    const maxBottom = [0, 200, 600];

    const updatedOrder = copyOrder.map((row, iY) => row.map((object, iX) => {
      const newObject = {
        ...object,
        left: maxRight[iX] + gutterX * iX,
        top: maxBottom[iY] + gutterY * iY,
      };

      updatedKeys[newObject.key] = newObject;

      return newObject;
    }));

    const expectedResult = {
      order: updatedOrder,
      keys: updatedKeys,
    };

    const result = handleOrder({
      items,
      order: copyOrder,
      keys: copyKeys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with gutterX and gutterY', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const rowLimit = -1;
    const columnLimit = -1;
    const fixedRows = false;
    const fixedColumns = false;
    const fixedWidthAll = null;
    const fixedHeightAll = null;
    const gutterX = 10;
    const gutterY = 20;

    const updatedKeys = {};

    const updatedOrder = copyOrder.map((row, iY) => row.map((object, iX) => {
      const newObject = {
        ...object,
        left: object.left + gutterX * iX,
        top: object.top + gutterY * iY,
      };

      updatedKeys[newObject.key] = newObject;

      return newObject;
    }));

    const newOrderObject = { ...updatedOrder[1][1], top: 0 };

    updatedOrder[1][1] = newOrderObject;
    updatedKeys[newOrderObject.key] = newOrderObject;

    const expectedResult = {
      order: updatedOrder,
      keys: updatedKeys,
    };

    const result = handleOrder({
      items,
      order: copyOrder,
      keys: copyKeys,
      rowLimit,
      columnLimit,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    expect(result).toEqual(expectedResult);
  });
});
