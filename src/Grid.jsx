import React from 'react';
import PropTypes from 'prop-types';

import Interval1D from './Utilities/RedBlackTree/Interval1D';
import GridItem from './GridItem';

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
    // call handleUpdate only when an update has occurred
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

  handleVirtualization = () => {
    const {
      containerWidth,
      containerHeight,
      scrollLeft,
      scrollTop,
    } = this.state;

    const cleanedScrollLeft = scrollLeft > 0 ? scrollLeft : 0;
    const cleanedScrollTop = scrollTop > 0 ? scrollTop : 0;
    const cleanedContainerWidth = containerWidth > 0 ? containerWidth : 0;
    const cleanedContainerHeight = containerHeight > 0 ? containerHeight : 0;
    const scrollRight = cleanedScrollLeft + cleanedContainerWidth;
    const scrollBottom = cleanedScrollTop + cleanedContainerHeight;

    let visibleOrder = [];

    if (scrollRight > 0 && scrollBottom > 0) {
      const {
        order,
        leeway,
        scrollBufferX,
        scrollBufferY,
      } = this.props;

      const leftCutoff = cleanedScrollLeft - containerWidth * leeway - scrollBufferX;
      const rightCutoff = scrollRight + containerWidth * leeway + scrollBufferX;
      const topCutoff = cleanedScrollTop - containerHeight * leeway - scrollBufferY;
      const bottomCutoff = scrollBottom + containerHeight * leeway + scrollBufferY;

      const intervalX = new Interval1D(leftCutoff, rightCutoff);
      const intervalY = new Interval1D(topCutoff, bottomCutoff);

      visibleOrder = order.getIntervalXY(intervalX, intervalY);
    }

    return visibleOrder;
  }

  // call handleVirtualization to render visible and buffer grid items;
  // provide this grid items to getVisibleItems callback
  handleUpdate = () => {
    const {
      items,
      getVisibleItems,
    } = this.props;

    // get only the orderNodes corresponding to visible grid items and
    // a limited number of unseen grid items, as a buffer for scrolling
    const visibleOrder = this.handleVirtualization();

    if (
      typeof getVisibleItems === 'function'
        && items
        && items.length > 0
        && visibleOrder
        && visibleOrder.length > 0
    ) {
      const visibleItems = visibleOrder.map(
        ({ itemX, itemY }) => (!Array.isArray(items[itemY]) ? items[itemY] : items[itemY][itemX]),
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
    const { order } = this.props;
    const fromNode = order.getKey(pressedItemKey);

    if (fromNode) {
      // const { visibleOrder } = this.state;
      // const { orderX, orderY } = orderNode;

      const toNode = order.getCoordinatesValue(mouseX, mouseY);

      /*
      const { toIndexX, toIndexY } = getMouseIndex({
        order,
        visibleOrder,
        mouseX,
        mouseY,
      });
      */

      // switch toNode and fromNode values

      order.exchange(fromNode, toNode);

      /*
      if (toIndexX > -1 && toIndexY > -1 && (toIndexX !== orderX || toIndexY !== orderY)) {
        const {
          fixedRows,
          gutterX,
          gutterY,
        } = this.props;

        // changeOrder handles the actual repositioning;
        // it updates only the orderNodes it must,
        // based on the to and from indexes
        const orderKeysObject = changeOrder({
          order,
          keys,
          fixedRows,
          gutterX,
          gutterY,
          fromIndexX: orderX,
          fromIndexY: orderY,
          toIndexX,
          toIndexY,
        });
        */

      this.handleUpdate();
      // }
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
        // grid items in chrome
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

  // use an item object and an orderNode to produce a style object
  handleStyle = ({ styles, orderNode }) => {
    const { items, itemsBool } = this.props;
    const {
      pressedItemKey, prevPressedItemKey, mouseX, mouseY,
    } = this.state;

    const {
      itemX, itemY, key, width, height, left, top,
    } = orderNode;
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
    const { order } = this.props;
    const { pressedItemKey, visibleOrder } = this.state;
    const styles = [];
    const pressedOrderObject = order.getKey(pressedItemKey);

    if (pressedOrderObject) {
      this.handleStyle({
        styles,
        orderNode: pressedOrderObject,
      });
    }

    if (visibleOrder && visibleOrder.length > 0) {
      visibleOrder.forEach((orderNode) => {
        if (orderNode.key !== pressedItemKey) {
          this.handleStyle({
            styles,
            orderNode,
          });
        }
      });
    }

    return styles;
  };

  // render GridItems using style objects
  renderItem = ({ key, data, style }) => {
    const {
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
    // of any orderNode in the order 2D array

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
            width: order.maxX,
            height: order.maxY,
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
  order: PropTypes.object.isRequired,
  itemsBool: PropTypes.bool.isRequired,
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
  updateItems: PropTypes.func.isRequired,
  getVisibleItems: PropTypes.func,
};

Grid.defaultProps = {
  shadowBlur: null,
  shadowSpread: null,
  getVisibleItems: null,
};

export default Grid;
