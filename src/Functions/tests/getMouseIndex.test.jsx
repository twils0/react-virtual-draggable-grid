import getMouseIndex from '../getMouseIndex';

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

describe('getMouseIndex', () => {
  it('getMouseIndex executes correctly, between left and right, top and bottom', () => {
    const visibleOrder = [...order[0], ...order[1], ...order[2]];
    const mouseX = 20;
    const mouseY = 50;
    const toIndexX = 0;
    const toIndexY = 0;

    const result = getMouseIndex({
      order,
      visibleOrder,
      mouseX,
      mouseY,
    });

    expect(result).toEqual({ toIndexX, toIndexY });
  });

  it('getMouseIndex executes correctly, left of the grid', () => {
    const visibleOrder = [...order[0], ...order[1], ...order[2]];
    const mouseX = -100;
    const mouseY = 50;
    const toIndexX = 0;
    const toIndexY = 0;

    const result = getMouseIndex({
      order,
      visibleOrder,
      mouseX,
      mouseY,
    });

    expect(result).toEqual({ toIndexX, toIndexY });
  });

  it('getMouseIndex executes correctly, right of the grid', () => {
    const visibleOrder = [...order[0], ...order[1], ...order[2]];
    const mouseX = 1000;
    const mouseY = 50;
    const toIndexX = 2;
    const toIndexY = 0;

    const result = getMouseIndex({
      order,
      visibleOrder,
      mouseX,
      mouseY,
    });

    expect(result).toEqual({ toIndexX, toIndexY });
  });

  it('getMouseIndex executes correctly, above the grid', () => {
    const visibleOrder = [...order[0], ...order[1], ...order[2]];
    const mouseX = 20;
    const mouseY = -100;
    const toIndexX = 0;
    const toIndexY = 0;

    const result = getMouseIndex({
      order,
      visibleOrder,
      mouseX,
      mouseY,
    });

    expect(result).toEqual({ toIndexX, toIndexY });
  });

  it('getMouseIndex executes correctly, below the grid', () => {
    const visibleOrder = [...order[0], ...order[1], ...order[2]];
    const mouseX = 50;
    const mouseY = 1500;
    const toIndexX = 0;
    const toIndexY = 3;

    const result = getMouseIndex({
      order,
      visibleOrder,
      mouseX,
      mouseY,
    });

    expect(result).toEqual({ toIndexX, toIndexY });
  });
});
