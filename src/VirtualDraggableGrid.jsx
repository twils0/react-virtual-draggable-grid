import React from 'react';
import PropTypes from 'prop-types';

import Grid from './Grid';

import handleOrder from './Functions/handleOrder';
import updatePositions from './Functions/updatePositions';
import testItemsUpdate from './Functions/testItemsUpdate';
import preventDrag from './Utilities/preventDrag';

class VirtualDraggableGrid extends React.Component {
  constructor(props) {
    super(props);

    const { items } = this.props;
    let order = [];
    let keys = {};

    if (items && Array.isArray(items) && items.length > 0) {
      const {
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        gutterX,
        gutterY,
      } = this.props;

      const result = handleOrder({
        items,
        initialSizeBool: true,
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        gutterX,
        gutterY,
      });

      ({ order, keys } = result);
      this.resizeNeededCount = result.resizeNeededCount;
      this.resizeCount = 0;
    }

    const resizeNeededBool = this.resizeNeededCount > 0;
    this.sizingOrder = resizeNeededBool && order;
    this.sizingKeys = resizeNeededBool && keys;
    this.chunkCount = -1;
    this.resizeEnd = -1;

    this.state = {
      order,
      keys,
      initialSizeBool: resizeNeededBool,
      initialPositionsBool: !resizeNeededBool,
      itemsBool: true,
      sizeBool: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { items } = props;
    const { order, keys, initialPositionsBool } = state;

    if (
      initialPositionsBool
      || (items
        && Array.isArray(items)
        && items.length > 0
        && testItemsUpdate({
          items,
          order,
          keys,
        }))
    ) {
      const {
        fixedRows, fixedColumns, fixedWidthAll, fixedHeightAll, gutterX, gutterY,
      } = props;
      const { itemsBool } = state;
      const update = {};

      if (initialPositionsBool) {
        update.initialPositionsBool = false;
      }
      if (!itemsBool) {
        update.itemsBool = true;
      }

      const result = handleOrder({
        items,
        order,
        intialSizeBool: false,
        keys,
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        gutterX,
        gutterY,
      });

      return { order: result.order, keys: result.keys, ...update };
    }

    return null;
  }

  toggleItemsBool = () => {
    const { itemsBool } = this.state;
    this.setState({ itemsBool: !itemsBool });
  };

  toggleSizeBool = () => {
    const { sizeBool } = this.state;
    this.setState({ sizeBool: !sizeBool });
  };

  getResizeChunk = (end) => {
    this.resizeEnd = end;
  };

  updateSize = ({ key, width, height }) => {
    this.setState((prevState) => {
      const { order, keys } = prevState;
      const newOrderObject = { ...keys[key] };

      if (newOrderObject) {
        const {
          fixedRows, fixedColumns, gutterX, gutterY,
        } = this.props;
        const { initialSizeBool } = this.state;
        const newOrder = initialSizeBool ? this.sizingOrder : [...order];
        const newKeys = initialSizeBool ? this.sizingKeys : { ...keys };
        const { orderX, orderY } = newOrderObject;

        newOrder[orderY][orderX] = newOrderObject;
        newKeys[key] = newOrderObject;

        newOrderObject.width = width;
        newOrderObject.height = height;

        if (!initialSizeBool) {
          const orderKeysObject = updatePositions({
            order: newOrder,
            keys: newKeys,
            orderX,
            orderY,
            fixedRows,
            fixedColumns,
            gutterX,
            gutterY,
          });

          return {
            ...prevState,
            ...orderKeysObject,
            sizeBool: true,
          };
        }

        this.chunkCount += 1;
        this.resizeCount += 1;

        if (this.resizeNeededCount === this.resizeCount) {
          const resizedOrder = this.sizingOrder;
          const resizedKeys = this.sizingKeys;

          this.sizingOrder = null;
          this.sizingKeys = null;

          return {
            ...prevState,
            order: resizedOrder,
            keys: resizedKeys,
            initialSizeBool: false,
            initialPositionsBool: true,
          };
        }

        if (this.chunkCount === this.resizeEnd) {
          return prevState;
        }
      }

      return null;
    });
  };

  updateOrderKeys = ({ order, keys }) => {
    this.setState({ order, keys });
  };

  updateItems = () => {
    const { items, getItems } = this.props;
    const { order } = this.state;
    const newItems = [];

    order.forEach((orderRow, orderY) => {
      const orderRowLen = orderRow.length;

      orderRow.forEach((orderObject, orderX) => {
        const { itemX, itemY } = orderObject;
        const itemRow = items[itemY];
        let item = null;

        if (itemRow && Array.isArray(itemRow)) {
          item = itemRow[itemX];
        } else {
          item = itemRow;
        }

        if (orderRowLen === 1) {
          newItems[orderY] = item;
        } else if (!newItems[orderY]) {
          newItems[orderY] = [];
          newItems[orderY][orderX] = item;
        } else {
          newItems[orderY][orderX] = item;
        }
      });
    });

    if (typeof getItems === 'function') {
      getItems(newItems);
    }
  };

  render() {
    const { items } = this.props;

    if (items && Array.isArray(items) && items.length > 0) {
      const {
        WrapperStyles,
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        noDragElements,
        noDragIds,
        gutterX,
        gutterY,
        mouseUpdateTime,
        mouseUpdateX,
        mouseUpdateY,
        leeway,
        scrollBufferX,
        scrollBufferY,
        scrollUpdateX,
        scrollUpdateY,
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
        GridStyles,
        GridItemStyles,
        getVisibleItems,
      } = this.props;
      const {
        order, keys, initialSizeBool, itemsBool, sizeBool,
      } = this.state;

      return (
        <div
          className="rvdl-wrapper"
          style={{
            position: 'relative',
            display: 'block',
            userSelect: 'none',
            MozUserSelect: 'none',
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            margin: 0,
            padding: 0,
            ...WrapperStyles,
          }}
          onDragStart={preventDrag}
        >
          <Grid
            items={items}
            order={order}
            keys={keys}
            initialSizeBool={initialSizeBool}
            itemsBool={itemsBool}
            sizeBool={sizeBool}
            fixedRows={fixedRows}
            fixedColumns={fixedColumns}
            fixedWidthAll={fixedWidthAll}
            fixedHeightAll={fixedHeightAll}
            noDragElements={noDragElements}
            noDragIds={noDragIds}
            gutterX={gutterX}
            gutterY={gutterY}
            mouseUpdateTime={mouseUpdateTime}
            mouseUpdateX={mouseUpdateX}
            mouseUpdateY={mouseUpdateY}
            leeway={leeway}
            scrollBufferX={scrollBufferX}
            scrollBufferY={scrollBufferY}
            scrollUpdateX={scrollUpdateX}
            scrollUpdateY={scrollUpdateY}
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
            GridStyles={GridStyles}
            GridItemStyles={GridItemStyles}
            getResizeChunk={this.getResizeChunk}
            toggleItemsBool={this.toggleItemsBool}
            toggleSizeBool={this.toggleSizeBool}
            updateSize={this.updateSize}
            updateOrderKeys={this.updateOrderKeys}
            updateItems={this.updateItems}
            getVisibleItems={getVisibleItems}
            onDragStart={preventDrag}
          />
        </div>
      );
    }
    return null;
  }
}

VirtualDraggableGrid.propTypes = {
  items: PropTypes.array,
  fixedRows: PropTypes.bool,
  fixedColumns: PropTypes.bool,
  fixedWidthAll: PropTypes.number,
  fixedHeightAll: PropTypes.number,
  noDragElements: PropTypes.array,
  noDragIds: PropTypes.array,
  gutterX: PropTypes.number,
  gutterY: PropTypes.number,
  mouseUpdateTime: PropTypes.number,
  mouseUpdateX: PropTypes.number,
  mouseUpdateY: PropTypes.number,
  leeway: PropTypes.number,
  scrollBufferX: PropTypes.number,
  scrollBufferY: PropTypes.number,
  scrollUpdateX: PropTypes.number,
  scrollUpdateY: PropTypes.number,
  transitionDuration: PropTypes.string,
  transitionTimingFunction: PropTypes.string,
  transitionDelay: PropTypes.string,
  shadowMultiple: PropTypes.number,
  shadowHRatio: PropTypes.number,
  shadowVRatio: PropTypes.number,
  shadowBlur: PropTypes.number,
  shadowBlurRatio: PropTypes.number,
  shadowSpread: PropTypes.number,
  shadowSpreadRatio: PropTypes.number,
  shadowColor: PropTypes.string,
  WrapperStyles: PropTypes.object,
  GridStyles: PropTypes.object,
  GridItemStyles: PropTypes.object,
  getItems: PropTypes.func,
  getVisibleItems: PropTypes.func,
};

VirtualDraggableGrid.defaultProps = {
  items: [],
  fixedRows: false,
  fixedColumns: false,
  fixedWidthAll: null,
  fixedHeightAll: null,
  noDragElements: [],
  noDragIds: [],
  gutterX: 0,
  gutterY: 0,
  mouseUpdateTime: 100,
  mouseUpdateX: 50,
  mouseUpdateY: 50,
  leeway: 0.1,
  scrollBufferX: 200,
  scrollBufferY: 200,
  scrollUpdateX: 100,
  scrollUpdateY: 200,
  transitionDuration: '0.2s',
  transitionTimingFunction: 'ease-in-out',
  transitionDelay: '0.2s',
  shadowMultiple: 16,
  shadowHRatio: 1,
  shadowVRatio: 1,
  shadowBlur: null,
  shadowBlurRatio: 1.2,
  shadowSpread: null,
  shadowSpreadRatio: 0,
  shadowColor: 'rgba(0, 0, 0, 0.2)',
  WrapperStyles: {},
  GridStyles: {},
  GridItemStyles: {},
  getItems: null,
  getVisibleItems: null,
};

export default VirtualDraggableGrid;
