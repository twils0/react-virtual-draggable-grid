// generate an array of orderObjects to render
const handleVirtualization = ({
  order,
  scrollLeft,
  scrollTop,
  containerWidth,
  containerHeight,
  leeway,
  scrollBufferX,
  scrollBufferY,
}) => {
  const visibleOrder = [];

  const cleanedScrollLeft = scrollLeft > 0 ? scrollLeft : 0;
  const cleanedScrollTop = scrollTop > 0 ? scrollTop : 0;
  const cleanedContainerWidth = containerWidth > 0 ? containerWidth : 0;
  const cleanedContainerHeight = containerHeight > 0 ? containerHeight : 0;

  const scrollRight = cleanedScrollLeft + cleanedContainerWidth;
  const scrollBottom = cleanedScrollTop + cleanedContainerHeight;

  if (scrollRight > 0 && scrollBottom > 0) {
    const leftCutoff = cleanedScrollLeft - containerWidth * leeway - scrollBufferX;
    const topCutoff = cleanedScrollTop - containerHeight * leeway - scrollBufferY;
    const rightCutoff = scrollRight + containerWidth * leeway + scrollBufferX;
    const bottomCutoff = scrollBottom + containerHeight * leeway + scrollBufferY;

    // bottomBool is used to stop the first (y) for loop, after it is certain
    // that orderObjects at higher indexes will not meet the bottomCutoff
    let bottomBool = true;

    for (let iY = 0; iY < order.length && bottomBool; iY += 1) {
      const orderRow = order[iY];
      // rightBool is used to stop the second (x) for loop, after it is certain
      // that orderObjects at higher indexes will not meet the rightCutoff
      let rightBool = true;

      for (let iX = 0; iX < orderRow.length && rightBool; iX += 1) {
        const orderObject = orderRow[iX];
        const {
          left, top, width, height,
        } = orderObject;
        const right = left + width;
        const bottom = top + height;

        if (
          left >= leftCutoff
          && top >= topCutoff
          && right <= rightCutoff
          && bottom <= bottomCutoff
        ) {
          visibleOrder.push(orderObject);
        } else if (right > rightCutoff) {
          rightBool = false;
        } else if (!bottomBool && bottom > bottomCutoff) {
          bottomBool = false;
        }
      }
    }
  }

  return visibleOrder;
};

export default handleVirtualization;
