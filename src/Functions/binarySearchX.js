// search for the leftIndex, representing the smallest
// orderNode left value immediately after the left cutoff,
// and the rightIndex, representing the largest orderNode
// right (left + width) value immedately before the right
// cutoff
const binarySearchX = ({
  order, indexY, start, end, leftCutoff, rightCutoff,
}) => {
  let startLeft = start || 0;
  const cleanedEnd = end || (order[indexY] && order[indexY].length - 1);
  let endLeft = cleanedEnd;
  let leftIndex = -1;
  let rightIndex = -1;

  if (leftCutoff < rightCutoff) {
    if (startLeft === endLeft) {
      const orderObjectLeft = order[indexY][startLeft];
      const { left } = orderObjectLeft;

      if (left >= leftCutoff) {
        leftIndex = startLeft;
      }
    }

    while (startLeft < endLeft && leftIndex === -1) {
      const midLeft = Math.floor((startLeft + endLeft) / 2);
      const orderObjectLeft = order[indexY][midLeft];
      const nextOrderObjectLeft = order[indexY][midLeft + 1];
      const { left } = orderObjectLeft;
      const nextLeft = nextOrderObjectLeft && nextOrderObjectLeft.left;

      if (left < leftCutoff && nextLeft && nextLeft < leftCutoff) {
        startLeft += 1;
      } else if (left > leftCutoff && nextLeft && nextLeft > leftCutoff) {
        if (midLeft === startLeft) {
          leftIndex = midLeft;
        } else {
          endLeft -= 1;
        }
      } else if (nextLeft === leftCutoff) {
        leftIndex = midLeft + 1;
      } else {
        leftIndex = midLeft;
      }
    }

    // if leftIndex is not found, do not attempt to find right
    // index; all or nothing
    if (leftIndex > -1) {
      // rightIndex cannot be less than leftIndex, so start there
      let startRight = leftIndex;
      let endRight = cleanedEnd;

      if (startRight === endRight) {
        const orderObjectRight = order[indexY][startRight];
        const { left, width } = orderObjectRight;
        const right = left + width;

        if (right <= rightCutoff) {
          rightIndex = startRight;
        }
      }

      while (startRight < endRight && rightIndex === -1) {
        const midRight = Math.floor((startRight + endRight) / 2);
        const orderObjectRight = order[indexY][midRight];
        const nextOrderObjectRight = order[indexY][midRight + 1];
        const { left, width } = orderObjectRight;
        const right = left + width;
        const nextRight = nextOrderObjectRight && nextOrderObjectRight.left + nextOrderObjectRight.width;

        if (right < rightCutoff && nextRight && nextRight < rightCutoff) {
          if (midRight + 1 === endRight) {
            rightIndex = midRight + 1;
          } else {
            startRight += 1;
          }
        } else if (right > rightCutoff && nextRight && nextRight > rightCutoff) {
          endRight -= 1;
        } else if (nextRight === rightCutoff) {
          rightIndex = midRight + 1;
        } else {
          rightIndex = midRight;
        }
      }

      // if rightIndex is not found, set leftIndex to -1; all or nothing
      if (rightIndex === -1) {
        leftIndex = -1;
      }
    }
  }

  return { leftIndex, rightIndex };
};

export default binarySearchX;
