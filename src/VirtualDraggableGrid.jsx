import React from 'react';
import PropTypes from 'prop-types';

import Grid from './Grid';

import handleOrder from './Functions/handleOrder';
import testItemsUpdate from './Functions/testItemsUpdate';
import preventDrag from './Utilities/preventDrag';

// entry component, handles the items 1D or 2D array;
// produces and manages state for the order 2D array
// and the keys object
class VirtualDraggableGrid extends React.Component {
  constructor(props) {
    super(props);

    const {
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      leeway,
      scrollBufferX,
      scrollBufferY,
    } = this.props;
    let order = [];
    let keys = {};

    if (items && Array.isArray(items) && items.length > 0) {
      // create orderObjects, an order 2D array and a keys object
      ({ order, keys } = handleOrder({
        items,
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        gutterX,
        gutterY,
      }));
    }

    this.state = {
      order,
      keys,
      itemsBool: true,
      fixedRows, // eslint-disable-line react/no-unused-state
      fixedColumns, // eslint-disable-line react/no-unused-state
      fixedWidthAll, // eslint-disable-line react/no-unused-state
      fixedHeightAll, // eslint-disable-line react/no-unused-state
      gutterX, // eslint-disable-line react/no-unused-state
      gutterY, // eslint-disable-line react/no-unused-state
      leeway, // eslint-disable-line react/no-unused-state
      scrollBufferX, // eslint-disable-line react/no-unused-state
      scrollBufferY, // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      items,
      fixedRows,
      fixedColumns,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      leeway,
      scrollBufferX,
      scrollBufferY,
    } = props;
    const { order, keys } = state;
    const update = {};

    if (fixedRows !== state.fixedRows) {
      update.fixedRows = fixedRows;
    }
    if (fixedColumns !== state.fixedColumns) {
      update.fixedColumns = fixedColumns;
    }
    if (fixedWidthAll !== state.fixedWidthAll) {
      update.fixedWidthAll = fixedWidthAll;
    }
    if (fixedHeightAll !== state.fixedHeightAll) {
      update.fixedHeightAll = fixedHeightAll;
    }
    if (gutterX !== state.gutterX) {
      update.gutterX = gutterX;
    }
    if (gutterY !== state.gutterY) {
      update.gutterY = gutterY;
    }
    if (leeway !== state.leeway) {
      update.leeway = leeway;
    }
    if (scrollBufferX !== state.scrollBufferX) {
      update.scrollBufferX = scrollBufferX;
    }
    if (scrollBufferY !== state.scrollBufferY) {
      update.scrollBufferY = scrollBufferY;
    }

    if (
      Object.keys(update).length > 0
      || (items
        && Array.isArray(items)
        && items.length > 0
        && testItemsUpdate({
          items,
          order,
          keys,
          fixedWidthAll,
          fixedHeightAll,
        }))
    ) {
      update.itemsBool = true;

      // if the items 1D or 2D array or any of the props above
      // are updated, create new orderObjects, a new order 2D array
      // and a new keys object
      const result = handleOrder({
        items,
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        gutterX,
        gutterY,
      });

      return {
        ...update,
        ...result,
      };
    }

    return null;
  }

  handleItemsBool = () => {
    this.setState({ itemsBool: false });
  };

  // callback to update order 2D array and keys object
  updateOrderKeys = ({ order, keys }) => {
    this.setState({ order, keys });
  };

  // callback to return a 1D or 2D array of reordered items;
  // some items may have been ignored when initially processed
  // by handleOrder above, and these items will not be included below
  updateItems = () => {
    const { items, getItems } = this.props;
    const { order } = this.state;
    const newItems = [];

    order.forEach((orderRow, orderY) => {
      const orderRowLen = orderRow.length;

      orderRow.forEach((orderObject, orderX) => {
        const { itemX, itemY } = orderObject;
        const item = Array.isArray(items[itemY]) ? items[itemY][itemX] : items[itemY];

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
        onlyDragElements,
        onlyDragIds,
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
      const { order, keys, itemsBool } = this.state;

      return (
        <div
          className="rvdl-wrapper"
          style={{
            height: '100%',
            width: '100%',
            margin: 0,
            padding: 0,
            ...WrapperStyles,
            display: 'block',
            position: 'relative',
            userSelect: 'none',
            MozUserSelect: 'none',
            boxSizing: 'border-box',
          }}
          onDragStart={preventDrag}
        >
          <Grid
            items={items}
            order={order}
            keys={keys}
            itemsBool={itemsBool}
            fixedRows={fixedRows}
            fixedColumns={fixedColumns}
            fixedWidthAll={fixedWidthAll}
            fixedHeightAll={fixedHeightAll}
            onlyDragElements={onlyDragElements}
            onlyDragIds={onlyDragIds}
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
            handleItemsBool={this.handleItemsBool}
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
  gutterX: PropTypes.number,
  gutterY: PropTypes.number,
  fixedRows: PropTypes.bool,
  fixedColumns: PropTypes.bool,
  fixedWidthAll: PropTypes.number,
  fixedHeightAll: PropTypes.number,
  onlyDragElements: PropTypes.array,
  onlyDragIds: PropTypes.array,
  noDragElements: PropTypes.array,
  noDragIds: PropTypes.array,
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
  onlyDragElements: [],
  onlyDragIds: [],
  noDragElements: [],
  noDragIds: [],
  gutterX: 0,
  gutterY: 0,
  mouseUpdateTime: 100,
  mouseUpdateX: 50,
  mouseUpdateY: 50,
  leeway: 0.1,
  scrollBufferX: 100,
  scrollBufferY: 100,
  scrollUpdateX: 100,
  scrollUpdateY: 100,
  transitionDuration: '0.3s',
  transitionTimingFunction: 'ease',
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
