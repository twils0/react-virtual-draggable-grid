const handleVirtualization = ({
  order,
  keys,
  scrollLeft,
  scrollTop,
  containerWidth,
  containerHeight,
}) => {
  const visibleKeys = [];
  const leeway = 0.6;
  const scrollBuffer = 300;
  const leftCutoff = (scrollLeft || 0) * (1 - leeway) - scrollBuffer;
  const topCutoff = (scrollTop || 0) * (1 - leeway) - scrollBuffer;
  const rightCutoff = ((scrollLeft || 0) + containerWidth) * (1 + leeway) + scrollBuffer;
  const bottomCutoff = ((scrollTop || 0) + containerHeight) * (1 + leeway) + scrollBuffer;

  order.forEach((orderRow) => {
    orderRow.forEach((orderObject) => {
      const {
        left, top, width, height,
      } = orderObject;
      const right = left + width;
      const bottom = top + height;

      // render items within cutoff and the
      // current or last pressed item
      if (
        left >= leftCutoff
        && top >= topCutoff
        && right <= rightCutoff
        && bottom <= bottomCutoff
      ) {
        const { key } = orderObject;
        visibleKeys.push({ ...keys[key] });
      }
    });
  });

  return visibleKeys;
};

export default handleVirtualization;
