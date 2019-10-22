import React from 'react';
import PropTypes from 'prop-types';

import Grid from './Grid';

import OrderManager from './OrderManager/OrderManager';
import preventDrag from './Functions/preventDrag';

// entry component, handles the items 1D or 2D array;
// produces and manages state for the order 2D array
// and the keys object
class VirtualDraggableGrid extends React.Component {
  constructor(props) {
    super(props);

    const { items } = this.props;
    const newState = {
      order: [],
      visibleOrder: [],
      keys: {},
    };

    if (Array.isArray(items) && items.length > 0) {
      const {
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        gutterX,
        gutterY,
      } = this.props;

      // create orderObjects, an order 2D array and a keys object
      this.orderManager = new OrderManager(
        this.getProps,
        this.getVDGState,
        this.updateState,
      );
      const { order, keys } = this.orderManager.setOrder({
        items,
        fixedRows,
        fixedColumns,
        fixedWidthAll,
        fixedHeightAll,
        gutterX,
        gutterY,
      });

      newState.order = order;
      newState.keys = keys;
    }

    this.state = newState;
  }

  componentDidUpdate(prevProps) {
    const {
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

    const werePropsUpdated = fixedRows !== prevProps.fixedRows
      || fixedColumns !== prevProps.fixedColumns
      || fixedWidthAll !== prevProps.fixedWidthAll
      || fixedHeightAll !== prevProps.fixedHeightAll
      || gutterX !== prevProps.gutterX
      || gutterY !== prevProps.gutterY
      || leeway !== prevProps.leeway
      || scrollBufferX !== prevProps.scrollBufferX
      || scrollBufferY !== prevProps.scrollBufferY;

    const wereItemsUpdated = this.orderManager.testItemsUpdate();

    if (werePropsUpdated || wereItemsUpdated) {
      // if the items 1D or 2D array or any of the props above
      // are updated, create new orderObjects, a new order 2D array
      // and a new keys object
      const newOrderKeysObject = this.orderManager.setOrder();

      this.updateState(newOrderKeysObject);
    }
  }

  // callback to provide props to child classes
  getProps = () => ({ ...this.props });

  // callback to provide state to child classes
  getVDGState = () => ({ ...this.state });

  // callback to update order 2D array and keys object
  updateState = (newStateObject) => {
    this.setState(newStateObject);
  };

  render() {
    const { items } = this.props;

    if (Array.isArray(items) && items.length > 0) {
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
      } = this.props;
      const {
        order,
        visibleOrder,
        keys,
      } = this.state;
      const {
        orderManager,
      } = this;

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
            visibleOrder={visibleOrder}
            keys={keys}
            orderManager={orderManager}
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
};

export default VirtualDraggableGrid;
