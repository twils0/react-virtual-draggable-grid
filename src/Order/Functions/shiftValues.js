// shift the left field by xDiff and the top field by yDiff
const shiftValues = (valuesArray, xDiff, yDiff) => {
  if (valuesArray && valuesArray.length > 0) {
    valuesArray.forEach((value) => {
      const {
        left, top, width, height,
      } = value;
      const right = left + width;
      const bottom = top + height;

      value.left += xDiff;
      value.top += yDiff;

      const intervalX = new Interval1D(left, right);
      const intervalY = new Interval1D(top, bottom);
      const newIntervalX = new Interval1D(value.left, right + xDiff);
      const newIntervalY = new Interval1D(value.top, bottom + yDiff);
    });
  }
};
