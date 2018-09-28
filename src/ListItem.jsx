import React from 'react';
import PropTypes from 'prop-types';

import preventDrag from './Utilities/preventDrag';

class ListItem extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      opacity, shadow, x, y, zIndex,
    } = this.props.style;
    const { item, orderObject } = this.props.data;
    const { width, height } = orderObject;
    const nextStyle = nextProps.style;
    const nextData = nextProps.data;

    if (width !== nextStyle.width) {
      return true;
    }
    if (height !== nextStyle.height) {
      return true;
    }
    if (opacity !== nextStyle.opacity) {
      return true;
    }
    if (shadow !== nextStyle.shadow) {
      return true;
    }
    if (x !== nextStyle.x) {
      return true;
    }
    if (y !== nextStyle.y) {
      return true;
    }
    if (zIndex !== nextStyle.zIndex) {
      return true;
    }
    if (item.key !== nextData.item.key) {
      return true;
    }

    return false;
  }

  handleSizeRef = (element) => {
    if (element) {
      const { data, updateSize } = this.props;
      const {
        item, orderObject, orderIndexX, orderIndexY,
      } = data;
      const { fixedWidth, fixedHeight } = item || {};
      const { width, height } = orderObject;
      const { offsetWidth, offsetHeight } = element;

      if (
        (!fixedWidth && offsetWidth && width !== offsetWidth)
        || (!fixedHeight && offsetHeight && height !== offsetHeight)
      ) {
        updateSize({
          orderIndexX,
          orderIndexY,
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    }
  };

  render() {
    const {
      style, data, ListItemStyles, handleMouseDown, handleTouchStart,
    } = this.props;

    const {
      opacity, shadow, x, y, zIndex,
    } = style;
    const { item } = data;
    const boxShadowString = `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${1.2 * shadow}px 0px`;
    const transformString = `translate3d(${x}px, ${y}px, 0)`;
    const {
      key, ItemComponent, itemProps, fixedWidth, fixedHeight,
    } = item || {};

    return (
      <li
        ref={this.handleSizeRef}
        className="rvdl-list-item"
        id={key}
        key={key}
        data-x={x}
        data-y={y}
        style={{
          position: 'absolute',
          overflowX: 'hidden',
          overflowY: 'hidden',
          zIndex,
          outline: 'none',
          userSelect: 'none',
          MozUserSelect: 'none',
          boxSizing: 'border-box',
          width: fixedWidth || 'auto',
          height: fixedHeight || 'auto',
          opacity,
          background: 'white',
          boxShadow: boxShadowString,
          transform: transformString,
          ...ListItemStyles,
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

ListItem.propTypes = {
  style: PropTypes.object.isRequired,
  data: PropTypes.shape({
    items: PropTypes.object,
    orderObject: PropTypes.object,
    orderIndexX: PropTypes.number,
    orderIndexY: PropTypes.number,
  }).isRequired,
  ListItemStyles: PropTypes.object,
  updateSize: PropTypes.func.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
  handleTouchStart: PropTypes.func.isRequired,
};

ListItem.defaultProps = {
  ListItemStyles: {},
};

export default ListItem;
