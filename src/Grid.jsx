import React from 'react';
import PropTypes from 'prop-types';

import GridItem from './GridItem';

import handleVirtualization from './Functions/handleVirtualization';
import getMouseIndex from './Functions/getMouseIndex';
import changeOrder from './Functions/changeOrder';
import findMaxPosition from './Functions/findMaxPosition';
import preventDrag from './Utilities/preventDrag';

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.gridRef = React.createRef();

    // avoid calling setState too many times, which throws maximum update depth error;
    // error is thrown after 50 updates
    this.resizeChunkSize = Math.max(100, Math.ceil(Object.keys(this.props.keys).length / 50));
    this.resizeIncriment = 0;

    this.updateTime = null;
    this.prevMouseX = -1;
    this.prevMouseY = -1;

    this.state = {
      visibleOrder: [],
      orderBool: false, // eslint-disable-line react/no-unused-state
      containerWidth: -1,
      containerHeight: -1,
      scrollLeft: -1,
      scrollTop: -1,
      prevContainerWidth: -1, // eslint-disable-line react/no-unused-state
      prevContainerHeight: -1, // eslint-disable-line react/no-unused-state
      prevScrollLeft: -1, // eslint-disable-line react/no-unused-state
      prevScrollTop: -1, // eslint-disable-line react/no-unused-state
      isPressed: false,
      pressedItemKey: '',
      prevPressedItemKey: '',
      leftDeltaX: -1,
      topDeltaY: -1,
      mouseX: -1,
      mouseY: -1,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      scrollUpdateX, scrollUpdateY, initialSizeBool, itemsBool, sizeBool,
    } = props;
    const {
      orderBool,
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
      prevContainerWidth,
      prevContainerHeight,
      prevScrollLeft,
      prevScrollTop,
    } = state;
    const update = {};

    if (containerWidth !== prevContainerWidth) {
      update.prevContainerWidth = containerWidth;
    }
    if (containerHeight !== prevContainerHeight) {
      update.prevContainerHeight = containerHeight;
    }
    if (scrollLeft !== prevScrollLeft && Math.abs(scrollLeft - prevScrollLeft) > scrollUpdateX) {
      update.prevScrollLeft = scrollLeft;
    }
    if (scrollTop !== prevScrollTop && Math.abs(scrollTop - prevScrollTop) > scrollUpdateY) {
      update.prevScrollTop = scrollTop;
    }
    if (orderBool) {
      update.orderBool = false;
    }

    if (!initialSizeBool && (itemsBool || sizeBool || Object.keys(update).length > 0)) {
      const {
        order,
        keys,
        leeway,
        scrollBufferX,
        scrollBufferY,
        gutterX,
        gutterY,
        fixedWidthAll,
        fixedHeightAll,
      } = props;

      if (itemsBool) {
        props.toggleItemsBool();
      }
      if (sizeBool) {
        props.toggleSizeBool();
      }

      const visibleOrder = handleVirtualization({
        order,
        keys,
        containerWidth,
        containerHeight,
        scrollLeft,
        scrollTop,
        leeway,
        scrollBufferX,
        scrollBufferY,
        gutterX,
        gutterY,
        fixedWidthAll,
        fixedHeightAll,
      });

      return { ...update, visibleOrder };
    }

    return null;
  }

  componentDidMount() {
    if (this.state.visibleOrder.length === 0) {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('touchmove', this.handleTouchMove, false);
      window.addEventListener('mouseup', this.handleMouseUp);
      window.addEventListener('touchend', this.handleTouchEnd, false);

      window.addEventListener('resize', this.updateGridSize);

      this.updateGridSize();
    }
  }

  componentDidUpdate() {
    if (!this.props.initialSizeBool) {
      this.updateGridSize();
    }
  }

  componentWillUnmount() {
    if (!this.state.visibleOrder.length === 0) {
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('touchmove', this.handleTouchMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
      window.removeEventListener('touchend', this.handleTouchEnd);

      window.addEventListener('resize', this.updateGridSize);
    }
  }

  // find liNode, get dataset information from it, and update state
  handleMouseDown = (event) => {
    const { noDragIds, noDragElements } = this.props;
    let liNode = null;
    let { target } = event;
    const clickedComponent = target.nodeName.toLowerCase();
    const clickedId = target.id;

    // if onlyDrag array greater than 0, include only
    // components included in onlyDrag arrays;
    // comignore if component included in one of the
    // noDrag arrays;
    if (noDragIds.indexOf(clickedId) === -1 && noDragElements.indexOf(clickedComponent) === -1) {
      let count = 0;

      // a child component of liNode may be clicked; use React ref
      // to move up the parent chain, until liNode is found
      // the count variable acts as a failsafe to prevent an
      // infinite loop
      while (!liNode && count <= 20) {
        if (target) {
          if (target.className === 'rvdl-grid-item') {
            liNode = target;
          } else {
            target = target.parentElement;
          }
        }

        count += 1;
      }
    }

    if (liNode) {
      const { pageX, pageY } = event;
      const { id, dataset } = liNode;
      const { x, y } = dataset;
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

  updateOrder = async ({ pressedItemKey, mouseX, mouseY }) => {
    const { keys } = this.props;
    const orderObject = keys[pressedItemKey];

    if (orderObject) {
      const {
        order, gutterX, gutterY, fixedWidthAll, fixedHeightAll,
      } = this.props;
      const { visibleOrder } = this.state;
      const { orderX, orderY } = orderObject;

      const { toIndexX, toIndexY } = getMouseIndex({
        order, visibleOrder, mouseX, mouseY, gutterX, gutterY, fixedWidthAll, fixedHeightAll,
      });

      if (toIndexX > -1 && toIndexY > -1 && (toIndexX !== orderX || toIndexY !== orderY)) {
        const {
          fixedRows, fixedColumns,
        } = this.props;

        const orderKeysObject = changeOrder({
          order,
          keys,
          fixedRows,
          fixedColumns,
          fixedWidthAll,
          fixedHeightAll,
          gutterX,
          gutterY,
          fromIndexX: orderX,
          fromIndexY: orderY,
          toIndexX,
          toIndexY,
        });

        if (orderKeysObject) {
          this.props.updateOrderKeys(orderKeysObject);

          this.setState({ orderBool: true }); // eslint-disable-line react/no-unused-state
        }
      }
    }
  }

  handleMouseMove = (event) => {
    const { isPressed, pressedItemKey } = this.state;

    if (isPressed && pressedItemKey) {
      const { mouseUpdateTime, mouseUpdateX, mouseUpdateY } = this.props;
      const {
        leftDeltaX, topDeltaY,
      } = this.state;
      const { pageX, pageY } = event;
      const mouseX = pageX - leftDeltaX;
      const mouseY = pageY - topDeltaY;
      const currentTime = new Date();

      this.setState({ mouseX, mouseY });

      if (currentTime - this.updateTime > mouseUpdateTime
        && (Math.abs(mouseX - this.prevMouseX) > mouseUpdateX
        || Math.abs(mouseY - this.prevMouseY) > mouseUpdateY)) {
        this.updateOrder({ pressedItemKey, mouseX, mouseY });

        this.updateTime = new Date();
        this.prevMouseX = mouseX;
        this.prevMouseY = mouseY;
      }
    }
  };

  // redirect to handleMouseMove; event.preventDefault and
  // return false help to prevent window scroll while dragging
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
      const { pressedItemKey } = this.state;
      // lastItemKey remains, to avoid virtual fade
      // out before item moves off screen
      this.setState({
        isPressed: false,
        leftDeltaX: 0,
        topDeltaY: 0,
        prevPressedItemKey: pressedItemKey,
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

  handleScroll = (event) => {
    if (event && event.target) {
      const {
        scrollLeft, scrollTop,
      } = event.target;
      const update = {};

      if (scrollLeft > -1 && this.state.scrollLeft !== scrollLeft) {
        update.scrollLeft = scrollLeft;
      }
      if (scrollTop > -1 && this.state.scrollTop !== scrollTop) {
        update.scrollTop = scrollTop;
      }

      if (Object.keys(update).length > 0) {
        this.setState({ ...update });
      }
    }
  };

  updateGridSize = () => {
    if (this.gridRef && this.gridRef.current) {
      const { containerWidth, containerHeight } = this.state;
      const { offsetWidth, offsetHeight } = this.gridRef.current;
      const update = {};

      if (offsetWidth && containerWidth !== offsetWidth) {
        update.containerWidth = offsetWidth;
      }

      if (offsetHeight && containerHeight !== offsetHeight) {
        update.containerHeight = offsetHeight;
      }

      if (Object.keys(update).length > 0) {
        this.setState({ ...update });
      }
    }
  };

  handleSizing = () => {
    const { keys, items } = this.props;
    const resizeArray = [];
    const keysArray = Object.keys(keys);
    const start = this.resizeIncriment * this.resizeChunkSize;
    const end = start + this.resizeChunkSize;
    const limitedEnd = end < keysArray.length ? end : keysArray.length - 1;

    for (let i = start; i <= limitedEnd; i += 1) {
      const orderObject = keys[keysArray[i]];
      const {
        itemX, itemY, width, height,
      } = orderObject;
      const item = items[itemY][itemX];

      resizeArray.push(this.renderItem({
        key: item.key, data: { item, width, height }, style: {},
      }));
    }

    this.props.getResizeChunk(end);

    this.resizeIncriment += 1;

    return resizeArray;
  }

  handleStyle = ({ styles, orderObject }) => {
    const {
      items, fixedWidthAll, fixedHeightAll, gutterX, gutterY,
    } = this.props;
    const {
      pressedItemKey, prevPressedItemKey, mouseX, mouseY,
    } = this.state;

    const {
      key, itemX, itemY, orderX, orderY, left, top, width, height,
    } = orderObject;
    const row = items[itemY];
    let item = null;

    if (row && Array.isArray(row)) {
      item = row[itemX];
    } else {
      item = row;
    }

    const isPressed = this.state.isPressed && key === pressedItemKey;
    const wasPressed = key === prevPressedItemKey;

    styles.push({
      key: `key-${item.key}`,
      data: {
        item,
        isPressed,
        wasPressed,
        width,
        height,
      },
      style: {
        ...(isPressed
          ? {
            x: mouseX,
            y: mouseY,
          }
          : {
            x: fixedWidthAll && fixedHeightAll ? orderX * (fixedWidthAll + gutterX) : left,
            y: fixedWidthAll && fixedHeightAll ? orderY * (fixedHeightAll + gutterY) : top,
          }),
      },
    });
  };

  generateStyles = () => {
    const { keys, getVisibleItems } = this.props;
    const { pressedItemKey, visibleOrder } = this.state;
    const styles = [];
    const pressedOrderObject = keys[pressedItemKey];

    if (pressedOrderObject) {
      this.handleStyle({
        styles, orderObject: pressedOrderObject,
      });
    }

    if (typeof getVisibleItems === 'function') {
      const { items } = this.props;

      const visibleItems = visibleOrder.map(({ itemX, itemY }) => items[itemY][itemX]);

      getVisibleItems(visibleItems);
    }

    visibleOrder.forEach((orderObject) => {
      if (!pressedOrderObject || orderObject.key !== pressedOrderObject.key) {
        this.handleStyle({
          styles, orderObject,
        });
      }
    });

    return styles;
  };

  renderItem = ({ key, data, style }) => {
    const {
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
      updateSize,
    } = this.props;

    return (
      <GridItem
        key={`rvdl-list-item-${key}`}
        style={style}
        data={data}
        fixedWidthAll={fixedWidthAll}
        fixedHeightAll={fixedHeightAll}
        transitionDuration={transitionDuration}
        transitionTimingFunction={transitionTimingFunction}
        transitionDelay={transitionDelay}
        shadowMultiple={shadowMultiple}
        shadowHRatio={shadowHRatio}
        shadowVRatio={shadowVRatio}
        shadowBlur={shadowBlur}
        shadowBlurRatio={shadowBlurRatio}
        shadowSpread={shadowSpread}
        shadowSpreadRatio={shadowSpreadRatio}
        shadowColor={shadowColor}
        GridItemStyles={GridItemStyles}
        updateSize={updateSize}
        handleMouseDown={this.handleMouseDown}
        handleTouchStart={this.handleTouchStart}
        onDragStart={preventDrag}
      />
    );
  };

  renderList = (styles) => {
    const {
      order,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      transitionDuration,
      transitionTimingFunction,
      transitionDelay,
      GridStyles,
    } = this.props;

    const transitionSetup = `${transitionDuration} ${transitionTimingFunction} ${transitionDelay}`;
    const transition = `width ${transitionSetup},
    height ${transitionSetup}`;

    const { maxRight, maxBottom } = findMaxPosition({
      order, fixedWidthAll, fixedHeightAll, gutterX, gutterY,
    });

    return (
      <div
        ref={this.gridRef}
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
          margin: 0,
          padding: 0,
          ...GridStyles,
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
        }}
        onScroll={this.handleScroll}
        onDragStart={preventDrag}
      >
        <ul
          className="rvdl-grid"
          style={{
            position: 'absolute',
            userSelect: 'none',
            MozUserSelect: 'none',
            width: maxRight,
            height: maxBottom,
            margin: 0,
            padding: 0,
            transition,
          }}
          onDragStart={preventDrag}
        >
          {styles.length > 0 && styles.map(this.renderItem)}
        </ul>
      </div>
    );
  };

  render() {
    if (this.props.initialSizeBool) {
      return this.handleSizing();
    }

    const styles = this.generateStyles();

    return this.renderList(styles);
  }
}

Grid.propTypes = {
  items: PropTypes.array.isRequired,
  order: PropTypes.array.isRequired,
  keys: PropTypes.object.isRequired,
  initialSizeBool: PropTypes.bool.isRequired,
  itemsBool: PropTypes.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
  sizeBool: PropTypes.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
  fixedRows: PropTypes.bool.isRequired,
  fixedColumns: PropTypes.bool.isRequired,
  fixedWidthAll: PropTypes.number,
  fixedHeightAll: PropTypes.number,
  noDragElements: PropTypes.array.isRequired,
  noDragIds: PropTypes.array.isRequired,
  gutterX: PropTypes.number.isRequired,
  gutterY: PropTypes.number.isRequired,
  mouseUpdateTime: PropTypes.number.isRequired,
  mouseUpdateX: PropTypes.number.isRequired,
  mouseUpdateY: PropTypes.number.isRequired,
  leeway: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  scrollBufferX: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  scrollBufferY: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  scrollUpdateX: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  scrollUpdateY: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  transitionDuration: PropTypes.string.isRequired,
  transitionTimingFunction: PropTypes.string.isRequired,
  transitionDelay: PropTypes.string.isRequired,
  shadowMultiple: PropTypes.number.isRequired,
  shadowHRatio: PropTypes.number.isRequired,
  shadowVRatio: PropTypes.number.isRequired,
  shadowBlur: PropTypes.number,
  shadowBlurRatio: PropTypes.number.isRequired,
  shadowSpread: PropTypes.number,
  shadowSpreadRatio: PropTypes.number.isRequired,
  shadowColor: PropTypes.string.isRequired,
  GridStyles: PropTypes.object.isRequired,
  GridItemStyles: PropTypes.object.isRequired,
  toggleItemsBool: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  toggleSizeBool: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  getResizeChunk: PropTypes.func.isRequired,
  updateSize: PropTypes.func.isRequired,
  updateOrderKeys: PropTypes.func.isRequired,
  updateItems: PropTypes.func.isRequired,
  getVisibleItems: PropTypes.func,
};

Grid.defaultProps = {
  fixedWidthAll: null,
  fixedHeightAll: null,
  shadowBlur: null,
  shadowSpread: null,
  getVisibleItems: null,
};

export default Grid;
