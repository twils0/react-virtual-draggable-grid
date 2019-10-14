import preventDrag from '../preventDrag';

const clickEvent = { preventDefault: jest.fn() };

describe('preventDrag', () => {
  it('correctly calls preventDefault and returns false', () => {
    const result = preventDrag(clickEvent);

    expect(clickEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(result).toEqual(false);
  });
});
