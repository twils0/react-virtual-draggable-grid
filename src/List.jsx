import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';

import ListItem from './ListItem';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPressed: false,
      leftDeltaX: 0,
      topDeltaY: 0,
      mouseX: 0,
      mouseY: 0,
      pressedCoordinates: '',
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClick);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove, false);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('touchend', this.handleTouchEnd, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  getOrderIndex = (coordinates) => {
    const { order } = this.props;
    let orderIndexX = -1;
    let orderIndexY = -1;

    // may want to consider optimization options in the future
    order.forEach((row, indexY) => {
      if (row) {
        const indexX = row.indexOf(coordinates);

        if (indexX > -1) {
          orderIndexX = indexX;
          orderIndexY = indexY;
        }
      }
    });

    return { orderIndexX, orderIndexY };
  };

  shiftUpDown = (order, toIndexX, toIndexY, shiftUp) => {
    if (shiftUp) {
      const row = order[toIndexY];
    }
  };

  changeOrder = (fromIndexX, fromIndexY, toIndexX, toIndexY, direction) => {
    const { order, maxRowCount, maxColCount } = this.props;
    const newOrder = [...order];
    const oldRow = newOrder[fromIndexY];

    // maxRowCount and maxColCount defaults to 0 (falsy)

    if (oldRow) {
      const coordinates = oldRow[fromIndexX];

      if (coordinates) {
        const fromRow = newOrder[fromIndexY];

        if (fromRow.length === 1) {
          if (!maxColCount) {
            newOrder.splice(fromIndexY, 1);

          } else {
            fromRow[fromIndexX] = null;
          }
        } else if (!maxColCount) {
          fromRow.splice(fromIndexX, 1);
        } else {
          fromRow[fromIndexX] = null;
        }

        const toRow = newOrder[toIndexY];

        if (!toRow) {
          const newOrderLen = newOrder.length;
          const maxIndexY = !maxRowCount ? newOrderLen : maxRowCount;
          const indexY = toIndexY > maxIndexY ? maxIndexY : toIndexY;
          const maxIndexX = maxColCount;
          const indexX = toIndexX > maxIndexX ? maxIndexX : toIndexX;

          if (!maxRowCount) {
            newOrder[indexY] = [coordinates];
          } else {
            newOrder[indexY] = [];
            newOrder[indexY][indexX] = coordinates;
          }
        } else if (maxRowCount && toRow[toIndexX]) {
          if (direction === 'left' || direction === 'right') {
            toRow.splice(toIndexX, 0, coordinates);
          }
        } else if (maxRowCount) {
          toRow[toIndexX] = coordinates;
        } else {
          toRow.splice(toIndexX, 0, coordinates);
        }

        return newOrder;
      }
    }

    return order;
  };

  clamp = (n, min, max) => Math.max(Math.min(Math.round(n), max), min);

  handleClick = (event) => {
    // event.preventDefault();
    // event.stopPropagation();
  };

  handleMouseDown = (event) => {
    const { pageX, pageY } = event;
    let { target } = event;
    let count = 0;
    let liElement = null;

    while (!liElement && count <= 10) {
      if (target) {
        if (target.className === 'rvdl-list-item') {
          liElement = target;
        } else {
          target = target.parentElement;
        }
      }

      count += 1;
    }

    if (liElement) {
      const { dataset } = liElement;
      const { x, y, coordinates } = dataset;
      const xFloat = parseFloat(x);
      const yFloat = parseFloat(y);

      console.log('mouse down');

      this.setState({
        isPressed: true,
        leftDeltaX: pageX - xFloat,
        topDeltaY: pageY - yFloat,
        mouseX: xFloat,
        mouseY: yFloat,
        pressedCoordinates: coordinates,
      });
    }
  };

  handleTouchStart = (event) => {
    event.preventDefault();

    this.handleMouseDown(event.changedTouches[0]);

    return false;
  };

  handleMouseMove = (event) => {
    if (this.state.isPressed) {
      const { pageX, pageY } = event;
      const {
        order, rowWidth, rowHeight, maxColCount, maxRowCount,
      } = this.props;
      const { leftDeltaX, topDeltaY, pressedCoordinates } = this.state;

      const { orderIndexX, orderIndexY } = this.getOrderIndex(pressedCoordinates);

      const mouseX = pageX - leftDeltaX;
      const mouseY = pageY - topDeltaY;
      const unroundedIndexY = mouseY / rowHeight;
      const unroundedIndexX = mouseX / rowWidth;
      const currentIndexY = this.clamp(unroundedIndexY,
        0,
        !maxRowCount ? order.length : maxRowCount);
      const row = order[currentIndexY];
      const currentIndexX = this.clamp(
        unroundedIndexX,
        0,
        row ? row.length : maxColCount,
      );
      const yAxis = currentIndexY - unroundedIndexY;
      const xAxis = currentIndexX - unroundedIndexX;
      let direction = null;

      if (Math.abs(xAxis) >= Math.abs(yAxis)) {
        if (xAxis >= 0) {
          direction = 'left';
        } else {
          direction = 'right';
        }
      } else if (yAxis >= 0) {
        direction = 'top';
      } else {
        direction = 'bottom';
      }

      if (orderIndexX !== currentIndexX || orderIndexY !== currentIndexY) {
        const newOrder = this.changeOrder(
          orderIndexX,
          orderIndexY,
          currentIndexX,
          currentIndexY,
          direction,
        );
        this.props.updateOrder(newOrder);
      }

      this.setState({ mouseX, mouseY });
    }
  };

  handleTouchMove = (event) => {
    if (this.state.isPressed) {
      event.preventDefault();

      this.handleMouseMove(event.changedTouches[0]);

      return false;
    }

    return true;
  };

  handleMouseUp = () => {
    if (this.state.isPressed) {
      this.setState({
        isPressed: false,
        leftDeltaX: 0,
        topDeltaY: 0,
      });

      console.log('mouse up');

      this.props.updateItems();
    }
  };

  handleTouchEnd = (event) => {
    if (this.state.isPressed) {
      event.preventDefault();

      this.handleMouseUp();

      return false;
    }

    return true;
  };

  handleStyles = (styles, coordinates, orderIndexX, orderIndexY) => {
    const { items, springSettings, rowWidth, rowHeight } = this.props;
    const {
      isPressed, pressedCoordinates, mouseX, mouseY,
    } = this.state;
    const [itemIndexX, itemIndexY] = coordinates.split(',');
    const row = items[itemIndexY];
    let item = null;

    if (row && typeof row === 'object' && row.constructor === Array) {
      item = items[itemIndexY][itemIndexX];
    } else {
      item = items[itemIndexY];
    }

    styles.push({
      key: `key-${item.key}`,
      data: { item, coordinates },
      style: {
        height: spring(rowHeight, springSettings),
        opacity: spring(1, springSettings),
        ...(isPressed && coordinates === pressedCoordinates
          ? {
            shadow: spring(16, springSettings),
            x: mouseX,
            y: mouseY,
            zIndex: 99,
          }
          : {
            shadow: 0,
            x: orderIndexX === -1 ? 0 : spring(orderIndexX * rowWidth, springSettings),
            y: orderIndexY === -1 ? 0 : spring(orderIndexY * rowHeight, springSettings),
            zIndex: isPressed ? 0 : spring(0, springSettings),
          }),
      },
    });
  };

  generateStyles = () => {
    const { order } = this.props;
    const styles = [];

    order.forEach((orderRow, orderIndexY) => {
      orderRow.forEach((coordinates, orderIndexX) => {
        this.handleStyles(styles, coordinates, orderIndexX, orderIndexY);
      });
    });

    return styles;
  };

  willEnter = (item) => {
    let x = 0;
    let y = 0;
    let zIndex = 0;
    const { style } = item;

    if (typeof style.x === 'object') {
      x = style.x.val;
    }
    if (typeof style.y === 'object') {
      y = style.y.val;
    }
    if (style.zIndex) {
      ({ zIndex } = style);
    }

    return {
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 0,
      shadow: 0,
      x,
      y,
      zIndex,
    };
  };

  willLeave = (item) => {
    const { springSettings } = this.props;
    const { style } = item;

    return {
      height: spring(0, springSettings),
      marginBottom: spring(0, springSettings),
      paddingTop: spring(0, springSettings),
      paddingBottom: spring(0, springSettings),
      opacity: spring(0, springSettings),
      x: style.x,
      y: style.y,
    };
  };

  renderItem = ({ key, data, style }) => {
    const { ListItemStyles } = this.props;

    return (
      <ListItem
        key={`rvdl-list-item-${key}`}
        style={style}
        data={data}
        ListItemStyles={ListItemStyles}
        handleMouseDown={this.handleMouseDown}
        handleTouchStart={this.handleTouchStart}
      />
    );
  };

  renderListMotion = (styles) => {
    const { ListStyles } = this.props;

    return (
      <ul
        className="rvdl-list"
        style={{
          position: 'absolute',
          display: 'flex',
          overflowX: 'hidden',
          overflowY: 'auto',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          height: '100%',
          ...ListStyles,
        }}
      >
        {styles.length > 0 && styles.map(this.renderItem)}
      </ul>
    );
  };

  render() {
    return (
      <TransitionMotion
        styles={this.generateStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {this.renderListMotion}
      </TransitionMotion>
    );
  }
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  order: PropTypes.array.isRequired,
  rowWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  maxColCount: PropTypes.number.isRequired,
  maxRowCount: PropTypes.number.isRequired,
  ListStyles: PropTypes.object,
  ListItemStyles: PropTypes.object,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  updateOrder: PropTypes.func.isRequired,
  updateItems: PropTypes.func.isRequired,
};

List.defaultProps = {
  ListStyles: {},
  ListItemStyles: {},
};

export default List;
