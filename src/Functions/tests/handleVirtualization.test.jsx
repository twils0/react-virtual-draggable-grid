import handleVirtualization from '../handleVirtualization';

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

const defaultVisibleOrder = [];
order.forEach(row => row.forEach(orderObject => defaultVisibleOrder.push(orderObject)));

describe('handleVirtualization', () => {
  it('handleVirtualization executes correctly, no visibleOrder', () => {
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 0;
    const containerHeight = 0;
    const leeway = 0;
    const scrollBufferX = 0;
    const scrollBufferY = 0;
    const gutterX = 0;
    const gutterY = 0;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;

    const visibleOrder = [];

    const result = handleVirtualization({
      order,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
      leeway,
      scrollBufferX,
      scrollBufferY,
      gutterX,
      gutterY,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
    });

    expect(result).toEqual(visibleOrder);
  });

  it('handleVirtualization executes correctly 1', () => {
    const scrollLeft = 1000;
    const scrollTop = 1000;
    const containerWidth = 0;
    const containerHeight = 0;
    const leeway = 0;
    const scrollBufferX = 0;
    const scrollBufferY = 0;
    const gutterX = 0;
    const gutterY = 0;
    const fixedRows = null;
    const fixedColumns = null;
    const fixedWidthAll = null;
    const fixedHeightAll = null;

    const visibleOrder = [];

    const result = handleVirtualization({
      order,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
      leeway,
      scrollBufferX,
      scrollBufferY,
      gutterX,
      gutterY,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
    });

    expect(result).toEqual(visibleOrder);
  });

  it('handleVirtualization executes correctly 2', () => {
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 300;
    const containerHeight = 200;
    const leeway = 0;
    const scrollBufferX = 0;
    const scrollBufferY = 0;

    const visibleOrder = [...defaultVisibleOrder];
    visibleOrder.splice(2, 3);

    const result = handleVirtualization({
      order,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
      leeway,
      scrollBufferX,
      scrollBufferY,
    });

    expect(result).toEqual(visibleOrder);
  });

  it('handleVirtualization executes correctly, test leeway', () => {
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 600;
    const containerHeight = 490;
    const leeway = 0.1;
    const scrollBufferX = 0;
    const scrollBufferY = 0;

    const visibleOrder = [...defaultVisibleOrder];
    visibleOrder.splice(3, 2);

    const result = handleVirtualization({
      order,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
      leeway,
      scrollBufferX,
      scrollBufferY,
    });

    expect(result).toEqual(visibleOrder);
  });

  it('handleVirtualization executes correctly, test scrollBufferX and scrollBufferY', () => {
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 200;
    const containerHeight = 200;
    const leeway = 0;
    const scrollBufferX = 300;
    const scrollBufferY = 300;

    const visibleOrder = [...defaultVisibleOrder];
    visibleOrder.splice(3, 2);

    const result = handleVirtualization({
      order,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
      leeway,
      scrollBufferX,
      scrollBufferY,
    });

    expect(result).toEqual(visibleOrder);
  });
});
