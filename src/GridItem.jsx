import React from 'react';
import PropTypes from 'prop-types';

import preventDrag from './Utilities/preventDrag';

class GridItem extends React.Component {
  // prevent unnecessary re-renders; there could be many GridItem
  // components rendered at one time
  shouldComponentUpdate(nextProps) {
    const {
      isPressed, wasPressed, width, height, x, y,
    } = this.props.style;
    const nextStyle = nextProps.style;

    if (isPressed !== nextStyle.isPressed) {
      return true;
    }
    if (wasPressed !== nextStyle.wasPressed) {
      return true;
    }
    if (width !== nextStyle.width) {
      return true;
    }
    if (height !== nextStyle.height) {
      return true;
    }
    if (x !== nextStyle.x) {
      return true;
    }
    if (y !== nextStyle.y) {
      return true;
    }
    if (this.props.data.itemsBool !== nextProps.data.itemsBool) {
      return true;
    }

    return false;
  }

  render() {
    const {
      style,
      data,
      transitionDuration,
      transitionTimingFunction,
      transitionDelay,
      shadowMultiple,
      shadowHRatio,
      shadowVRatio,
      shadowBlur,
      shadowBlurRatio,
      shadowSpread,
      shadowSpreadRatio,
      shadowColor,
      GridItemStyles,
      handleMouseDown,
      handleTouchStart,
    } = this.props;
    const {
      isPressed, wasPressed, width, height, x, y,
    } = style;
    const { item } = data;
    const { key, ItemComponent, itemProps } = item;

    const transitionSetup = `${transitionDuration} ${transitionTimingFunction} ${transitionDelay}`;
    const transitionPressed = `box-shadow ${transitionSetup},
    width ${transitionSetup},
    height ${transitionSetup}`;
    // transform transition disrupts the dragging process;
    // only add transform to transition when GridItem is not pressed
    const transition = isPressed
      ? transitionPressed
      : `transform ${transitionSetup},
      ${transitionPressed}`;

    // pressed GridItems, while both pressed and returning to their position,
    // should hover over other items
    const zIndexAtRest = wasPressed ? 98 : 1;
    const zIndex = isPressed ? 99 : zIndexAtRest;
    const shadow = isPressed ? shadowMultiple : 0;
    const boxShadow = `${shadow * shadowHRatio}px
    ${shadow * shadowVRatio}px
    ${typeof shadowBlur === 'number' ? shadowBlur : shadow * shadowBlurRatio}px
    ${typeof shadowSpread === 'number' ? shadowSpread : shadow * shadowSpreadRatio}px
    ${shadowColor}`;
    const transform = `translate3d(${x}px, ${y}px, 0)`;
    // let the browser know that transform is going to be working overtime
    const willChange = 'transform';

    // key prop excluded for grid items to allow for easy updates
    // when external changes are made to itemProps and ItemComponent
    return (
      <li
        id={key}
        className="rvdl-grid-item"
        data-x={x}
        data-y={y}
        style={{
          overflowX: 'hidden',
          overflowY: 'hidden',
          userSelect: 'none',
          MozUserSelect: 'none',
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          background: 'transparent',
          ...GridItemStyles,
          position: 'absolute',
          width,
          height,
          MozTransition: transition,
          WebkitTransition: transition,
          msTransition: transition,
          transition,
          zIndex,
          boxShadow,
          WebkitTransform: transform,
          MozTransform: transform,
          msTransform: transform,
          transform,
          willChange,
          WebkitBackfaceVisibility: 'hidden',
          MozBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          WebkitPerspective: 1000,
          MozPerspective: 1000,
          perspective: 1000,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDragStart={preventDrag}
      >
        {item && ItemComponent && <ItemComponent {...itemProps} />}
      </li>
    );
  }
}

GridItem.propTypes = {
  style: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  data: PropTypes.shape({
    item: PropTypes.object,
    isPressed: PropTypes.bool,
    wasPressed: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
  fixedWidthAll: PropTypes.number,
  fixedHeightAll: PropTypes.number,
  transitionDuration: PropTypes.string.isRequired,
  transitionTimingFunction: PropTypes.string.isRequired,
  transitionDelay: PropTypes.string,
  shadowMultiple: PropTypes.number.isRequired,
  shadowHRatio: PropTypes.number.isRequired,
  shadowVRatio: PropTypes.number.isRequired,
  shadowBlur: PropTypes.number,
  shadowBlurRatio: PropTypes.number.isRequired,
  shadowSpread: PropTypes.number,
  shadowSpreadRatio: PropTypes.number.isRequired,
  shadowColor: PropTypes.string.isRequired,
  GridItemStyles: PropTypes.object.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
  handleTouchStart: PropTypes.func.isRequired,
};

GridItem.defaultProps = {
  fixedWidthAll: null,
  fixedHeightAll: null,
  transitionDelay: '',
  shadowBlur: null,
  shadowSpread: null,
};

export default GridItem;
