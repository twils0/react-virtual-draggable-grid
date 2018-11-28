import binarySearchX from './binarySearchX';

// generate an array of orderNodes to render
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

    for (let iY = 0; iY < order.length; iY += 1) {
      const { leftIndex, rightIndex } = binarySearchX({
        order,
        indexY: iY,
        leftCutoff,
        rightCutoff,
      });

      if (leftIndex > -1) {
        for (let iX = leftIndex; iX <= rightIndex; iX += 1) {
          const orderNode = order[iY][iX];
          const { top, height } = orderNode;
          const bottom = top + height;

          if (topCutoff <= top && bottomCutoff >= bottom) {
            visibleOrder.push(orderNode);
          }
        }
      }
    }
  }

  return visibleOrder;
};

export default handleVirtualization;
