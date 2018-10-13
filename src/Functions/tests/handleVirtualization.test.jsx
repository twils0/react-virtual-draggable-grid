import handleVirtualization from '../handleVirtualization';

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

describe('handleVirtualization', () => {
  it('handleVirtualization executes correctly, no visibleOrder', () => {
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 0;
    const containerHeight = 0;

    const visibleOrder = [];

    const result = handleVirtualization({
      order,
      keys,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
    });

    expect(result).toEqual(visibleOrder);
  });

  it('handleVirtualization executes correctly 1', () => {
    const scrollLeft = 1000;
    const scrollTop = 1000;
    const containerWidth = 0;
    const containerHeight = 0;

    const visibleOrder = [];

    const result = handleVirtualization({
      order,
      keys,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
    });

    expect(result).toEqual(visibleOrder);
  });

  it('handleVirtualization executes correctly 2', () => {
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 300;
    const containerHeight = 200;
    const leeway = 0;
    const scrollBuffer = 0;

    const visibleOrder = [keys[order[0][0].key], keys[order[0][1].key]];

    const result = handleVirtualization({
      order,
      keys,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
      leeway,
      scrollBuffer,
    });

    expect(result).toEqual(visibleOrder);
  });

  it('handleVirtualization executes correctly, test leeway', () => {
    const scrollLeft = 0;
    const scrollTop = 0;
    const containerWidth = 600;
    const containerHeight = 490;
    const leeway = 0.1;
    const scrollBuffer = 0;

    const visibleOrder = Object.values(keys);
    visibleOrder.splice(3, 2);

    const result = handleVirtualization({
      order,
      keys,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
      leeway,
      scrollBuffer,
    });

    expect(result).toEqual(visibleOrder);
  });

  it('handleVirtualization executes correctly, test scrollBuffer', () => {
    const scrollLeft = 500;
    const scrollTop = 500;
    const containerWidth = 0;
    const containerHeight = 0;
    const leeway = 0;
    const scrollBuffer = 500;

    const visibleOrder = Object.values(keys);

    const result = handleVirtualization({
      order,
      keys,
      scrollLeft,
      scrollTop,
      containerWidth,
      containerHeight,
      leeway,
      scrollBuffer,
    });

    expect(result).toEqual(visibleOrder);
  });
});
