import React from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring } from 'react-motion';

import ListItem from './ListItem';

import getOrderIndex from './OrderFunctions/getOrderIndex';
import getMouseIndex from './OrderFunctions/getMouseIndex';
import changeOrder from './OrderFunctions/changeOrder';
import findMaxPosition from './OrderFunctions/findMaxPosition';
import copyArray2d from './Utilities/copyArray2d';
import preventDrag from './Utilities/preventDrag';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.cachedMouseTimeout = false;
    this.cachedMouseX1 = -1;
    this.cachedMouseY1 = -1;
    this.cachedMouseX2 = -1;
    this.cachedMouseY2 = -1;

    this.state = {
      containerWidth: -1,
      containerHeight: -1,
      scrollLeft: -1,
      scrollTop: -1,
      // scrollWidth: -1,
      // scrollHeight: -1,
      // scrollIndexX: 0,
      // scrollIndexY: 0,
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
        x, y,
      } = dataset;
      const xFloat = parseFloat(x);
      const yFloat = parseFloat(y);

      this.setState({
        isPressed: true,
        pressedItemKey: id,
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
        leftDeltaX, topDeltaY, pressedItemKey,
      } = this.state;
      const { order } = this.props;
      const { pageX, pageY } = event;
      const mouseX = pageX - leftDeltaX;
      const mouseY = pageY - topDeltaY;

      // need to use pressedItemKey to get order indexes to ensure the indexes
      // correspond to the pressed item, even as order changes
      const { orderIndexX, orderIndexY } = getOrderIndex(order, pressedItemKey);

      if (orderIndexX > -1 && orderIndexY > -1) {
        const orderItemKey = order[orderIndexY][orderIndexX].key;

        if (pressedItemKey === orderItemKey) {
          const newOrder = copyArray2d(order, 0, false);
          const { toIndexX, toIndexY } = getMouseIndex(newOrder, mouseX, mouseY);

          if (toIndexX > -1
              && toIndexY > -1
              && (toIndexX !== this.cachedMouseX1 || toIndexY !== this.cachedMouseY1)
              && (toIndexX !== this.cachedMouseX2 || toIndexY !== this.cachedMouseY2)
              && (toIndexX !== orderIndexX || toIndexY !== orderIndexY)) {
            this.cachedMouseX2 = this.cachedMouseX1;
            this.cachedMouseY2 = this.cachedMouseY1;
            this.cachedMouseX1 = toIndexX;
            this.cachedMouseY1 = toIndexY;

            const updatedOrder = changeOrder({
              order,
              newOrder,
              fromIndexX: orderIndexX,
              fromIndexY: orderIndexY,
              toIndexX,
              toIndexY,
            });

            this.props.updateOrder(updatedOrder);
          }
        }

        if (!this.cachedMouseTimeout) {
          const time = 300;
          this.cachedMouseTimeout = true;
          setTimeout(() => {
            this.cachedMouseX2 = -1;
            this.cachedMouseY2 = -1;


            this.cachedMouseTimeout = false;
          }, time);
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
      this.cachedMouseX1 = -1;
      this.cachedMouseY1 = -1;
      this.cachedMouseX2 = -1;
      this.cachedMouseY2 = -1;

      // lastItemKey remains to avoid virtual fade out before it's off screen
      this.setState({
        isPressed: false,
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
      opacity: 0,
      x,
      y,
      zIndex,
    };
  };

  willLeave = (item) => {
    const { springSettings } = this.props;
    const { style } = item;

    return {
      opacity: spring(0, springSettings),
      x: style.x,
      y: style.y,
    };
  };

  handleStyles = ({
    styles, orderObject, orderIndexX, orderIndexY,
  }) => {
    const { items, springSettings } = this.props;
    const {
      isPressed, pressedItemKey, mouseX, mouseY,
    } = this.state;

    const {
      itemIndexX, itemIndexY, left, top,
    } = orderObject;
    const row = items[itemIndexY];
    let item = null;

    if (row && Array.isArray(row)) {
      item = row[itemIndexX];
    } else {
      item = row;
    }

    styles.push({
      key: `key-${item.key}`,
      data: {
        item,
        orderObject,
        orderIndexX,
        orderIndexY,
      },
      style: {
        opacity: spring(1, springSettings),
        ...(item && isPressed && pressedItemKey === item.key
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
    const {
      pressedItemKey, scrollLeft, scrollTop, containerWidth, containerHeight,
    } = this.state;
    const styles = [];
    const leeway = 0.5;
    const scrollBuffer = 100;
    const leftCutoff = scrollLeft * leeway - scrollBuffer;
    const rightCutoff = (scrollLeft + containerWidth) * (1 + leeway) + scrollBuffer;
    const topCutoff = scrollTop * leeway - scrollBuffer;
    const bottomCutoff = (scrollTop + containerHeight) * (1 + leeway) + scrollBuffer;

    order.forEach((orderRow, orderIndexY) => {
      orderRow.forEach((orderObject, orderIndexX) => {
        const {
          left, top, width, height,
        } = orderObject;
        const right = left + width;
        const bottom = top + height;

        // render items within cutoff and the
        // current or last pressed item
        if ((left >= leftCutoff
          && top >= topCutoff
          && right <= rightCutoff
          && bottom <= bottomCutoff)
         || orderObject.key === pressedItemKey) {
          this.handleStyles({
            styles,
            orderObject,
            orderIndexX,
            orderIndexY,
          });
        }
      });
    });

    return styles;
  };


  listSizeRef = (element) => {
    if (element) {
      const { offsetWidth, offsetHeight } = element;
      const update = {};

      if (offsetWidth && this.width !== offsetWidth) {
        update.containerWidth = offsetWidth;
      }

      if (offsetHeight && this.height !== offsetHeight
      ) {
        update.containerHeight = offsetHeight;
      }

      this.setState({ ...update });
    }
  };

  /*
  handleVirtualization = (scrollLeft, scrollTop) => {
    const { order } = this.props;
    const { scrollIndexX, scrollIndexY } = this.state;
    const leeway = 0.7;
    const startingBuffer = 100;
    const left = scrollLeft * leeway - startingBuffer;
    const top = scrollTop * leeway - startingBuffer;
    let orderIndexX = -1;
    let orderIndexY = -1;
    if (left > 0 || top > 0) {
      ({ orderIndexX, orderIndexY } = findPosition({
        order,
        left: left > 0 ? left : 0,
        top: top > 0 ? top : 0,
      }));
    }

    if (orderIndexX > -1 && orderIndexY > -1
      && (orderIndexX !== scrollIndexX || orderIndexY !== scrollIndexY)) {
      updatePositions({ order, orderIndexX, orderIndexY });

      this.setState({ scrollIndexX: orderIndexX, scrollIndexY: orderIndexY });
    }
  }
  */

  handleScroll = (event) => {
    if (event && event.target) {
      const {
        offsetWidth,
        offsetHeight,
        scrollLeft,
        scrollTop,
        // scrollWidth,
        // scrollHeight,
      } = event.target;

      const update = {};
      if (offsetWidth && this.width !== offsetWidth) {
        update.containerWidth = offsetWidth;
      }
      if (offsetHeight && this.height !== offsetHeight) {
        update.containerHeight = offsetHeight;
      }
      if (scrollLeft && this.state.scrollLeft !== scrollLeft) {
        update.scrollLeft = scrollLeft;
      }
      if (scrollTop && this.state.scrollTop !== scrollTop) {
        update.scrollTop = scrollTop;
      }
      /*
      if (scrollWidth && this.scrollWidth !== scrollWidth) {
        update.scrollWidth = scrollWidth;
      }
      if (scrollHeight && this.scrollHeight !== scrollHeight) {
        update.scrollHeight = scrollHeight;
      }
      */

      // this.handleVirtualization(scrollLeft, scrollTop);

      if (Object.keys(update).length > 0) {
        this.setState({ ...update });
      }
    }
  }

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

  renderList = (styles) => {
    const { order, ListStyles } = this.props;

    const { maxRight, maxBottom } = findMaxPosition(order);

    return (
      <div
        ref={this.listSizeRef}
        style={{
          position: 'absolute',
          userSelect: 'none',
          MozUserSelect: 'none',
          overflowX: 'auto',
          overflowY: 'auto',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          height: '100%',
          ...ListStyles,
        }}
        onDragStart={preventDrag}
        onScroll={this.handleScroll}
      >
        <ul
          className="rvdl-list"
          style={{
            position: 'absolute',
            userSelect: 'none',
            MozUserSelect: 'none',
            width: maxRight,
            height: maxBottom,
          }}
          onDragStart={preventDrag}
        >
          {styles.length > 0 && styles.map(this.renderItem)}
        </ul>
      </div>
    );
  };

  render() {
    return (
      <TransitionMotion
        styles={this.generateStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {this.renderList}
      </TransitionMotion>
    );
  }
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  order: PropTypes.array.isRequired,
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
