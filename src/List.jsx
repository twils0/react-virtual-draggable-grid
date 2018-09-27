import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';

import ListItem from './ListItem';

import getMouseIndex from './OrderFunctions/getMouseIndex';
import getOrderIndex from './OrderFunctions/getOrderIndex';
import changeOrder from './OrderFunctions/changeOrder';
import copyArray2d from './Utilities/copyArray2d';
import preventDrag from './Utilities/preventDrag';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.changing = false;

    this.state = {
      isPressed: false,
      pressedItemKey: '',
      leftDeltaX: -1,
      topDeltaY: -1,
      mouseX: -1,
      mouseY: -1,
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

  // find liNode, get dataset information from it, and update state
  handleMouseDown = (event) => {
    const { pageX, pageY } = event;
    let { target } = event;
    let count = 0;
    let liNode = null;

    // a child component of liNode may be clicked; use new react
    // ref features to move up the parent chain, until liNode is found
    // the count variable acts as a failsafe to prevent an infinite loops
    while (!liNode && count <= 20) {
      if (target) {
        if (target.className === 'rvdl-list-item') {
          liNode = target;
        } else {
          target = target.parentElement;
        }
      }

      count += 1;
    }

    if (liNode) {
      const { id, dataset } = liNode;
      const {
        x, y, orderIndexX, orderIndexY,
      } = dataset;
      const orderIndexXInt = parseInt(orderIndexX, 10);
      const orderIndexYInt = parseInt(orderIndexY, 10);
      const xFloat = parseFloat(x);
      const yFloat = parseFloat(y);

      console.log('mouse down', 'x', pageX, xFloat, 'y', pageY, yFloat);

      this.setState({
        isPressed: true,
        pressedItemKey: id,
        pressedOrderIndexX: orderIndexXInt,
        pressedOrderIndexY: orderIndexYInt,
        leftDeltaX: pageX - xFloat,
        topDeltaY: pageY - yFloat,
        mouseX: xFloat,
        mouseY: yFloat,
      });
    }
  };

  // redirect to handleMouseDown; event.preventDefault and return false
  // helps to prevent window scroll while dragging
  handleTouchStart = (event) => {
    event.preventDefault();

    this.handleMouseDown(event.changedTouches[0]);

    return false;
  };

  handleMouseMove = (event) => {
    if (this.state.isPressed) {
      const {
        leftDeltaX, topDeltaY, pressedItemKey, pressedOrderIndexX, pressedOrderIndexY,
      } = this.state;
      const { order } = this.props;
      const { pageX, pageY } = event;
      const mouseX = pageX - leftDeltaX;
      const mouseY = pageY - topDeltaY;

      const { orderIndexX, orderIndexY } = getOrderIndex(order, pressedItemKey);
      const { mouseIndexX, mouseIndexY } = getMouseIndex(order, mouseX, mouseY);

      const yAxis = mouseIndexX - orderIndexX;
      const xAxis = mouseIndexY - orderIndexY;
      let side = null;

      // figure out the side the pressed item is hovering over
      if (Math.abs(yAxis) >= Math.abs(xAxis)) {
        if (yAxis >= 0) {
          side = 'left';
        } else {
          side = 'right';
        }
      } else if (xAxis >= 0) {
        side = 'top';
      } else {
        side = 'bottom';
      }

      // if the pressed item is dragged to a new index,
      // change that object's position in the 2d order array
      if (
        mouseIndexX > -1
        && mouseIndexY > -1
        && (orderIndexX !== mouseIndexX || orderIndexY !== mouseIndexY)
      ) {
        const orderObject = order[orderIndexY][orderIndexX];

        console.log('mouse move', orderIndexX, orderIndexY, pressedOrderIndexX, pressedOrderIndexY);

        if (pressedItemKey === orderObject.key) {
          const { maxRowCount, maxColCount } = this.props;

          const newOrder = copyArray2d(order);

          const updatedOrder = changeOrder({
            order: newOrder,
            maxRowCount,
            maxColCount,
            fromIndexX: orderIndexX,
            fromIndexY: orderIndexY,
            toIndexX: mouseIndexX,
            toIndexY: mouseIndexY,
            side,
          });

          this.props.updateOrder(updatedOrder);
        }
      }

      this.setState({ mouseX, mouseY });
    }
  };

  // redirect to handleMouseMove; event.preventDefault and return false
  // help to prevent window scroll while dragging
  handleTouchMove = (event) => {
    if (this.state.isPressed) {
      event.preventDefault();

      this.handleMouseMove(event.changedTouches[0]);

      return false;
    }

    return true;
  };

  // reset state and update items through updateItems callback
  handleMouseUp = () => {
    if (this.state.isPressed) {
      this.setState({
        isPressed: false,
        pressedOrderIndexX: 0,
        pressedOrderIndexY: 0,
        leftDeltaX: 0,
        topDeltaY: 0,
      });

      this.props.updateItems();
    }
  };

  // redirect to handleMouseUp; event.preventDefault and return false
  // help to prevent window scroll while dragging
  handleTouchEnd = (event) => {
    if (this.state.isPressed) {
      event.preventDefault();

      this.handleMouseUp();

      return false;
    }

    return true;
  };

  handleStyles = ({
    styles, orderObject, orderIndexX, orderIndexY,
  }) => {
    const { items, springSettings } = this.props;
    const {
      isPressed, pressedItemKey, mouseX, mouseY,
    } = this.state;

    const { left, top } = orderObject;

    const { itemIndexX, itemIndexY, height } = orderObject;
    const row = items[itemIndexY];
    let item = null;

    if (row && typeof row === 'object' && row.constructor === Array) {
      item = row[itemIndexX];
    } else {
      item = row;
    }

    console.log('hand style', left, top);

    styles.push({
      key: `key-${item.key}`,
      data: {
        item,
        orderObject,
        orderIndexX,
        orderIndexY,
      },
      style: {
        height: spring(height, springSettings),
        opacity: spring(1, springSettings),
        ...(isPressed && pressedItemKey === item.key
          ? {
            shadow: spring(16, springSettings),
            x: mouseX,
            y: mouseY,
            zIndex: 99,
          }
          : {
            shadow: 0,
            x: orderIndexX === -1 ? 0 : spring(left, springSettings),
            y: orderIndexY === -1 ? 0 : spring(top, springSettings),
            zIndex: isPressed ? 1 : spring(1, springSettings),
          }),
      },
    });
  };

  generateStyles = () => {
    const { order } = this.props;
    const styles = [];

    order.forEach((orderRow, orderIndexY) => {
      orderRow.forEach((orderObject, orderIndexX) => {
        this.handleStyles({
          styles,
          orderObject,
          orderIndexX,
          orderIndexY,
        });
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
    const { ListItemStyles, updateSize } = this.props;

    return (
      <ListItem
        key={`rvdl-list-item-${key}`}
        style={style}
        data={data}
        ListItemStyles={ListItemStyles}
        updateSize={updateSize}
        handleMouseDown={this.handleMouseDown}
        handleTouchStart={this.handleTouchStart}
        onDragStart={preventDrag}
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
          userSelect: 'none',
          overflowX: 'hidden',
          overflowY: 'auto',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          height: '100%',
          ...ListStyles,
        }}
        onDragStart={preventDrag}
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
  maxColCount: PropTypes.number.isRequired,
  maxRowCount: PropTypes.number.isRequired,
  ListStyles: PropTypes.object,
  ListItemStyles: PropTypes.object,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number })
    .isRequired,
  updateSize: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired,
  updateItems: PropTypes.func.isRequired,
};

List.defaultProps = {
  ListStyles: {},
  ListItemStyles: {},
};

export default List;
