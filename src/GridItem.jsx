import React from 'react';
import PropTypes from 'prop-types';

import preventDrag from './Utilities/preventDrag';

class GridItem extends React.Component {
  constructor(props) {
    super(props);

    const { width, height } = this.props.data;

    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }

    this.gridItemRef = React.createRef();
  }

  componentDidMount() {
    const { data, fixedWidthAll, fixedHeightAll } = this.props;
    const { item } = data;
    const { fixedWidth, fixedHeight } = item;

    if ((!fixedWidthAll && !fixedWidth) || (!fixedHeight && !fixedHeightAll)) {
      this.updateGridItemSize();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { x, y } = this.props.style;
    const { item, width, height } = this.props.data;
    const nextStyle = nextProps.style;
    const nextData = nextProps.data;

    if (item.key !== nextData.item.key) {
      return true;
    }
    if (width !== nextData.width) {
      return true;
    }
    if (height !== nextData.height) {
      return true;
    }
    if (x !== nextStyle.x) {
      return true;
    }
    if (y !== nextStyle.y) {
      return true;
    }

    return true;
  }

  componentDidUpdate() {
    const { data, fixedWidthAll, fixedHeightAll } = this.props;
    const { item } = data;
    const { fixedWidth, fixedHeight } = item;

    if ((!fixedWidthAll && !fixedWidth) || (!fixedHeight && !fixedHeightAll)) {
      this.updateGridItemSize();
    }
  }

  updateGridItemSize = () => {
    if (this.gridItemRef && this.gridItemRef.current) {
      const { offsetWidth, offsetHeight } = this.gridItemRef.current;

      if (offsetWidth !== this.width || offsetHeight !== this.height) {
        const { data } = this.props;
        const { item } = data;
        const { key } = item;

        this.width = offsetWidth;
        this.height = offsetHeight;

        this.props.updateSize({
          key,
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    }
  };

  render() {
    const {
      style,
      data,
      fixedWidthAll,
      fixedHeightAll,
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
    const { x, y } = style;
    const { item, isPressed, wasPressed } = data;
    const {
      key, ItemComponent, itemProps, fixedWidth, fixedHeight,
    } = item;

    const transitionSetup = `${transitionDuration} ${transitionTimingFunction} ${transitionDelay}`;
    const transitionPressed = `box-shadow ${transitionSetup},
    width ${transitionSetup},
    height ${transitionSetup}`;
    const transition = isPressed
      ? transitionPressed
      : `transform ${transitionSetup},
      ${transitionPressed}`;

    const zIndexAtRest = wasPressed ? 98 : 1;
    const zIndex = isPressed ? 99 : zIndexAtRest;
    const shadow = isPressed ? shadowMultiple : 0;
    const boxShadow = `${shadow * shadowHRatio}px ${shadow * shadowVRatio}px ${shadowBlur
      || shadow * shadowBlurRatio}px ${shadowSpread || shadow * shadowSpreadRatio}px ${shadowColor}`;
    const transform = `translate3d(${x}px, ${y}px, 0)`;

    return (
      <li
        id={key}
        key={key}
        className="rvdl-grid-item"
        ref={this.gridItemRef}
        data-x={x}
        data-y={y}
        style={{
          overflowX: 'hidden',
          overflowY: 'hidden',
          outline: 'none',
          userSelect: 'none',
          MozUserSelect: 'none',
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          background: 'transparent',
          ...GridItemStyles,
          position: 'absolute',
          width: fixedWidthAll || fixedWidth || 'auto',
          height: fixedHeightAll || fixedHeight || 'auto',
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
