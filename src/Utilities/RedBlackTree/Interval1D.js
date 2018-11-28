// 1D interval used to build 2D interval
class Interval1D {
  constructor(min, max) {
    if (min <= max) {
      this.min = min;
      this.max = max;
      this.maxEndpoint = max;
    }
  }

  contains(otherInterval) {
    const { min, max } = otherInterval;

    return this.min <= min && this.max >= max;
  }

  intersects(otherInterval) {
    const { min, max } = otherInterval;

    if (this.max <= min) return false;
    if (this.min >= max) return false;

    return true;
  }

  equals(otherInterval) {
    if (this === otherInterval) return true;

    const { min, max } = otherInterval;

    if (this.min === min && this.max === max) {
      return true;
    }

    return false;
  }

  compareCoordinate(coord) {
    if (this.max < coord) return 1;
    if (this.min > coord) return -1;

    return 0;
  }

  compareMin(otherInterval) {
    const { min, max } = otherInterval;

    if (this.min < min) return -1;
    if (this.min > min) return 1;
    if (this.max < max) return -1;
    if (this.max > max) return 1;

    return 0;
  }

  compareMax(otherInterval) {
    const { min, max } = otherInterval;

    if (this.max < max) return -1;
    if (this.max > max) return 1;
    if (this.min < min) return -1;
    if (this.min > min) return 1;

    return 0;
  }
}

export default Interval1D;
