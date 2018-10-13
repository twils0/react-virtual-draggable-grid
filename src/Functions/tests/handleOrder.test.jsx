import React from 'react';
import PropTypes from 'prop-types';
import handleOrder from '../handleOrder';

// also tests handleOrderObject and handlePosition

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
      itemProps: {
        name: 'test-0',
        style: { userSelect: 'none', width: 100, height: 100 },
      },
    },
    {
      key: 'test-1',
      ItemComponent: TestComp,
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
      itemProps: {
        name: 'test-2',
        style: { userSelect: 'none', width: 300, height: 300 },
      },
    },
    {
      key: 'test-3',
      ItemComponent: TestComp,
      itemProps: {
        name: 'test-3',
        style: { userSelect: 'none', width: 400, height: 400 },
      },
    },
  ],
  {
    key: 'test-4',
    ItemComponent: TestComp,
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

describe('handleOrder', () => {
  it('handleOrder executes correctly, without order or keys', () => {
    const updatedItems = items.map((itemRow) => {
      if (Array.isArray(itemRow)) {
        return itemRow.map(item => ({
          ...item,
          estimatedWidth: item.itemProps.style.width,
          estimatedHeight: item.itemProps.style.height,
        }));
      }
      return {
        ...itemRow,
        estimatedWidth: itemRow.itemProps.style.width,
        estimatedHeight: itemRow.itemProps.style.height,
      };
    });
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };

    const expectedResult = {
      order: copyOrder,
      keys: copyKeys,
    };

    const result = handleOrder({
      items: updatedItems,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with estimatedWidth and estimatedHeight, new item, order and, keys', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const updatedItems = [
      ...items,
      {
        key: 'test-5',
        ItemComponent: TestComp,
        estimatedWidth: 600,
        estimatedHeight: 600,
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
          width: 600,
          height: 600,
          left: 0,
          top: 1000,
        },
      ],
    ];
    const expectedKeys = {
      ...keys,
      'test-5': { orderX: 0, orderY: 3 },
    };

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = handleOrder({
      items: updatedItems,
      order: copyOrder,
      keys: copyKeys,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with fixedWidth and fixedHeight new item, order and, keys', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
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
          width: 500,
          height: 500,
          left: 0,
          top: 1000,
        },
      ],
    ];
    const expectedKeys = {
      ...keys,
      'test-5': { orderX: 0, orderY: 3 },
    };

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = handleOrder({
      items: updatedItems,
      order: copyOrder,
      keys: copyKeys,
    });

    expect(result).toEqual(expectedResult);
  });

  it('handleOrder executes correctly, with default width and height new item, order and, keys', () => {
    const copyOrder = order.map(orderRow => [...orderRow]);
    const copyKeys = { ...keys };
    const updatedItems = [
      ...items,
      {
        key: 'test-5',
        ItemComponent: TestComp,
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
          width: 100, // default width
          height: 100, // default height
          left: 0,
          top: 1000,
        },
      ],
    ];
    const expectedKeys = {
      ...keys,
      'test-5': { orderX: 0, orderY: 3 },
    };

    const expectedResult = {
      order: expectedOrder,
      keys: expectedKeys,
    };

    const result = handleOrder({
      items: updatedItems,
      order: copyOrder,
      keys: copyKeys,
    });

    expect(result).toEqual(expectedResult);
  });
});
