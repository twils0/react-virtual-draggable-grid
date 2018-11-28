/* eslint-disable no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';

import Interval1D from '../../Utilities/RedBlackTree/Interval1D';
import Order from '../Order';
import OrderNode from '../OrderNode';

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

const hashTable = {
  'test-0': new OrderNode(items[0][0], 0, 0),
  'test-1': new OrderNode(items[0][1], 1, 0),
  'test-2': new OrderNode(items[1][0], 0, 1),
  'test-3': new OrderNode(items[1][1], 1, 1),
  'test-4': new OrderNode(items[2], 0, 2),
};

const array = [
  { intervalX: new Interval1D(0, 100), intervalY: new Interval1D(0, 100) },
  { intervalX: new Interval1D(0, 500), intervalY: new Interval1D(500, 1000) },
  { intervalX: new Interval1D(0, 300), intervalY: new Interval1D(200, 500) },
  { intervalX: new Interval1D(100, 300), intervalY: new Interval1D(0, 200) },
  { intervalX: new Interval1D(300, 700), intervalY: new Interval1D(0, 400) },
];

describe('testOrder', () => {
  it('Order methods execute correctly, items are all missing fixedWidth and fixedHeight', () => {
    const copyItems = items.map(itemsRow => (Array.isArray(itemsRow)
      ? itemsRow.map(item => ({
        ...item,
        fixedWidth: undefined,
        fixedHeight: undefined,
      }))
      : { ...itemsRow, fixedWidth: undefined, fixedHeight: undefined }));

    const order = new Order();
    order.fixedRows = false;
    order.gutterX = 0;
    order.gutterY = 0;
    order.items = copyItems;

    const testOrderedArray = order.orderedArray.map((node) => {
      const newNode = { ...node };
      newNode.intervalX = new Interval1D(node.intervalX.min, node.intervalX.max);
      newNode.intervalY = new Interval1D(node.intervalY.min, node.intervalY.max);

      return { intervalX: newNode.intervalX, intervalY: newNode.intervalY };
    });

    const expectedNode = null;

    expect(testOrderedArray).toEqual([]);
    expect(order.hashTable).toEqual({});
    expect(order.getCoordinatesValue(50, 50)).toEqual(expectedNode);
    expect(order.maxX).toEqual(-1);
    expect(order.maxY).toEqual(-1);
  });

  it('Order methods execute correctly', () => {
    const order = new Order();
    order.fixedRows = false;
    order.fixedCols = false;
    order.gutterX = 0;
    order.gutterY = 0;
    order.items = items;

    const testOrderedArray = order.orderedArray.map((node) => {
      const newNode = { ...node };
      newNode.intervalX = new Interval1D(node.intervalX.min, node.intervalX.max);
      newNode.intervalY = new Interval1D(node.intervalY.min, node.intervalY.max);

      return { intervalX: newNode.intervalX, intervalY: newNode.intervalY };
    });

    const expectedNode = hashTable['test-2'];

    expect(testOrderedArray).toEqual(array);
    expect(order.hashTable).toEqual(hashTable);
    expect(order.getCoordinatesValue(200, 300)).toEqual(expectedNode);
    expect(order.maxX).toEqual(700);
    expect(order.maxY).toEqual(1000);
  });

  it('Order methods execute correctly, new item', () => {
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

    const updatedOrderedArray = [
      { intervalX: new Interval1D(0, 100), intervalY: new Interval1D(0, 100) },
      { intervalX: new Interval1D(0, 500), intervalY: new Interval1D(500, 1000) },
      { intervalX: new Interval1D(0, 500), intervalY: new Interval1D(1000, 1500) },
      { intervalX: new Interval1D(0, 300), intervalY: new Interval1D(200, 500) },
      { intervalX: new Interval1D(100, 300), intervalY: new Interval1D(0, 200) },
      { intervalX: new Interval1D(300, 700), intervalY: new Interval1D(0, 400) },
    ];

    const updatedHashTable = {
      ...hashTable,
      'test-5': new OrderNode(updatedItems[3], 0, 3),
    };

    const order = new Order();
    order.fixedRows = false;
    order.gutterX = 0;
    order.gutterY = 0;
    order.items = updatedItems;

    const testOrderedArray = order.orderedArray.map((node) => {
      const newNode = { ...node };
      newNode.intervalX = new Interval1D(node.intervalX.min, node.intervalX.max);
      newNode.intervalY = new Interval1D(node.intervalY.min, node.intervalY.max);

      return { intervalX: newNode.intervalX, intervalY: newNode.intervalY };
    });

    const expectedNode = hashTable['test-3'];

    expect(testOrderedArray).toEqual(updatedOrderedArray);
    expect(order.hashTable).toEqual(updatedHashTable);
    expect(order.getKey('test-4')).toEqual(hashTable['test-4']);
    expect(order.getCoordinatesValue(450, 400)).toEqual(expectedNode);
    expect(order.maxX).toEqual(700);
    expect(order.maxY).toEqual(1500);
  });

  it('Order methods execute correctly, new item, fixedRows', () => {
    const updatedItems = [
      ...items,
      {
        key: 'test-5',
        ItemComponent: TestComp,
        fixedWidth: 600,
        fixedHeight: 600,
        itemProps: {
          name: 'test-5',
          style: { userSelect: 'none', width: 500, height: 500 },
        },
      },
    ];

    const updatedOrderedArray = [
      { intervalX: new Interval1D(0, 100), intervalY: new Interval1D(0, 100) },
      { intervalX: new Interval1D(0, 500), intervalY: new Interval1D(600, 1100) },
      { intervalX: new Interval1D(0, 600), intervalY: new Interval1D(1100, 1700) },
      { intervalX: new Interval1D(0, 300), intervalY: new Interval1D(200, 500) },
      { intervalX: new Interval1D(100, 300), intervalY: new Interval1D(0, 200) },
      { intervalX: new Interval1D(300, 700), intervalY: new Interval1D(200, 600) },
    ];

    const updatedHashTable = {
      ...hashTable,
      'test-5': new OrderNode(updatedItems[3], 0, 3),
    };

    const order = new Order();
    order.fixedRows = true;
    order.gutterX = 0;
    order.gutterY = 0;
    order.items = updatedItems;

    const intervalX = new Interval1D(0, 700);
    const intervalY = new Interval1D(200, 600);

    const orderNode2 = order.getKey('test-2');
    const orderNode3 = order.getKey('test-3');
    const orderNodeArray = [orderNode2, orderNode3];

    const testOrderedArray = order.orderedArray.map((node) => {
      const newNode = { ...node };
      newNode.intervalX = new Interval1D(node.intervalX.min, node.intervalX.max);
      newNode.intervalY = new Interval1D(node.intervalY.min, node.intervalY.max);

      return { intervalX: newNode.intervalX, intervalY: newNode.intervalY };
    });

    const expectedNode = updatedHashTable['test-5'];

    expect(testOrderedArray).toEqual(updatedOrderedArray);
    expect(order.hashTable).toEqual(updatedHashTable);
    expect(order.getIntervalXY(intervalX, intervalY)).toEqual(orderNodeArray);
    expect(order.getCoordinatesValue(600, 1100)).toEqual(expectedNode);
    expect(order.maxX).toEqual(700);
    expect(order.maxY).toEqual(1700);
  });

  it('Order methods execute correctly, new item, gutterX', () => {
    const updatedOrderedArray = [
      { intervalX: new Interval1D(0, 100), intervalY: new Interval1D(0, 100) },
      { intervalX: new Interval1D(0, 500), intervalY: new Interval1D(500, 1000) },
      { intervalX: new Interval1D(0, 300), intervalY: new Interval1D(200, 500) },
      { intervalX: new Interval1D(120, 320), intervalY: new Interval1D(0, 200) },
      { intervalX: new Interval1D(320, 720), intervalY: new Interval1D(0, 400) },
    ];

    const order = new Order();
    order.fixedRows = false;
    order.gutterX = 20;
    order.gutterY = 0;
    order.items = items;

    const testOrderedArray = order.orderedArray.map((node) => {
      const newNode = { ...node };
      newNode.intervalX = new Interval1D(node.intervalX.min, node.intervalX.max);
      newNode.intervalY = new Interval1D(node.intervalY.min, node.intervalY.max);

      return { intervalX: newNode.intervalX, intervalY: newNode.intervalY };
    });

    const expectedNode = hashTable['test-0'];

    expect(testOrderedArray).toEqual(updatedOrderedArray);
    expect(order.hashTable).toEqual(hashTable);
    expect(order.getCoordinatesValue(50, 50)).toEqual(expectedNode);
    expect(order.maxX).toEqual(720);
    expect(order.maxY).toEqual(1000);
  });

  it('Order methods execute correctly, new item, gutterY', () => {
    const updatedOrderedArray = [
      { intervalX: new Interval1D(0, 100), intervalY: new Interval1D(0, 100) },
      { intervalX: new Interval1D(0, 500), intervalY: new Interval1D(540, 1040) },
      { intervalX: new Interval1D(0, 300), intervalY: new Interval1D(220, 520) },
      { intervalX: new Interval1D(100, 300), intervalY: new Interval1D(0, 200) },
      { intervalX: new Interval1D(300, 700), intervalY: new Interval1D(0, 400) },
    ];

    const order = new Order();
    order.fixedRows = false;
    order.gutterX = 0;
    order.gutterY = 20;
    order.items = items;

    const testOrderedArray = order.orderedArray.map((node) => {
      const newNode = { ...node };
      newNode.intervalX = new Interval1D(node.intervalX.min, node.intervalX.max);
      newNode.intervalY = new Interval1D(node.intervalY.min, node.intervalY.max);

      return { intervalX: newNode.intervalX, intervalY: newNode.intervalY };
    });

    const expectedNode = null;

    expect(testOrderedArray).toEqual(updatedOrderedArray);
    expect(order.hashTable).toEqual(hashTable);
    expect(order.getCoordinatesValue(800, 350)).toEqual(expectedNode);
    expect(order.maxX).toEqual(700);
    expect(order.maxY).toEqual(1040);
  });

  it('Order methods execute correctly, new item, gutterX and gutterY', () => {
    const updatedOrderedArray = [
      { intervalX: new Interval1D(0, 100), intervalY: new Interval1D(0, 100) },
      { intervalX: new Interval1D(0, 500), intervalY: new Interval1D(540, 1040) },
      { intervalX: new Interval1D(0, 300), intervalY: new Interval1D(220, 520) },
      { intervalX: new Interval1D(120, 320), intervalY: new Interval1D(0, 200) },
      { intervalX: new Interval1D(320, 720), intervalY: new Interval1D(0, 400) },
    ];

    const order = new Order();
    order.fixedRows = false;
    order.gutterX = 20;
    order.gutterY = 20;
    order.items = items;

    const testOrderedArray = order.orderedArray.map((node) => {
      const newNode = { ...node };
      newNode.intervalX = new Interval1D(node.intervalX.min, node.intervalX.max);
      newNode.intervalY = new Interval1D(node.intervalY.min, node.intervalY.max);

      return { intervalX: newNode.intervalX, intervalY: newNode.intervalY };
    });

    const expectedNode = hashTable['test-4'];

    expect(testOrderedArray).toEqual(updatedOrderedArray);
    expect(order.hashTable).toEqual(hashTable);
    expect(order.getCoordinatesValue(0, 1040)).toEqual(expectedNode);
    expect(order.maxX).toEqual(720);
    expect(order.maxY).toEqual(1040);
  });

  it('Order methods execute correctly, new item, fixedRows, gutterX, and gutterY', () => {
    const updatedOrderedArray = [
      { intervalX: new Interval1D(0, 100), intervalY: new Interval1D(0, 100) },
      { intervalX: new Interval1D(0, 500), intervalY: new Interval1D(640, 1140) },
      { intervalX: new Interval1D(0, 300), intervalY: new Interval1D(220, 520) },
      { intervalX: new Interval1D(120, 320), intervalY: new Interval1D(0, 200) },
      { intervalX: new Interval1D(320, 720), intervalY: new Interval1D(220, 620) },
    ];

    const order = new Order();
    order.fixedRows = true;
    order.gutterX = 20;
    order.gutterY = 20;
    order.items = items;

    const testOrderedArray = order.orderedArray.map((node) => {
      const newNode = { ...node };
      newNode.intervalX = new Interval1D(node.intervalX.min, node.intervalX.max);
      newNode.intervalY = new Interval1D(node.intervalY.min, node.intervalY.max);

      return { intervalX: newNode.intervalX, intervalY: newNode.intervalY };
    });

    const expectedNode = hashTable['test-3'];

    expect(testOrderedArray).toEqual(updatedOrderedArray);
    expect(order.hashTable).toEqual(hashTable);
    expect(order.getCoordinatesValue(720, 620)).toEqual(expectedNode);
    expect(order.maxX).toEqual(720);
    expect(order.maxY).toEqual(1140);
  });
});
