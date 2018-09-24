import React from 'react';
import PropTypes from 'prop-types';

class ListItem extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      height, opacity, shadow, x, y, zIndex,
    } = this.props.style;
    const { indexX, indexY } = this.props.data;
    const nextStyle = nextProps.style;
    const nextData = nextProps.data;

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
    if (indexX !== nextData.indexX) {
      return true;
    }
    if (indexY !== nextData.indexY) {
      return true;
    }

    return false;
  }

  render() {
    const {
      style, data, ListItemStyles, handleMouseDown, handleTouchStart,
    } = this.props;

    const {
      width, height, opacity, shadow, x, y, zIndex,
    } = style;
    const { item, coordinates } = data;

    const boxShadowString = `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${1.2 * shadow}px 0px`;
    const transformString = `translate3d(${x}px, ${y}px, 0)`;

    return (
      <li
        className="rvdl-list-item"
        data-coordinates={coordinates}
        data-x={x}
        data-y={y}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: 'absolute',
          zIndex,
          overflowX: 'hidden',
          overflowY: 'hidden',
          outline: 'none',
          boxSizing: 'border-box',
          width,
          height,
          opacity,
          background: 'white',
          boxShadow: boxShadowString,
          transform: transformString,
          ...ListItemStyles,
        }}
      >
        <button
          type="button"
          onClick={() => {
            console.log('test button');
          }}
          style={{ width: '100px', height: '100px', background: 'red' }}
        >
          {item.name}
        </button>
      </li>
    );
  }
}

ListItem.propTypes = {
  style: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  ListItemStyles: PropTypes.object,
  handleMouseDown: PropTypes.func.isRequired,
  handleTouchStart: PropTypes.func.isRequired,
};

ListItem.defaultProps = {
  ListItemStyles: {},
};

export default ListItem;
