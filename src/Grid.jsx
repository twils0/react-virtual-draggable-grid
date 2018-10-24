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

    this.updatingOrder = false;
    this.updateTime = null;
    this.prevMouseX = -1;
    this.prevMouseY = -1;

    this.state = {
      visibleOrder: [],
      containerWidth: -1,
      containerHeight: -1,
      scrollLeft: -1,
      scrollTop: -1,
      prevScrollLeft: -1,
      prevScrollTop: -1,
      isPressed: false,
      pressedItemKey: '',
      prevPressedItemKey: '',
      leftDeltaX: -1,
      topDeltaY: -1,
      mouseX: -1,
      mouseY: -1,
    };
  }

  // process move and release events anywhere in the window;
  // resize grid when window resizes
  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove, false);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('touchend', this.handleTouchEnd, false);
    window.addEventListener('resize', this.updateGridSize);

    this.updateGridSize();
  }

  // resize grid on update
  componentDidUpdate(prevProps, prevState) {
    const { itemsBool } = this.props;
    const {
      containerWidth,
      containerHeight,
      prevScrollLeft,
      prevScrollTop,
    } = this.state;

    this.updateGridSize();

    // check for updates to the items 1D or 2D array,
    // container width and height, and scroll left and top;
    // call handleUpdate only when an update occurs
    if (
      itemsBool
      || containerWidth !== prevState.containerWidth
      || containerHeight !== prevState.containerHeight
      || prevScrollLeft !== prevState.prevScrollLeft
      || prevScrollTop !== prevState.prevScrollTop) {
      if (itemsBool) {
        this.props.handleItemsBool();
      }

      this.handleUpdate();
    }
  }

  // remove event listeners when unmounting
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('resize', this.updateGridSize);
  }

  // call handleVirtualization to render visible and buffer grid items;
  // provide visible and buffer grid items to getVisibleItems callback
  handleUpdate = () => {
    const {
      items,
      order,
      keys,
      leeway,
      scrollBufferX,
      scrollBufferY,
      getVisibleItems,
    } = this.props;
    const {
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
    } = this.state;

    // get only the orderObjects corresponding to visible grid items and
    // a limited number of unseen grid items, as a buffer for scrolling
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
    });

    if (
      typeof getVisibleItems === 'function'
        && items
        && items.length > 0
        && visibleOrder
        && visibleOrder.length > 0
    ) {
      const visibleItems = visibleOrder.map(
        ({ itemX, itemY }) => (Array.isArray(items[itemY]) ? items[itemY][itemX] : items[itemY]),
      );

      // callback returning current visibleItems, when visibleOrder changes
      getVisibleItems(visibleItems);
    }

    this.setState({ visibleOrder });
  }

  // find liNode, get dataset information from it, and update state
  handleMouseDown = (event) => {
    const {
      onlyDragElements, onlyDragIds, noDragElements, noDragIds,
    } = this.props;
    let liNode = null;
    let { target } = event;
    const clickedElement = target.nodeName.toLowerCase();
    const clickedId = target.id;
    const onlyDragElementsLen = onlyDragElements.length;
    const onlyDragIdsLen = onlyDragIds.length;

    // only allow drag on elements named in the onlyDragElements arry
    // and on elements with an id contained in the onlyDragIds array,
    // otherwise, prevent drag on elements named in the noDragElements array
    // and elements with an id contained in the noDragIds array
    if ((onlyDragElementsLen > 0
    && onlyDragElements.indexOf(clickedElement) > -1)
    || (onlyDragIdsLen > 0
    && onlyDragIds.indexOf(clickedId) === -1)
    || (onlyDragElementsLen === 0
    && onlyDragIdsLen === 0
    && noDragElements.indexOf(clickedElement) === -1
    && noDragIds.indexOf(clickedId) === -1)
    ) {
      let count = 0;

      // a child component of liNode may be clicked; use React ref
      // to move up the parent chain, until liNode is found;
      // count acts as a failsafe
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
  // help to prevent window scroll while dragging
  handleTouchStart = (event) => {
    event.preventDefault();

    this.handleMouseDown(event.changedTouches[0]);

    return false;
  };

  // update the order 2D array, to change the position of items
  updateOrder = ({ pressedItemKey, mouseX, mouseY }) => {
    const { keys } = this.props;
    const orderObject = keys[pressedItemKey];

    if (orderObject) {
      const { order } = this.props;
      const { visibleOrder } = this.state;
      const { orderX, orderY } = orderObject;

      const { toIndexX, toIndexY } = getMouseIndex({
        order,
        visibleOrder,
        mouseX,
        mouseY,
      });

      if (toIndexX > -1 && toIndexY > -1 && (toIndexX !== orderX || toIndexY !== orderY)) {
        const {
          fixedRows,
          fixedColumns,
          fixedWidthAll,
          fixedHeightAll,
          gutterX,
          gutterY,
        } = this.props;

        // changeOrder handles the actual repositioning;
        // it updates only the orderObjects it must,
        // based on the to and from indexes
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
          // callback to update state on VirtualDraggableGrid component
          this.props.updateOrderKeys(orderKeysObject);

          this.handleUpdate();
        }
      }
    }
  };

  // update x and y position of currently pressed item, allowing the user
  // to drag the item around the screen; call updateOrder periodicatlly
  // to reposition grid items
  handleMouseMove = (event) => {
    const { isPressed, pressedItemKey } = this.state;

    if (isPressed && pressedItemKey) {
      const { mouseUpdateTime, mouseUpdateX, mouseUpdateY } = this.props;
      const { leftDeltaX, topDeltaY } = this.state;
      const { pageX, pageY } = event;
      const mouseX = pageX - leftDeltaX;
      const mouseY = pageY - topDeltaY;
      const currentTime = new Date();

      this.setState({ mouseX, mouseY });

      // block new updates until the previous update has finished;
      // limit the number of calls to updateOrder, using a minimum time
      // interval and a minimum x or y distance traveled by the mouse
      if (
        !this.updatingOrder
        && currentTime - this.updateTime > mouseUpdateTime
        && (Math.abs(mouseX - this.prevMouseX) > mouseUpdateX
        || Math.abs(mouseY - this.prevMouseY) > mouseUpdateY)
      ) {
        this.updatingOrder = true;

        this.updateOrder({ pressedItemKey, mouseX, mouseY });

        this.updateTime = new Date();
        this.prevMouseX = mouseX;
        this.prevMouseY = mouseY;

        this.updatingOrder = false;
      }
    }
  };

  // redirect to handleMouseMove; event.preventDefault and
  // return false to help prevent window scroll while dragging
  handleTouchMove = (event) => {
    if (this.state.isPressed) {
      event.preventDefault();

      this.handleMouseMove(event.changedTouches[0]);

      return false;
    }

    return true;
  };

  // reset state and update the items 1D or 2D array
  handleMouseUp = () => {
    if (this.state.isPressed) {
      const { pressedItemKey } = this.state;
      // prevPressedItemKey prevents an item from disappearing
      // when moving off-screen after release, out of the purview of
      // the visibleOrder array, and sets a higher zIndex for an item
      // returning to its position, allowing it to float above resting items
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

  // keep track of the scroll positions of the grid
  handleScroll = (event) => {
    if (event && event.target) {
      if (this.state.isPressed) {
        const { scrollTop, scrollLeft } = this.state;
        // prevent unwanted scrolling when dragging
        // grid item in chrome
        this.gridRef.current.scrollTop = scrollTop;
        this.gridRef.current.scrollLeft = scrollLeft;
      } else {
        const { scrollLeft, scrollTop } = event.target;
        const { scrollUpdateX, scrollUpdateY } = this.props;
        const { prevScrollLeft, prevScrollTop } = this.state;
        const update = {};

        if (scrollLeft > -1 && this.state.scrollLeft !== scrollLeft) {
          update.scrollLeft = scrollLeft;
        }
        if (scrollTop > -1 && this.state.scrollTop !== scrollTop) {
          update.scrollTop = scrollTop;
        }

        if (Math.abs(scrollLeft - prevScrollLeft) > scrollUpdateX) {
          update.prevScrollLeft = scrollLeft;
        }
        if (Math.abs(scrollTop - prevScrollTop) > scrollUpdateY) {
          update.prevScrollTop = scrollTop;
        }

        if (Object.keys(update).length > 0) {
          this.setState({ ...update });
        }
      }
    }

    return false;
  };

  // keep track of the size of the grid
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

  // use an item object and an orderObject to produce a style object
  handleStyle = ({ styles, orderObject }) => {
    const { items, itemsBool } = this.props;
    const {
      pressedItemKey, prevPressedItemKey, mouseX, mouseY,
    } = this.state;

    const {
      key, itemX, itemY, left, top, width, height,
    } = orderObject;
    const item = Array.isArray(items[itemY]) ? items[itemY][itemX] : items[itemY];

    // make sure item still exists before attempting to render
    if (item) {
    // wasPressed sets a higher zIndex for an item returning to
    // its position, allowing it to float above resting items
      const isPressed = this.state.isPressed && key === pressedItemKey;
      const wasPressed = key === prevPressedItemKey;

      styles.push({
        key: `key-${key}`,
        data: { item, itemsBool },
        style: {
          isPressed,
          wasPressed,
          width,
          height,
          ...(isPressed
            ? {
              x: mouseX,
              y: mouseY,
            }
            : {
              x: left,
              y: top,
            }),
        },
      });
    }
  };

  // generate an array of style objects, which will be passed to renderList
  generateStyles = () => {
    const { keys } = this.props;
    const { pressedItemKey, visibleOrder } = this.state;
    const styles = [];
    const pressedOrderObject = keys[pressedItemKey];

    if (pressedOrderObject) {
      this.handleStyle({
        styles,
        orderObject: pressedOrderObject,
      });
    }

    if (visibleOrder && visibleOrder.length > 0) {
      visibleOrder.forEach((orderObject) => {
        if (orderObject.key !== pressedItemKey) {
          this.handleStyle({
            styles,
            orderObject,
          });
        }
      });
    }

    return styles;
  };

  // render GridItems using style objects
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
        handleMouseDown={this.handleMouseDown}
        handleTouchStart={this.handleTouchStart}
        onDragStart={preventDrag}
      />
    );
  };

  // render an array of Grid Items inside a grid
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

    // find the width and height of the grid, by finding the largest
    // left position plus width and top position plus height
    // of any orderObject in the order 2D array
    const { maxRight, maxBottom } = findMaxPosition({
      order,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
    });

    return (
      <div
        className="rvdl-grid"
        ref={this.gridRef}
        style={{
          overflow: 'auto',
          background: 'transparent',
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          ...GridStyles,
          position: 'absolute',
          userSelect: 'none',
          MozUserSelect: 'none',
        }}
        onScroll={this.handleScroll}
        onDragStart={preventDrag}
      >
        <ul
          style={{
            width: maxRight,
            height: maxBottom,
            margin: 0,
            padding: 0,
            ...GridStyles,
            position: 'absolute',
            userSelect: 'none',
            MozUserSelect: 'none',
            MozTransition: transition,
            WebkitTransition: transition,
            msTransition: transition,
            transition,
            WebkitTransform: 'translateZ(0)',
            MozTransform: 'translateZ(0)',
            mxTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            MozBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitPerspective: 1000,
            MozPerspective: 1000,
            perspective: 1000,
          }}
          onDragStart={preventDrag}
        >
          {styles.length > 0 && styles.map(this.renderItem)}
        </ul>
      </div>
    );
  };

  render() {
    const styles = this.generateStyles();

    return this.renderList(styles);
  }
}

Grid.propTypes = {
  items: PropTypes.array.isRequired,
  order: PropTypes.array.isRequired,
  keys: PropTypes.object.isRequired,
  itemsBool: PropTypes.bool.isRequired,
  gutterX: PropTypes.number.isRequired,
  gutterY: PropTypes.number.isRequired,
  fixedRows: PropTypes.bool.isRequired,
  fixedColumns: PropTypes.bool.isRequired,
  fixedWidthAll: PropTypes.number,
  fixedHeightAll: PropTypes.number,
  onlyDragElements: PropTypes.array.isRequired,
  onlyDragIds: PropTypes.array.isRequired,
  noDragElements: PropTypes.array.isRequired,
  noDragIds: PropTypes.array.isRequired,
  mouseUpdateTime: PropTypes.number.isRequired,
  mouseUpdateX: PropTypes.number.isRequired,
  mouseUpdateY: PropTypes.number.isRequired,
  leeway: PropTypes.number.isRequired,
  scrollBufferX: PropTypes.number.isRequired,
  scrollBufferY: PropTypes.number.isRequired,
  scrollUpdateX: PropTypes.number.isRequired,
  scrollUpdateY: PropTypes.number.isRequired,
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
  handleItemsBool: PropTypes.func.isRequired,
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
