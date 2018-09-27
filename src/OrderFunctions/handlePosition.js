const handlePosition = ({
  order, width, height, indexX, indexY,
}) => {
  let left = -1;
  let top = -1;

  if (indexX === 0 && indexY === 0) {
    left = 0;
    top = 0;

    return { left, top };
  }

  const upRow = indexY > 0 && order[indexY - 1];
  const currentRow = order[indexY];
  const leftObject = currentRow && currentRow[indexX - 1];
  const leftPosRight = leftObject ? leftObject.left + leftObject.width : 0;

  if (upRow) {
    const leftPosBottom = leftObject ? leftObject.top + leftObject.height : 0;
    const currentPosRight = leftObject ? leftPosRight + width : 0;
    let widthGap = 0;
    let maxHeight = 0;

    upRow.forEach((object) => {
      const posRight = object.left + object.width;

      if (object.left > leftPosRight || currentPosRight > posRight) {
        const posBottom = object.top + object.height;

        if (posBottom > leftPosBottom && !widthGap) {
          widthGap = object.left - leftPosRight;
        }
        if (posBottom > maxHeight) {
          maxHeight = posBottom;
        }
      }
    });

    if (false && widthGap <= width && widthGap > 0) {
      ({ left, top } = handlePosition({
        order,
        width,
        height,
        indexX: indexX - 1,
        indexY,
      }));
    } else {
      left = leftPosRight;
      top = maxHeight;
    }
  } else {
    left = leftPosRight;
    top = 0;
  }

  return { left, top };
};

export default handlePosition;
